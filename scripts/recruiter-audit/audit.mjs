import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { AI_SLOP_PATTERNS, EMPLOYER_RUBRICS } from './rubrics.mjs';

const REQUIRED_ROUTES = ['/', '/about', '/projects', '/resume', '/contact', '/blog'];
const REQUIRED_CHANNELS = ['linkedin', 'substack', 'github'];
const PROFILE_ROUTES = new Set(['/', '/about', '/projects', '/resume', '/contact']);
const SEVERITY_ORDER = { red: 0, yellow: 1 };

const CLAIM_FIELD_MAP = {
  displayName: 'display_name',
  currentTitle: 'current_title',
  currentEmployer: 'current_employer',
  linkedinUrl: 'linkedin_url',
  githubUrl: 'github_url',
  substackUrl: 'substack_url',
  websiteUrl: 'website_url',
};

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stableSort(value) {
  if (Array.isArray(value)) return value.map(stableSort);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableSort(value[key])]));
  }
  return value;
}

export function digestBundle(bundle) {
  const copy = structuredClone(bundle);
  delete copy.generatedAt;
  delete copy.digest;
  return sha256(JSON.stringify(stableSort(copy)));
}

export async function loadSnapshots(filePath) {
  const parsed = JSON.parse(await readFile(filePath, 'utf8'));
  if (parsed.example === true) throw new Error('Example snapshots are documentation only; copy the file, remove example=true, and replace every field with current evidence.');
  if (parsed.schemaVersion !== 1) throw new Error('Snapshot bundle must use schemaVersion 1.');
  if (!Array.isArray(parsed.surfaces)) throw new Error('Snapshot bundle must contain a surfaces array.');
  for (const surface of parsed.surfaces) {
    if (!surface.id || !surface.channel || !surface.status || !surface.url) {
      throw new Error('Each snapshot surface requires id, channel, status, and url.');
    }
    surface.fields ??= {};
    surface.claims ??= [];
    surface.evidence ??= [];
  }
  parsed.aliases ??= {};
  return parsed;
}

export function buildBundle({ pages, snapshots, generatedAt = new Date().toISOString(), mode = 'local-build' }) {
  const bundle = {
    schemaVersion: 1,
    generatedAt,
    mode,
    pages,
    snapshots,
  };
  bundle.digest = digestBundle(bundle);
  return bundle;
}

function evidenceFromPage(page, field, excerpt) {
  return {
    sourceId: page.id,
    channel: 'website',
    url: page.url,
    field,
    excerpt: String(excerpt || '').trim().slice(0, 320),
  };
}

function evidenceFromSnapshot(surface, evidenceId, fallbackField = '') {
  const record = surface.evidence.find((item) => item.id === evidenceId);
  if (record) {
    return {
      sourceId: surface.id,
      channel: surface.channel,
      url: record.url || surface.url,
      field: record.field || fallbackField,
      excerpt: String(record.excerpt || record.value || '').trim().slice(0, 320),
      capturedAt: record.capturedAt || surface.capturedAt,
      sourceType: record.sourceType || 'supplied-snapshot',
    };
  }
  return {
    sourceId: surface.id,
    channel: surface.channel,
    url: surface.url,
    field: fallbackField,
    excerpt: '',
    capturedAt: surface.capturedAt,
    sourceType: 'supplied-snapshot',
  };
}

function finding(id, severity, title, message, remediation, evidence = [], surfaces = [], category = 'profile') {
  return { id, severity, category, title, message, remediation, surfaces, evidence };
}

function flattenJsonLd(records) {
  const flattened = [];
  for (const record of records) {
    if (Array.isArray(record)) flattened.push(...record);
    else if (record?.['@graph'] && Array.isArray(record['@graph'])) flattened.push(...record['@graph']);
    else flattened.push(record);
  }
  return flattened;
}

function websiteClaims(pages) {
  const claims = [];
  for (const page of pages) {
    for (const record of flattenJsonLd(page.jsonLd || [])) {
      if (record?.['@type'] !== 'Person') continue;
      const candidates = [
        ['display_name', record.name],
        ['current_title', record.jobTitle],
        ['current_employer', typeof record.worksFor === 'string' ? record.worksFor : record.worksFor?.name],
        ['website_url', record.url],
      ];
      for (const [key, value] of candidates) {
        if (value) claims.push({ key, value, surfaceId: page.id, channel: 'website', evidence: evidenceFromPage(page, 'jsonLd.Person', JSON.stringify(record)) });
      }
      for (const sameAs of record.sameAs || []) {
        const key = sameAs.includes('linkedin.com/') ? 'linkedin_url'
          : sameAs.includes('github.com/') ? 'github_url'
            : sameAs.includes('substack.com') ? 'substack_url'
              : null;
        if (key) claims.push({ key, value: sameAs, surfaceId: page.id, channel: 'website', evidence: evidenceFromPage(page, 'jsonLd.Person.sameAs', sameAs) });
      }
    }
  }
  return claims;
}

function snapshotClaims(snapshots) {
  const claims = [];
  for (const surface of snapshots.surfaces) {
    if (surface.status === 'missing') continue;
    for (const [field, key] of Object.entries(CLAIM_FIELD_MAP)) {
      if (surface.fields[field]) {
        const evidenceId = surface.fieldsEvidence?.[field];
        claims.push({
          key,
          value: surface.fields[field],
          surfaceId: surface.id,
          channel: surface.channel,
          evidence: evidenceFromSnapshot(surface, evidenceId, field),
        });
      }
    }
    for (const claim of surface.claims) {
      if (!claim.key || claim.value == null) continue;
      claims.push({
        key: claim.key,
        value: claim.value,
        surfaceId: surface.id,
        channel: surface.channel,
        evidence: evidenceFromSnapshot(surface, claim.evidenceId, `claims.${claim.key}`),
      });
    }
  }
  return claims;
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value));
    url.hash = '';
    url.search = '';
    return `${url.hostname.replace(/^www\./, '').toLowerCase()}${url.pathname.replace(/\/$/, '')}`;
  } catch {
    return String(value).trim().toLowerCase();
  }
}

function normalizeClaim(key, value, aliases) {
  const raw = String(value).trim();
  if (key.endsWith('_url')) return normalizeUrl(raw);
  if (key === 'current_title') {
    return raw.toLowerCase()
      .replace(/\bgroup pm\b/g, 'group product manager')
      .replace(/[–—-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (key === 'display_name') {
    const match = Object.entries(aliases || {}).find(([, values]) => values.map((item) => item.toLowerCase()).includes(raw.toLowerCase()));
    return match ? match[0].toLowerCase() : raw.toLowerCase();
  }
  return raw.toLowerCase().replace(/\s+/g, ' ');
}

function snippet(text, pattern, size = 180) {
  const match = pattern.exec(text);
  pattern.lastIndex = 0;
  if (!match) return '';
  const start = Math.max(0, match.index - 60);
  return text.slice(start, start + size).replace(/\s+/g, ' ').trim();
}

function sourceRecords(bundle) {
  const pageSources = bundle.pages.map((page) => ({
    id: page.id,
    channel: 'website',
    url: page.url,
    text: [page.title, page.description, page.contentText].filter(Boolean).join('\n'),
    field: 'public-page',
  }));
  const snapshotSources = bundle.snapshots.surfaces.map((surface) => ({
    id: surface.id,
    channel: surface.channel,
    url: surface.url,
    text: [
      ...Object.values(surface.fields || {}).flatMap((value) => Array.isArray(value) ? value : [value]),
      ...(surface.claims || []).map((claim) => claim.value),
      ...(surface.evidence || []).map((record) => record.excerpt || record.value),
    ].filter((value) => typeof value === 'string').join('\n'),
    field: 'supplied-snapshot',
    capturedAt: surface.capturedAt,
  }));
  return [...pageSources, ...snapshotSources];
}

function scoreRubric(rubric, sources) {
  const dimensions = rubric.dimensions.map((dimension) => {
    const signalResults = dimension.signals.map((pattern) => {
      for (const source of sources) {
        const excerpt = snippet(source.text, pattern);
        if (excerpt) {
          return {
            matched: true,
            evidence: {
              sourceId: source.id,
              channel: source.channel,
              url: source.url,
              field: source.field,
              excerpt,
              ...(source.capturedAt ? { capturedAt: source.capturedAt } : {}),
            },
          };
        }
      }
      return { matched: false };
    });
    const matchedSignals = signalResults.filter((result) => result.matched);
    const score = Math.round((matchedSignals.length / dimension.signals.length) * 100);
    return {
      id: dimension.id,
      label: dimension.label,
      weight: dimension.weight,
      score,
      status: score >= 75 ? 'green' : score >= 50 ? 'yellow' : 'red',
      evidence: matchedSignals.map((result) => result.evidence).slice(0, 3),
      missingSignals: dimension.signals.length - matchedSignals.length,
    };
  });
  const score = Math.round(dimensions.reduce((total, dimension) => total + dimension.score * dimension.weight, 0) / 100);
  return {
    label: rubric.label,
    score,
    status: score >= 75 ? 'green' : score >= 60 ? 'yellow' : 'red',
    dimensions,
  };
}

function snapshotCoverageFindings(bundle, now) {
  const findings = [];
  for (const channel of REQUIRED_CHANNELS) {
    const surface = bundle.snapshots.surfaces.find((item) => item.channel === channel);
    if (!surface || surface.status === 'missing') {
      findings.push(finding(
        `snapshot-missing-${channel}`,
        'red',
        `Missing ${channel} public snapshot`,
        `The release gate cannot compare the website with ${channel} without a supplied public or signed-out snapshot.`,
        `Capture ${channel} using the documented public-surface procedure and add evidence-backed fields and claims.`,
        [],
        [channel],
        'coverage',
      ));
      continue;
    }
    if (surface.status === 'blocked' || surface.status === 'partial') {
      findings.push(finding(
        `snapshot-partial-${channel}`,
        'yellow',
        `${channel} snapshot is ${surface.status}`,
        `Some recruiter-visible fields could not be verified on ${channel}.`,
        'Preserve the limitation and add search-index or manual signed-out evidence for every field that affects the audit.',
        surface.evidence.slice(0, 2).map((item) => evidenceFromSnapshot(surface, item.id, item.field)),
        [surface.id],
        'coverage',
      ));
    }
    const capturedAt = surface.capturedAt || bundle.snapshots.capturedAt;
    if (capturedAt) {
      const ageDays = Math.floor((now.getTime() - new Date(capturedAt).getTime()) / 86_400_000);
      if (ageDays > 30) {
        findings.push(finding(
          `snapshot-stale-${channel}`,
          ageDays > 90 ? 'red' : 'yellow',
          `${channel} snapshot is ${ageDays} days old`,
          'Recruiter surfaces and search indexes change frequently; stale evidence weakens the release decision.',
          'Refresh the public snapshot within 30 days of release.',
          [evidenceFromSnapshot(surface, surface.evidence[0]?.id, 'capturedAt')],
          [surface.id],
          'freshness',
        ));
      }
    }
    const evidenceIds = new Set(surface.evidence.map((item) => item.id));
    for (const claim of surface.claims) {
      if (!claim.evidenceId || !evidenceIds.has(claim.evidenceId)) {
        findings.push(finding(
          `claim-missing-evidence-${surface.id}-${claim.key}`,
          'yellow',
          `Claim ${claim.key} lacks evidence`,
          `The ${surface.channel} claim “${claim.value}” cannot be traced to a supplied public excerpt.`,
          'Add an evidence record with URL, field, capture method, timestamp, and exact excerpt.',
          [evidenceFromSnapshot(surface, claim.evidenceId, `claims.${claim.key}`)],
          [surface.id],
          'evidence',
        ));
      }
    }
  }
  return findings;
}

function websiteFindings(bundle) {
  const findings = [];
  const pagesByRoute = new Map(bundle.pages.map((page) => [page.route, page]));
  for (const route of REQUIRED_ROUTES) {
    const page = pagesByRoute.get(route);
    if (!page || page.status !== 200) {
      findings.push(finding(
        `website-route-${route.replace(/\W+/g, '-') || 'home'}`,
        'red',
        `Required route ${route} is unavailable`,
        'A recruiter must be able to reach every primary proof and conversion surface.',
        'Restore the route and verify it with the local build and signed-out production crawl.',
        page ? [evidenceFromPage(page, 'status', String(page.status))] : [],
        [page?.id || `website:${route}`],
        'website',
      ));
      continue;
    }
    for (const [field, value] of [['title', page.title], ['description', page.description], ['canonical', page.canonical]]) {
      if (!value) {
        findings.push(finding(
          `website-${field}-${route.replace(/\W+/g, '-') || 'home'}`,
          'red',
          `${route} is missing ${field}`,
          `Search and share previews need a stable ${field}.`,
          `Add a specific ${field} and rebuild before release.`,
          [evidenceFromPage(page, field, value)],
          [page.id],
          'discoverability',
        ));
      }
    }
    if (/noindex|nofollow/i.test(page.robots)) {
      findings.push(finding(
        `website-noindex-${route.replace(/\W+/g, '-') || 'home'}`,
        'red',
        `${route} blocks indexing`,
        `The robots directive is “${page.robots}”.`,
        'Remove the noindex/nofollow directive from the public recruiter surface.',
        [evidenceFromPage(page, 'robots', page.robots)],
        [page.id],
        'discoverability',
      ));
    }
  }

  const allLinks = bundle.pages.flatMap((page) => page.links.map((link) => ({ page, link })));
  for (const [channel, pattern] of [
    ['linkedin', /linkedin\.com\/in\/peteghiorse/i],
    ['github', /github\.com\/pghio/i],
    ['substack', /peterghiorse\.substack\.com/i],
  ]) {
    const match = allLinks.find(({ link }) => pattern.test(link.href));
    if (!match) {
      findings.push(finding(
        `website-link-${channel}`,
        'red',
        `Website does not link to ${channel}`,
        'The cross-surface recruiter journey breaks when a core profile is not reachable.',
        `Add the canonical ${channel} profile link to a public navigation, footer, contact, or proof surface.`,
        [],
        ['website', channel],
        'conversion',
      ));
    }
  }

  const profileText = bundle.pages
    .filter((page) => PROFILE_ROUTES.has(page.route))
    .map((page) => `${page.title}\n${page.description}\n${page.mainText}\n${page.navText}`)
    .join('\n');
  const positioningSignals = [
    ['role', /\b(?:Group Product Manager|Group PM|product leader)\b/i],
    ['ai-ml', /\b(?:AI\/ML|machine learning|AI product|LLM)\b/i],
    ['builder-founder', /\b(?:founder|built|building|shipped|0[-→to ]+1)\b/i],
    ['evaluation-rigor', /\b(?:evaluation|benchmark|safety|research|field report)\b/i],
  ];
  for (const [id, pattern] of positioningSignals) {
    if (!pattern.test(profileText)) {
      findings.push(finding(
        `positioning-${id}`,
        id === 'role' || id === 'ai-ml' ? 'red' : 'yellow',
        `Profile copy lacks a clear ${id.replace(/-/g, ' ')} signal`,
        'Recruiter search and fast scanning depend on explicit, conventional language.',
        'Add one concrete, evidence-backed statement to a profile surface; do not pad essay copy.',
        [],
        ['website'],
        'positioning',
      ));
    }
  }
  return findings;
}

function contradictionFindings(bundle) {
  const aliases = bundle.snapshots.aliases || {};
  const claims = [...websiteClaims(bundle.pages), ...snapshotClaims(bundle.snapshots)];
  const grouped = Map.groupBy(claims, (claim) => claim.key);
  const findings = [];
  for (const [key, entries] of grouped) {
    const values = Map.groupBy(entries, (entry) => normalizeClaim(key, entry.value, aliases));
    if (values.size <= 1) continue;
    const severity = ['current_title', 'current_employer', 'linkedin_url', 'github_url', 'substack_url', 'website_url'].includes(key) ? 'red' : 'yellow';
    const variants = [...values.entries()].map(([normalized, records]) => ({ normalized, records }));
    findings.push(finding(
      `contradiction-${key}`,
      severity,
      `Contradictory ${key.replace(/_/g, ' ')} claims`,
      variants.map((variant) => `${variant.records.map((record) => record.channel).join('/')} says “${variant.records[0].value}”`).join('; '),
      'Choose the current authoritative value, update every public surface, and retain evidence for the corrected state.',
      entries.map((entry) => entry.evidence),
      [...new Set(entries.map((entry) => entry.surfaceId))],
      'contradiction',
    ));
  }
  return findings;
}

function trackedInboundFindings(bundle) {
  const findings = [];
  for (const surface of bundle.snapshots.surfaces) {
    if (surface.status === 'missing') continue;
    const links = surface.fields.profileLinks || [];
    const websiteLinks = links.filter((link) => {
      try { return new URL(typeof link === 'string' ? link : link.url).hostname.replace(/^www\./, '') === 'peterghiorse.com'; }
      catch { return false; }
    });
    if (!websiteLinks.length) {
      findings.push(finding(
        `inbound-link-missing-${surface.channel}`,
        'yellow',
        `${surface.channel} has no verified website link`,
        'A recruiter cannot move from the profile to the complete proof surface.',
        'Add and publicly verify a website link on the profile or featured-work surface.',
        [evidenceFromSnapshot(surface, surface.fieldsEvidence?.profileLinks, 'profileLinks')],
        [surface.id],
        'conversion',
      ));
      continue;
    }
    for (const link of websiteLinks) {
      const rawUrl = typeof link === 'string' ? link : link.url;
      const parsed = new URL(rawUrl);
      if (parsed.searchParams.get('utm_source')?.toLowerCase() !== surface.channel.toLowerCase()) {
        findings.push(finding(
          `inbound-link-untracked-${surface.channel}`,
          'yellow',
          `${surface.channel} website link lacks channel attribution`,
          `The public website link is ${rawUrl}.`,
          `Add utm_source=${surface.channel}, a stable utm_medium, and a placement-specific utm_content value.`,
          [evidenceFromSnapshot(surface, surface.fieldsEvidence?.profileLinks, 'profileLinks')],
          [surface.id],
          'measurement',
        ));
      }
    }
  }
  return findings;
}

function slopFindings(bundle) {
  const sources = [];
  for (const page of bundle.pages.filter((item) => PROFILE_ROUTES.has(item.route))) {
    sources.push({
      id: page.id,
      channel: 'website',
      url: page.url,
      text: [page.title, page.description, page.navText, page.mainText].join('\n'),
      evidence: (excerpt) => evidenceFromPage(page, 'profile-navigation-copy', excerpt),
    });
  }
  for (const surface of bundle.snapshots.surfaces) {
    const text = ['headline', 'about', 'bio', 'navigation', 'summary']
      .flatMap((field) => surface.fields[field] || [])
      .join('\n');
    sources.push({
      id: surface.id,
      channel: surface.channel,
      url: surface.url,
      text,
      evidence: (excerpt) => ({ ...evidenceFromSnapshot(surface, surface.fieldsEvidence?.about, 'profile-copy'), excerpt }),
    });
  }

  const findings = [];
  for (const source of sources) {
    const matched = AI_SLOP_PATTERNS
      .map((rule) => ({ rule, excerpt: snippet(source.text, rule.pattern) }))
      .filter((item) => item.excerpt);
    if (!matched.length) continue;
    findings.push(finding(
      `ai-slop-${source.id.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
      'yellow',
      `Generic profile language on ${source.channel}`,
      matched.map((item) => item.rule.label).join('; '),
      'Replace profile or navigation filler with a specific role, shipped artifact, measured outcome, or falsifiable claim. Essay bodies are intentionally outside this rule.',
      matched.slice(0, 4).map((item) => source.evidence(item.excerpt)),
      [source.id],
      'ai-slop',
    ));
  }
  return findings;
}

export function auditBundle(bundle, { now = new Date(bundle.generatedAt) } = {}) {
  const findings = [
    ...snapshotCoverageFindings(bundle, now),
    ...websiteFindings(bundle),
    ...contradictionFindings(bundle),
    ...trackedInboundFindings(bundle),
    ...slopFindings(bundle),
  ];
  const sources = sourceRecords(bundle);
  const employers = Object.fromEntries(
    Object.entries(EMPLOYER_RUBRICS).map(([id, rubric]) => [id, scoreRubric(rubric, sources)]),
  );
  for (const [id, result] of Object.entries(employers)) {
    if (result.status === 'green') continue;
    const weakDimensions = result.dimensions.filter((dimension) => dimension.status !== 'green');
    findings.push(finding(
      `employer-rubric-${id}`,
      result.status === 'red' ? 'red' : 'yellow',
      `${result.label} evidence score is ${result.score}/100`,
      `Weak dimensions: ${weakDimensions.map((dimension) => `${dimension.label} (${dimension.score})`).join(', ')}.`,
      'Strengthen profile and project proof with verified artifacts or outcomes; do not manufacture keywords or rewrite essays to game the score.',
      weakDimensions.flatMap((dimension) => dimension.evidence).slice(0, 5),
      ['website', ...REQUIRED_CHANNELS],
      'employer-rubric',
    ));
  }

  findings.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.id.localeCompare(b.id));
  return {
    schemaVersion: 1,
    generatedAt: bundle.generatedAt,
    bundleDigest: bundle.digest,
    summary: {
      red: findings.filter((item) => item.severity === 'red').length,
      yellow: findings.filter((item) => item.severity === 'yellow').length,
      pages: bundle.pages.length,
      snapshotSurfaces: bundle.snapshots.surfaces.length,
      releaseReady: !findings.some((item) => item.severity === 'red'),
    },
    findings,
    employers,
  };
}

export function formatMarkdown(report) {
  const lines = [
    '# Recruiter and LLM public-surface audit',
    '',
    `Bundle: \`${report.bundleDigest}\``,
    '',
    `Release ready: **${report.summary.releaseReady ? 'yes' : 'no'}**  `,
    `Red flags: **${report.summary.red}** · Yellow flags: **${report.summary.yellow}** · Pages: **${report.summary.pages}** · Snapshots: **${report.summary.snapshotSurfaces}**`,
    '',
    '## Employer evidence',
    '',
    '| Employer | Score | Status |',
    '|---|---:|---|',
    ...Object.values(report.employers).map((result) => `| ${result.label} | ${result.score}/100 | ${result.status} |`),
    '',
    '## Findings',
    '',
  ];
  if (!report.findings.length) lines.push('No red or yellow findings.');
  for (const item of report.findings) {
    lines.push(`### ${item.severity.toUpperCase()} · ${item.title}`, '', item.message, '', `Remediation: ${item.remediation}`, '');
    if (item.evidence.length) {
      lines.push('Evidence:');
      for (const evidence of item.evidence) {
        const detail = evidence.excerpt ? ` — “${evidence.excerpt.replace(/\n/g, ' ')}”` : '';
        lines.push(`- [${evidence.sourceId}](${evidence.url}) · ${evidence.field}${detail}`);
      }
      lines.push('');
    }
  }
  lines.push('## Employer rubric detail', '');
  for (const result of Object.values(report.employers)) {
    lines.push(`### ${result.label} · ${result.score}/100`, '', '| Dimension | Weight | Score | Evidence |', '|---|---:|---:|---|');
    for (const dimension of result.dimensions) {
      const citations = dimension.evidence.map((evidence) => `[${evidence.sourceId}](${evidence.url})`).join(', ') || 'none';
      lines.push(`| ${dimension.label} | ${dimension.weight}% | ${dimension.score} | ${citations} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

export function shouldFail(report, failOn = 'red') {
  if (failOn === 'none') return false;
  if (failOn === 'yellow') return report.summary.red > 0 || report.summary.yellow > 0;
  return report.summary.red > 0;
}
