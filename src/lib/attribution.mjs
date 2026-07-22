import profileSource from '../data/profile.json' with { type: 'json' };

export const ATTRIBUTION_STORAGE_KEY = 'pg_session_attribution_v1';
export const ATTRIBUTION_SENT_KEY = 'pg_session_attribution_sent_v1';

export const ALLOWED_EVENTS = new Set(profileSource.attribution.events);
export const ALLOWED_PARAMETERS = new Set(profileSource.attribution.parameters);

const TOKEN_PARAMETERS = new Set([
  'campaign_name',
  'category',
  'contact_method',
  'content_type',
  'cta_type',
  'destination_type',
  'link_placement',
  'placement',
  'share_method',
  'source_channel',
  'source_medium',
  'source_name',
]);
const PATH_PARAMETERS = new Set(['content_path', 'landing_path', 'related_path']);
const HOST_PARAMETERS = new Set(['destination_host', 'referrer_host']);
const NUMBER_PARAMETERS = new Set(['active_seconds', 'scroll_depth']);

export const safeToken = (value, fallback = '(not_set)') => {
  const token = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
  return token || fallback;
};

export const safePath = (value, fallback = '/') => {
  try {
    const parsed = new URL(String(value || fallback), 'https://peterghiorse.com');
    return parsed.pathname.slice(0, 120) || fallback;
  } catch {
    return fallback;
  }
};

export const safeHost = (value, fallback = '(none)') => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return fallback;
  try {
    const parsed = new URL(raw.includes('://') ? raw : `https://${raw}`);
    return parsed.hostname.slice(0, 120) || fallback;
  } catch {
    return fallback;
  }
};

export const getExternalReferrerHost = (referrer, siteOrigin = 'https://peterghiorse.com') => {
  if (!referrer) return '';
  try {
    const parsed = new URL(referrer);
    return parsed.origin === new URL(siteOrigin).origin ? '' : parsed.hostname.toLowerCase();
  } catch {
    return '';
  }
};

export const classifySource = (source, medium, referrerHost = '') => {
  const haystack = `${source} ${medium} ${referrerHost}`;
  if (source === '(direct)') return 'direct';
  if (haystack.includes('linkedin')) return 'linkedin';
  if (haystack.includes('substack')) return 'substack';
  if (haystack.includes('github')) return 'github';
  if (/chatgpt|openai|perplexity|claude|anthropic|gemini|copilot/.test(haystack)) return 'ai_assistant';
  if (/google|bing|duckduckgo|yahoo|baidu/.test(haystack) && medium === 'referral') return 'organic_search';
  if (/email|newsletter|direct_message/.test(medium)) return 'direct_outreach';
  if (medium === 'social') return 'social';
  if (medium === 'referral' || referrerHost) return 'referral';
  return 'campaign';
};

const normalizeStoredAttribution = (stored) => {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return null;
  const expected = [
    'source_channel',
    'source_name',
    'source_medium',
    'campaign_name',
    'link_placement',
    'landing_path',
    'referrer_host',
  ];
  if (!expected.every((key) => typeof stored[key] === 'string')) return null;
  return {
    source_channel: safeToken(stored.source_channel, 'direct'),
    source_name: safeToken(stored.source_name, '(direct)'),
    source_medium: safeToken(stored.source_medium, '(none)'),
    campaign_name: safeToken(stored.campaign_name),
    link_placement: safeToken(stored.link_placement),
    landing_path: safePath(stored.landing_path),
    referrer_host: safeHost(stored.referrer_host),
  };
};

export const captureAttribution = ({
  pageUrl,
  referrer = '',
  siteOrigin = 'https://peterghiorse.com',
  stored = null,
}) => {
  const prior = normalizeStoredAttribution(stored);
  if (prior) return prior;

  const current = new URL(pageUrl, siteOrigin);
  const referrerHost = getExternalReferrerHost(referrer, siteOrigin);
  const source = safeToken(current.searchParams.get('utm_source'), referrerHost || '(direct)');
  const medium = safeToken(current.searchParams.get('utm_medium'), referrerHost ? 'referral' : '(none)');
  return {
    source_channel: classifySource(source, medium, referrerHost),
    source_name: source,
    source_medium: medium,
    campaign_name: safeToken(current.searchParams.get('utm_campaign')),
    link_placement: safeToken(current.searchParams.get('utm_content')),
    landing_path: safePath(current.pathname),
    referrer_host: safeHost(referrerHost),
  };
};

export const sanitizeEvent = (name, parameters = {}, attribution = {}) => {
  if (!ALLOWED_EVENTS.has(name)) return null;
  const combined = { ...attribution, ...parameters };
  const safe = {};
  for (const [key, value] of Object.entries(combined)) {
    if (!ALLOWED_PARAMETERS.has(key)) continue;
    if (TOKEN_PARAMETERS.has(key)) safe[key] = safeToken(value);
    if (PATH_PARAMETERS.has(key)) safe[key] = safePath(value);
    if (HOST_PARAMETERS.has(key)) safe[key] = safeHost(value);
    if (NUMBER_PARAMETERS.has(key) && Number.isFinite(Number(value))) safe[key] = Number(value);
  }
  return { name, parameters: safe };
};

export const getAnalyticsPageLocation = ({
  siteOrigin = 'https://peterghiorse.com',
  path = '/',
  attribution,
}) => {
  const page = new URL(safePath(path), siteOrigin);
  const campaign = {
    utm_source: attribution.source_name,
    utm_medium: attribution.source_medium,
    utm_campaign: attribution.campaign_name,
    utm_content: attribution.link_placement,
  };
  for (const [key, value] of Object.entries(campaign)) {
    if (value && !String(value).startsWith('(')) page.searchParams.set(key, safeToken(value));
  }
  return page.href;
};

export const getAnalyticsReferrer = (attribution) => (
  attribution.referrer_host === '(none)' ? '' : `https://${safeHost(attribution.referrer_host)}/`
);

export const buildTrackedUrl = ({ path = '/', source, medium, campaign, content }) => {
  const destination = new URL(safePath(path), 'https://peterghiorse.com');
  destination.searchParams.set('utm_source', safeToken(source));
  destination.searchParams.set('utm_medium', safeToken(medium));
  destination.searchParams.set('utm_campaign', safeToken(campaign));
  destination.searchParams.set('utm_content', safeToken(content));
  return destination.href;
};
