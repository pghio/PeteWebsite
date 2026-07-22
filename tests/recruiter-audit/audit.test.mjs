import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { auditBundle, buildBundle, digestBundle } from '../../scripts/recruiter-audit/audit.mjs';
import { crawlLocalBuild, extractPage } from '../../scripts/recruiter-audit/html.mjs';

const baseUrl = 'https://peterghiorse.com';
const proofText = `
  Pete Ghiorse is a Group Product Manager and Group PM for AI/ML at Capital One.
  He is the founder of Honeydew and built a production, cross-platform AI assistant for real families on iPhone, Android, and web.
  The full-stack system uses an AI agent, a tool pipeline, orchestration, multimodal text, voice, photo, Whisper, a knowledge graph, real-time sync, and measured latency.
  Published field reports explain evaluation scenarios, benchmark methods, samples, data, corrections, caveats, failures, robustness, safety, restraint, permissions, human control, and review before action.
  Product strategy includes roadmaps, cross-functional engineering, design, data science, user research, analytics, GA4, experiments, outcomes, adoption, platform architecture, customer support, and zero-to-one startup execution.
`;

function page(route, extra = '') {
  const links = [
    { text: 'LinkedIn', href: 'https://linkedin.com/in/peteghiorse', external: true },
    { text: 'GitHub', href: 'https://github.com/pghio', external: true },
    { text: 'Substack', href: 'https://peterghiorse.substack.com', external: true },
  ];
  return {
    id: `website:${route}`,
    channel: 'website',
    source: 'test',
    route,
    url: new URL(route, baseUrl).href,
    status: 200,
    title: route === '/' ? 'Pete Ghiorse — Group PM, Founder & Writer' : `${route.slice(1)} | Pete Ghiorse`,
    description: 'Group PM, founder, and writer on AI product judgment and field research.',
    canonical: new URL(route, baseUrl).href,
    robots: '',
    author: 'Pete Ghiorse',
    headings: [{ level: 1, text: 'Pete Ghiorse' }],
    navText: 'About Projects Blog Resume Contact',
    mainText: `${proofText}\n${extra}`,
    contentText: `${proofText}\n${extra}`,
    links,
    jsonLd: route === '/' ? [{
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Pete Ghiorse',
      url: 'https://peterghiorse.com',
      jobTitle: 'Group PM',
      worksFor: { '@type': 'Organization', name: 'Capital One' },
      sameAs: ['https://linkedin.com/in/peteghiorse', 'https://github.com/pghio', 'https://peterghiorse.substack.com'],
    }] : [],
  };
}

function snapshots(overrides = {}) {
  const capturedAt = '2026-07-20T12:00:00.000Z';
  const makeSurface = (channel, fields, claims) => ({
    id: `${channel}-public`,
    channel,
    status: 'verified',
    url: fields[`${channel}Url`] || `https://${channel}.example/pete`,
    capturedAt,
    fields,
    fieldsEvidence: Object.fromEntries(Object.keys(fields).map((field) => [field, `${channel}-${field}`])),
    claims,
    evidence: Object.entries(fields).map(([field, value]) => ({
      id: `${channel}-${field}`,
      field,
      url: fields[`${channel}Url`] || `https://${channel}.example/pete`,
      capturedAt,
      sourceType: 'manual-signed-out',
      excerpt: Array.isArray(value) ? value.join(' ') : String(value),
    })),
  });

  const linkedinFields = {
    displayName: 'Pete Ghiorse',
    currentTitle: 'Group Product Manager',
    currentEmployer: 'Capital One',
    linkedinUrl: 'https://linkedin.com/in/peteghiorse',
    websiteUrl: 'https://peterghiorse.com?utm_source=linkedin&utm_medium=profile&utm_campaign=recruiter',
    profileLinks: ['https://peterghiorse.com?utm_source=linkedin&utm_medium=profile&utm_campaign=recruiter'],
    headline: 'Group Product Manager, AI/ML | Founder, Honeydew',
    about: proofText,
  };
  const substackFields = {
    displayName: 'Peter Ghiorse',
    currentTitle: 'Group PM',
    currentEmployer: 'Capital One',
    substackUrl: 'https://peterghiorse.substack.com',
    websiteUrl: 'https://peterghiorse.com?utm_source=substack&utm_medium=profile&utm_campaign=recruiter',
    profileLinks: ['https://peterghiorse.com?utm_source=substack&utm_medium=profile&utm_campaign=recruiter'],
    bio: 'Group PM, AI product engineer, and founder of Honeydew. Field reports from production AI.',
  };
  const githubFields = {
    displayName: 'Pete Ghiorse',
    githubUrl: 'https://github.com/pghio',
    websiteUrl: 'https://peterghiorse.com?utm_source=github&utm_medium=profile&utm_campaign=recruiter',
    profileLinks: ['https://peterghiorse.com?utm_source=github&utm_medium=profile&utm_campaign=recruiter'],
    bio: 'AI product builder. Honeydew founder. Production agents, evals, and public methods.',
  };
  const surfaces = [
    makeSurface('linkedin', linkedinFields, []),
    makeSurface('substack', substackFields, []),
    makeSurface('github', githubFields, []),
  ];
  for (const surface of surfaces) Object.assign(surface, overrides[surface.channel] || {});
  return {
    schemaVersion: 1,
    capturedAt,
    aliases: { pete_ghiorse: ['Pete Ghiorse', 'Peter Ghiorse'] },
    surfaces,
  };
}

function completePages() {
  return ['/', '/about', '/projects', '/resume', '/contact', '/blog'].map((route) => page(route));
}

test('extractPage captures metadata, navigation, links, and JSON-LD', () => {
  const html = `<!doctype html><html><head>
    <title>Pete Ghiorse — Group PM</title>
    <meta name="description" content="AI product leader">
    <link rel="canonical" href="https://peterghiorse.com/about">
    <script type="application/ld+json">{"@type":"Person","name":"Pete Ghiorse"}</script>
  </head><body><nav><a href="/about">About</a></nav><main><h1>About Pete</h1><p>Group PM for AI/ML.</p><a href="https://github.com/pghio">GitHub</a></main></body></html>`;
  const result = extractPage(html, { url: `${baseUrl}/about`, route: '/about' });
  assert.equal(result.title, 'Pete Ghiorse — Group PM');
  assert.equal(result.description, 'AI product leader');
  assert.equal(result.canonical, `${baseUrl}/about`);
  assert.match(result.navText, /About/);
  assert.match(result.mainText, /Group PM for AI\/ML/);
  assert.equal(result.links.find((link) => link.text === 'GitHub').external, true);
  assert.equal(result.jsonLd[0].name, 'Pete Ghiorse');
});

test('crawlLocalBuild maps nested index files to stable routes', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'recruiter-audit-'));
  await mkdir(path.join(directory, 'about'));
  await writeFile(path.join(directory, 'index.html'), '<title>Home</title><main>Home</main>');
  await writeFile(path.join(directory, 'about', 'index.html'), '<title>About</title><main>About</main>');
  await writeFile(path.join(directory, 'asset.txt'), 'ignored');
  const pages = await crawlLocalBuild(directory, { baseUrl });
  assert.deepEqual(pages.map((item) => item.route), ['/', '/about']);
});

test('contradictory current titles produce a red evidence-backed finding', () => {
  const snapshotBundle = snapshots();
  const linkedin = snapshotBundle.surfaces.find((surface) => surface.channel === 'linkedin');
  linkedin.fields.currentTitle = 'Senior PM';
  linkedin.evidence.find((item) => item.id === 'linkedin-currentTitle').excerpt = 'Senior PM';
  const bundle = buildBundle({ pages: completePages(), snapshots: snapshotBundle, generatedAt: '2026-07-22T12:00:00.000Z' });
  const report = auditBundle(bundle, { now: new Date('2026-07-22T12:00:00.000Z') });
  const contradiction = report.findings.find((item) => item.id === 'contradiction-current_title');
  assert.equal(contradiction.severity, 'red');
  assert.ok(contradiction.evidence.some((item) => item.channel === 'linkedin'));
  assert.ok(contradiction.evidence.some((item) => item.channel === 'website'));
});

test('AI-slop rules inspect profile surfaces but ignore essay bodies', () => {
  const pages = completePages();
  pages.push(page('/blog/careful-essay', 'In today\'s fast-paced world, this essay quotes a phrase to criticize it.'));
  let bundle = buildBundle({ pages, snapshots: snapshots(), generatedAt: '2026-07-22T12:00:00.000Z' });
  let report = auditBundle(bundle, { now: new Date('2026-07-22T12:00:00.000Z') });
  assert.equal(report.findings.some((item) => item.id.includes('blog-careful-essay') && item.category === 'ai-slop'), false);

  pages.find((item) => item.route === '/about').mainText += ' I am a dynamic professional passionate about innovative solutions.';
  bundle = buildBundle({ pages, snapshots: snapshots(), generatedAt: '2026-07-22T12:00:00.000Z' });
  report = auditBundle(bundle, { now: new Date('2026-07-22T12:00:00.000Z') });
  const slop = report.findings.find((item) => item.id === 'ai-slop-website-about');
  assert.equal(slop.severity, 'yellow');
  assert.match(slop.message, /dynamic professional/);
});

test('employer rubrics emit weighted scores and direct evidence', () => {
  const bundle = buildBundle({ pages: completePages(), snapshots: snapshots(), generatedAt: '2026-07-22T12:00:00.000Z' });
  const report = auditBundle(bundle, { now: new Date('2026-07-22T12:00:00.000Z') });
  for (const employer of ['anthropic', 'openai', 'google']) {
    assert.ok(report.employers[employer].score >= 75, `${employer} should have a green proof bundle`);
    assert.ok(report.employers[employer].dimensions.every((dimension) => dimension.evidence.length > 0));
    assert.ok(report.employers[employer].dimensions.flatMap((dimension) => dimension.evidence).every((item) => item.url));
  }
});

test('bundle digest is deterministic across generation timestamps', () => {
  const first = buildBundle({ pages: completePages(), snapshots: snapshots(), generatedAt: '2026-07-22T12:00:00.000Z' });
  const second = buildBundle({ pages: completePages(), snapshots: snapshots(), generatedAt: '2026-07-23T12:00:00.000Z' });
  assert.equal(first.digest, second.digest);
  assert.equal(digestBundle(first), digestBundle(second));
});
