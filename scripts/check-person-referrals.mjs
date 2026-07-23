import assert from 'node:assert/strict';
import {
  buildAggregateDestination,
  createReferralToken,
  getReferralRoute,
  getTokenId,
  normalizeReferralRoute,
  recordReferralEngagement,
  storeReferralRoute,
} from '../src/lib/person-referrals.mjs';
import { handleReferralRequest } from '../api/referral.js';

const pepper = 'test-referral-pepper-is-longer-than-thirty-two-characters';
const env = {
  REFERRAL_TOKEN_PEPPER: pepper,
  REFERRAL_SITE_URL: 'https://peterghiorse.com',
  REFERRAL_RETENTION_DAYS: '90',
  UPSTASH_REDIS_REST_URL: 'https://private-store.example',
  UPSTASH_REDIS_REST_TOKEN: 'private-test-token',
};
const database = new Map();
const pipelines = [];
const requests = [];

const fakeFetch = async (url, options) => {
  const body = JSON.parse(options.body);
  requests.push({ url, body: options.body });
  if (url.endsWith('/pipeline')) {
    pipelines.push(body);
    return Response.json(body.map(() => ({ result: 'OK' })));
  }
  const [command, key, value] = body;
  if (command === 'SET') {
    database.set(key, value);
    return Response.json({ result: 'OK' });
  }
  if (command === 'GET') return Response.json({ result: database.get(key) || null });
  if (command === 'DEL') {
    database.delete(key);
    return Response.json({ result: 1 });
  }
  return Response.json({ error: 'unsupported test command' }, { status: 400 });
};

const token = createReferralToken();
assert.match(token, /^[A-Za-z0-9_-]{43}$/);
const route = normalizeReferralRoute({
  source: 'linkedin',
  medium: 'direct_message',
  campaign: 'direct_outreach_2026q3',
  placement: 'message_a',
  target: '/projects',
  expires_at: new Date(Date.now() + 7 * 86_400_000).toISOString(),
});
const stored = await storeReferralRoute({ token, route, env, fetchImpl: fakeFetch });
assert.equal(stored.token_id, getTokenId(token, pepper));
assert.ok(!requests[0].body.includes(token), 'Raw token must not reach server-side storage');
assert.ok(!requests[0].body.includes('"person":'), 'Person identity must not reach server-side storage');
assert.ok(!requests[0].body.includes('"company":'), 'Company identity must not reach server-side storage');

const resolved = await getReferralRoute({ token, env, fetchImpl: fakeFetch });
assert.deepEqual(resolved.route, route);
const destination = buildAggregateDestination(route, env.REFERRAL_SITE_URL);
assert.equal(destination, 'https://peterghiorse.com/projects?utm_source=linkedin&utm_medium=direct_message&utm_campaign=direct_outreach_2026q3&utm_content=message_a');
assert.ok(!destination.includes(token));

const getResponse = await handleReferralRequest(new Request(`https://peterghiorse.com/api/referral?token=${token}`), env, fakeFetch);
assert.equal(getResponse.status, 200);
const getHtml = await getResponse.text();
assert.match(getHtml, /Continue to the portfolio/);
assert.ok(!/googletagmanager|google-analytics|gtag\(/.test(getHtml));
assert.equal(getResponse.headers.get('referrer-policy'), 'no-referrer');
assert.match(getResponse.headers.get('cache-control'), /no-store/);

const postResponse = await handleReferralRequest(new Request(`https://peterghiorse.com/api/referral?token=${token}`, { method: 'POST' }), env, fakeFetch);
assert.equal(postResponse.status, 303);
assert.equal(postResponse.headers.get('location'), destination);
assert.equal(pipelines.length, 1);
const recordedBody = JSON.stringify(pipelines[0]);
assert.ok(recordedBody.includes('personal_link_engaged'));
assert.ok(recordedBody.includes(stored.token_id));
assert.ok(!recordedBody.includes(token));
assert.ok(!recordedBody.includes('"person":'));
assert.ok(!recordedBody.includes('"company":'));

await assert.rejects(
  () => storeReferralRoute({ token: createReferralToken(), route: { ...route, target: 'https://evil.example' }, env, fetchImpl: fakeFetch }),
  /allow-listed/,
);

const event = await recordReferralEngagement({ tokenId: stored.token_id, route, env, fetchImpl: fakeFetch, now: new Date('2026-07-22T12:00:00Z') });
assert.equal(event.signal, 'personal_link_engaged');
assert.equal(event.source, 'linkedin');

console.log('Person-level referral checks passed: opaque link, no-GA interstitial, deliberate engagement, clean redirect, and identity separation.');
