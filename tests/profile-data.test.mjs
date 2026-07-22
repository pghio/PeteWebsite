import assert from 'node:assert/strict';
import test from 'node:test';
import profileSource from '../src/data/profile.json' with { type: 'json' };

test('canonical positioning, publication, target roles, and Honeydew date stay locked', () => {
  assert.equal(profileSource.identity.oneLine, 'I lead AI/ML products, build production agents, and publish rigorous evaluations of how they behave.');
  assert.deepEqual(profileSource.publication, {
    name: 'ChatGPeTe',
    description: 'I lead AI/ML products, build production agents, and publish rigorous evaluations of how they behave—plus essays when I have something worth saying.',
    url: 'https://peterghiorse.substack.com',
  });
  assert.deepEqual(profileSource.targeting.roles, ['Group Product Manager', 'Director of Product Management', 'Principal Product Manager', 'Head of AI Product']);
  assert.equal(profileSource.targeting.location.display, 'New York City');
  assert.equal(profileSource.experience.find((item) => item.id === 'honeydew')?.startYear, 2025);
});

test('research snapshots retain exact counts and repositories', () => {
  const byId = new Map(profileSource.research.map((study) => [study.id, study]));
  assert.equal(byId.get('restraint-study-2026-06-24')?.numbers.calls, 4086);
  assert.equal(byId.get('restraint-study-2026-06-24')?.numbers.scenarios, 227);
  assert.equal(byId.get('restraint-study-2026-06-24')?.repository, 'https://github.com/pghio/agent-restraint-evals');
  assert.equal(byId.get('production-benchmark-2026-04-15')?.numbers.calls, 2800);
  assert.equal(byId.get('production-benchmark-2026-04-15')?.numbers.costUsd, 145.83);
  assert.equal(byId.get('production-benchmark-2026-04-15')?.repository, 'https://github.com/pghio/llm-agent-benchmark');
  assert.equal(byId.get('llm-discoverability-field-note-2026-04-14')?.numbers.ga4LlmSessions, 13);
  assert.equal(byId.get('llm-discoverability-field-note-2026-04-14')?.numbers.comparisonLandings, 8);
  assert.equal(byId.get('llm-discoverability-field-note-2026-04-14')?.repository, 'https://github.com/pghio/llm-discoverability-field-note');
});

test('claim records use declared states and unique ids', () => {
  const states = new Set(Object.keys(profileSource.claimStates));
  const ids = profileSource.claims.map((claim) => claim.id);
  assert.equal(new Set(ids).size, ids.length);
  profileSource.claims.forEach((claim) => assert.ok(states.has(claim.state), claim.id));
});
