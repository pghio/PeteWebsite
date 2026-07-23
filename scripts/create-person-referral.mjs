import {
  createReferralToken,
  storeReferralRoute,
} from '../src/lib/person-referrals.mjs';

const parseArguments = (values) => Object.fromEntries(values.map((value) => {
  const match = value.match(/^--([^=]+)=(.*)$/);
  if (!match) throw new Error(`Expected --key=value, received ${value}`);
  return [match[1], match[2]];
}));

const args = parseArguments(process.argv.slice(2));
const expiresDays = Number.parseInt(args['expires-days'] || '90', 10);
if (!Number.isInteger(expiresDays) || expiresDays < 1 || expiresDays > 365) {
  throw new Error('--expires-days must be between 1 and 365');
}

const token = createReferralToken();
const expiresAt = new Date(Date.now() + expiresDays * 86_400_000);
const result = await storeReferralRoute({
  token,
  env: process.env,
  route: {
    source: args.source,
    medium: args.medium,
    campaign: args.campaign,
    placement: args.placement,
    target: args.target,
    expires_at: expiresAt.toISOString(),
  },
});

const baseUrl = (process.env.REFERRAL_SITE_URL || 'https://peterghiorse.com').replace(/\/$/, '');
const crosswalkRow = {
  token_id: result.token_id,
  person: args.person || '',
  company: args.company || '',
  channel: result.route.source,
  medium: result.route.medium,
  campaign: result.route.campaign,
  placement: result.route.placement,
  destination: result.route.target,
  private_link: `${baseUrl}/r/${token}`,
  created: new Date().toISOString(),
  status: 'Active',
  expires: result.route.expires_at,
  notes: 'Assigned-link use is not proof of the intended human; upgrade to self_identified only after contact.',
};

console.log(JSON.stringify(crosswalkRow, null, 2));
