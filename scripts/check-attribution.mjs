import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import profileSource from '../src/data/profile.json' with { type: 'json' };
import { ALLOWED_EVENTS, ALLOWED_PARAMETERS, buildTrackedUrl } from '../src/lib/attribution.mjs';

const playbook = await readFile(new URL('../docs/referral-measurement.md', import.meta.url), 'utf8');
const profileDoc = await readFile(new URL('../docs/profile-source.md', import.meta.url), 'utf8');
const utility = await readFile(new URL('../src/lib/attribution.mjs', import.meta.url), 'utf8');

const expectedLinks = {
  linkedinProfile: 'https://peterghiorse.com/?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=profile_website',
  linkedinFeaturedResume: 'https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume',
  substackProfile: 'https://peterghiorse.com/?utm_source=substack&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=profile_website',
  githubReadme: 'https://peterghiorse.com/?utm_source=github&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=readme_badge',
};

assert.deepEqual(profileSource.attribution.canonicalProfileLinks, expectedLinks);
assert.deepEqual([...ALLOWED_EVENTS], profileSource.attribution.events);
assert.deepEqual([...ALLOWED_PARAMETERS], profileSource.attribution.parameters);

for (const [name, expected] of Object.entries(expectedLinks)) {
  assert.ok(playbook.includes(expected), `playbook is missing ${name}`);
  assert.ok(profileDoc.includes('canonical aggregate referral links'), 'profile documentation must route maintainers to the referral playbook');
  const parsed = new URL(expected);
  for (const parameter of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const value = parsed.searchParams.get(parameter);
    assert.ok(value, `${name} is missing ${parameter}`);
    assert.equal(value, value.toLowerCase(), `${name} has a non-lowercase ${parameter}`);
  }
}

assert.equal(
  buildTrackedUrl({ path: '/resume', source: 'linkedin', medium: 'social', campaign: 'recruiter_visibility', content: 'featured_resume' }),
  expectedLinks.linkedinFeaturedResume,
);

for (const forbidden of ['/r/', 'REFERRAL_TOKEN_PEPPER', 'UPSTASH_REDIS', 'createReferralToken', 'personal_link_engaged']) {
  assert.ok(!utility.includes(forbidden), `aggregate attribution utility contains private-link behavior: ${forbidden}`);
}

for (const forbidden of ['utm_source=pete', 'utm_content=pete', 'utm_campaign=pete']) {
  const corpus = `${JSON.stringify(profileSource.attribution)}\n${playbook}`.toLowerCase();
  assert.ok(!corpus.includes(forbidden), `forbidden person-like UTM: ${forbidden}`);
}

console.log(`Aggregate attribution check passed for ${Object.keys(expectedLinks).length} canonical inbound links.`);
