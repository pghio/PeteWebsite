import { createHmac, randomBytes, randomUUID } from 'node:crypto';

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const VALUE_PATTERN = /^[a-z0-9][a-z0-9._-]{0,79}$/;
const ALLOWED_SOURCES = new Set(['linkedin', 'substack', 'github', 'email', 'other']);
const ALLOWED_MEDIA = new Set(['direct_message', 'email', 'social', 'referral', 'other']);
const ALLOWED_STATIC_TARGETS = new Set(['/', '/resume', '/projects', '/contact', '/blog']);
const BLOG_TARGET_PATTERN = /^\/blog\/[a-z0-9-]+$/;

export const DEFAULT_RETENTION_DAYS = 90;

export const createReferralToken = () => randomBytes(32).toString('base64url');

export const getTokenId = (token, pepper) => {
  if (!TOKEN_PATTERN.test(token || '')) throw new Error('Invalid referral token');
  if (!pepper || pepper.length < 32) throw new Error('REFERRAL_TOKEN_PEPPER must contain at least 32 characters');
  return createHmac('sha256', pepper).update(token).digest('base64url');
};

const validateControlledValue = (value, label) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!VALUE_PATTERN.test(normalized)) throw new Error(`Invalid ${label}`);
  return normalized;
};

const validateTarget = (target) => {
  const normalized = String(target || '').trim();
  if (!ALLOWED_STATIC_TARGETS.has(normalized) && !BLOG_TARGET_PATTERN.test(normalized)) {
    throw new Error('Destination must be an allow-listed peterghiorse.com path');
  }
  return normalized;
};

export const normalizeReferralRoute = (input) => {
  const source = validateControlledValue(input.source, 'source');
  const medium = validateControlledValue(input.medium, 'medium');
  if (!ALLOWED_SOURCES.has(source)) throw new Error('Source is not allow-listed');
  if (!ALLOWED_MEDIA.has(medium)) throw new Error('Medium is not allow-listed');

  const expiresAt = new Date(input.expires_at);
  if (!Number.isFinite(expiresAt.getTime())) throw new Error('Invalid expiration date');

  return {
    version: 1,
    source,
    medium,
    campaign: validateControlledValue(input.campaign, 'campaign'),
    placement: validateControlledValue(input.placement, 'placement'),
    target: validateTarget(input.target),
    expires_at: expiresAt.toISOString(),
  };
};

export const buildAggregateDestination = (route, siteUrl) => {
  const destination = new URL(route.target, siteUrl);
  destination.search = '';
  destination.hash = '';
  destination.searchParams.set('utm_source', route.source);
  destination.searchParams.set('utm_medium', route.medium);
  destination.searchParams.set('utm_campaign', route.campaign);
  destination.searchParams.set('utm_content', route.placement);
  return destination.href;
};

const getRedisCredentials = (env) => {
  const url = env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Private referral storage is not configured');
  return { url, token };
};

const callRedis = async (env, command, fetchImpl = fetch) => {
  const credentials = getRedisCredentials(env);
  const response = await fetchImpl(credentials.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Referral storage returned ${response.status}`);
  const result = await response.json();
  if (result.error) throw new Error('Referral storage rejected the command');
  return result.result;
};

const callRedisPipeline = async (env, commands, fetchImpl = fetch) => {
  const credentials = getRedisCredentials(env);
  const response = await fetchImpl(`${credentials.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!response.ok) throw new Error(`Referral storage returned ${response.status}`);
  const results = await response.json();
  if (!Array.isArray(results) || results.some((item) => item.error)) {
    throw new Error('Referral storage rejected the event write');
  }
  return results;
};

const routeKey = (tokenId) => `pg:referral:route:${tokenId}`;

export const storeReferralRoute = async ({ token, route, env, fetchImpl = fetch }) => {
  const normalized = normalizeReferralRoute(route);
  const tokenId = getTokenId(token, env.REFERRAL_TOKEN_PEPPER);
  const ttlSeconds = Math.floor((new Date(normalized.expires_at).getTime() - Date.now()) / 1000);
  if (ttlSeconds < 60) throw new Error('Referral link must expire at least one minute in the future');

  await callRedis(env, ['SET', routeKey(tokenId), JSON.stringify(normalized), 'EX', ttlSeconds], fetchImpl);
  return { token_id: tokenId, route: normalized };
};

export const getReferralRoute = async ({ token, env, fetchImpl = fetch }) => {
  const tokenId = getTokenId(token, env.REFERRAL_TOKEN_PEPPER);
  const stored = await callRedis(env, ['GET', routeKey(tokenId)], fetchImpl);
  if (!stored) return null;
  const route = normalizeReferralRoute(typeof stored === 'string' ? JSON.parse(stored) : stored);
  if (new Date(route.expires_at).getTime() <= Date.now()) return null;
  return { token_id: tokenId, route };
};

export const recordReferralEngagement = async ({ tokenId, route, env, fetchImpl = fetch, now = new Date() }) => {
  const retentionDays = Number.parseInt(env.REFERRAL_RETENTION_DAYS || '', 10) || DEFAULT_RETENTION_DAYS;
  const retentionMs = Math.min(Math.max(retentionDays, 1), 365) * 86_400_000;
  const clickedAt = now.toISOString();
  const event = {
    event_id: randomUUID(),
    token_id: tokenId,
    signal: 'personal_link_engaged',
    clicked_at: clickedAt,
    expires_at: new Date(now.getTime() + retentionMs).toISOString(),
    source: route.source,
    medium: route.medium,
    campaign: route.campaign,
    placement: route.placement,
    target: route.target,
  };
  const eventKey = 'pg:referral:events';

  await callRedisPipeline(env, [
    ['ZADD', eventKey, now.getTime(), JSON.stringify(event)],
    ['ZREMRANGEBYSCORE', eventKey, 0, now.getTime() - retentionMs],
    ['HINCRBY', 'pg:referral:counts', tokenId, 1],
    ['HSET', 'pg:referral:last_engaged_at', tokenId, clickedAt],
  ], fetchImpl);
  return event;
};

export const revokeReferralRoute = async ({ tokenId, env, fetchImpl = fetch }) => {
  if (!/^[A-Za-z0-9_-]{43}$/.test(tokenId || '')) throw new Error('Invalid token ID');
  await callRedis(env, ['DEL', routeKey(tokenId)], fetchImpl);
};

export const listReferralEvents = async ({ env, fetchImpl = fetch }) => {
  const stored = await callRedis(env, ['ZRANGE', 'pg:referral:events', 0, -1], fetchImpl);
  return (stored || []).map((item) => (typeof item === 'string' ? JSON.parse(item) : item));
};
