import assert from 'node:assert/strict';
import profileSource from '../src/data/profile.json' with { type: 'json' };
import publicProfile from '../public/profile.json' with { type: 'json' };
import publicResearch from '../public/research.json' with { type: 'json' };

const expectedProfile = {
  schemaVersion: profileSource.schemaVersion,
  lastReviewed: profileSource.lastReviewed,
  name: profileSource.identity.publicName,
  fullName: profileSource.identity.fullName,
  headline: profileSource.identity.headline,
  currentRole: {
    title: profileSource.identity.currentRole,
    employer: profileSource.identity.employer,
    since: profileSource.identity.roleSince,
    claimId: 'identity.current-role',
  },
  location: profileSource.targeting.location,
  targetRoles: profileSource.targeting.roles,
  targetDomains: profileSource.targeting.domains,
  recruiterFocus: profileSource.targeting.recruiterFocus,
  oneLine: profileSource.identity.oneLine,
  practiceLoop: profileSource.practice.loop,
  qualityStatement: profileSource.practice.qualityStatement,
  publication: profileSource.publication,
  experience: profileSource.experience.map(({ id, company, role, startYear, endYear, status, claimIds }) => ({
    id,
    company,
    role,
    startYear,
    endYear,
    status,
    claimIds,
  })),
  education: profileSource.education,
  links: profileSource.links,
  research: profileSource.research.map(({ id, url, repository, state }) => ({ id, url, repository, state })),
};

assert.deepEqual(publicProfile, expectedProfile, 'public/profile.json has drifted from src/data/profile.json');
assert.deepEqual(publicResearch, {
  schemaVersion: profileSource.schemaVersion,
  lastReviewed: profileSource.lastReviewed,
  studies: profileSource.research,
}, 'public/research.json has drifted from src/data/profile.json');

console.log('Public profile and research JSON match the canonical registry.');
