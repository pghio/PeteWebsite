import source from './profile.json';

export const PROFILE_SOURCE = source;
export const PUBLICATION = source.publication;
export const CLAIM_STATES = source.claimStates;
export const CLAIMS = source.claims;
export const RESEARCH = source.research;
export const ATTRIBUTION = source.attribution;

export const PROFILE = {
  name: source.identity.publicName,
  fullName: source.identity.fullName,
  role: source.identity.currentRole,
  employer: source.identity.employer,
  roleSince: source.identity.roleSince,
  headline: source.identity.headline,
  oneLine: source.identity.oneLine,
  publication: source.publication,
  location: source.targeting.location,
  focusDomains: source.targeting.domains,
  practiceLoop: source.practice.loop,
  focusAreas: source.practice.focusAreas,
  qualityStatement: source.practice.qualityStatement,
  experience: source.experience,
  education: source.education,
  links: source.links,
  inboundWebsiteLinks: source.attribution.canonicalProfileLinks,
} as const;
