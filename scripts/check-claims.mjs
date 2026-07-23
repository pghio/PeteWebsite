import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import profileSource from '../src/data/profile.json' with { type: 'json' };

const validStates = new Set(Object.keys(profileSource.claimStates));
const claimIds = new Set();
for (const claim of profileSource.claims) {
  assert.ok(claim.id && !claimIds.has(claim.id), `duplicate or empty claim id: ${claim.id}`);
  claimIds.add(claim.id);
  assert.ok(validStates.has(claim.state), `unknown claim state on ${claim.id}: ${claim.state}`);
  assert.ok(claim.text && claim.evidence && claim.reviewed, `incomplete claim record: ${claim.id}`);
}

for (const experience of profileSource.experience) {
  for (const claimId of experience.claimIds) assert.ok(claimIds.has(claimId), `${experience.id} references missing claim ${claimId}`);
}

const honeydew = profileSource.experience.find((item) => item.id === 'honeydew');
assert.equal(honeydew?.startYear, 2025, 'Honeydew start year must remain 2025');
assert.equal(profileSource.identity.oneLine, 'I lead AI/ML products, build production agents, and publish rigorous evaluations of how they behave.');
assert.equal(profileSource.targeting.location.display, 'New York City');

const researchById = new Map(profileSource.research.map((study) => [study.id, study]));
const restraint = researchById.get('restraint-study-2026-06-24');
assert.deepEqual(
  { scenarios: restraint?.numbers.scenarios, models: restraint?.numbers.models, trialsPerScenario: restraint?.numbers.trialsPerScenario, calls: restraint?.numbers.calls, parseFailuresDropped: restraint?.numbers.parseFailuresDropped, guardScenarios: restraint?.numbers.guardScenarios },
  { scenarios: 227, models: 6, trialsPerScenario: 3, calls: 4086, parseFailuresDropped: 14, guardScenarios: 35 },
);
const benchmark = researchById.get('production-benchmark-2026-04-15');
assert.deepEqual(
  { models: benchmark?.numbers.models, scenarios: benchmark?.numbers.scenarios, trialsPerScenario: benchmark?.numbers.trialsPerScenario, calls: benchmark?.numbers.calls, costUsd: benchmark?.numbers.costUsd },
  { models: 8, scenarios: 35, trialsPerScenario: 10, calls: 2800, costUsd: 145.83 },
);
const discoverability = researchById.get('llm-discoverability-field-note-2026-04-14');
assert.equal(discoverability?.numbers.ga4LlmSessions, 13);
assert.equal(discoverability?.numbers.comparisonLandings, 8);

if (process.argv.includes('--data-only')) {
  console.log('Canonical claim registry passed data-only checks.');
  process.exit(0);
}

const textExtensions = new Set(['.astro', '.md', '.mjs', '.js', '.json', '.txt', '.ts']);
const files = [];
const walk = async (path) => {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.git')) continue;
    const child = join(path, entry.name);
    if (entry.isDirectory()) await walk(child);
    if (entry.isFile() && textExtensions.has(extname(entry.name))) files.push(child);
  }
};
await walk(fileURLToPath(new URL('../src', import.meta.url)));
await walk(fileURLToPath(new URL('../public', import.meta.url)));

const surfaces = await Promise.all(files.map(async (file) => ({ file, text: await readFile(file, 'utf8') })));
const violations = [];
const forbidden = [
  { pattern: /Honeydew[^\n]{0,180}(?:2024\s*-\s*Present|founded\s+in\s+2024)/gi, label: 'Honeydew 2024 start' },
  { pattern: /processing requests in\s*<2 seconds/gi, label: 'unsupported latency' },
  { pattern: /Whisper AI with\s*>95% accuracy/gi, label: 'unsupported transcription accuracy' },
  { pattern: /WebSocket sync\s*\(<50ms\)/gi, label: 'unsupported sync speed' },
  { pattern: /80% cache hit rate/gi, label: 'unsupported cache hit rate' },
  { pattern: /\bhoneydew\.family\b/gi, label: 'stale Honeydew domain' },
  { pattern: /\bSenior Product Manager\b/gi, label: 'stale role title' },
  { pattern: /\bAI product engineer\b/gi, label: 'stale positioning' },
  { pattern: /\b2K MAU\b|\b98% retention\b|\b33B\+ monthly transactions\b/gi, label: 'unsupported scale claim' },
  { pattern: /(?:there is|does not currently link) no verified public (?:data |raw-results )?repository/gi, label: 'superseded repository availability' },
  { pattern: /\brecruiter snapshot\b|\bfor recruiters\b|\btarget roles\b/gi, label: 'public job-search framing' },
  { pattern: /open to regular Bay Area travel/gi, label: 'public travel availability' },
  { pattern: /recruiter_visibility|recruiter_outreach/gi, label: 'public recruiting attribution label' },
];

for (const { file, text } of surfaces) {
  if (file.endsWith('src/data/profile.json')) continue;
  for (const { pattern, label } of forbidden) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) violations.push(`${file}: ${label}`);
  }
}

if (violations.length) {
  console.error('Public claim surface check failed:\n');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log(`Public claim surface check passed across ${surfaces.length} text files.`);
