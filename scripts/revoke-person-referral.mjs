import { revokeReferralRoute } from '../src/lib/person-referrals.mjs';

const tokenIdArgument = process.argv.slice(2).find((value) => value.startsWith('--token-id='));
const tokenId = tokenIdArgument?.slice('--token-id='.length) || '';
await revokeReferralRoute({ tokenId, env: process.env });
console.log(`Revoked referral route ${tokenId}. Update its private crosswalk status to Revoked.`);
