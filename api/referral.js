import {
  buildAggregateDestination,
  getReferralRoute,
  recordReferralEngagement,
} from '../src/lib/person-referrals.mjs';

const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

const renderContinuePage = (token) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow,noarchive">
    <title>Continue to Pete Ghiorse’s portfolio</title>
    <style>
      :root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: #e2e8f0; }
      main { width: min(34rem, calc(100% - 2rem)); padding: 2rem; border: 1px solid #334155; border-radius: 1.25rem; background: #111827; box-shadow: 0 24px 60px rgb(0 0 0 / .3); }
      p { line-height: 1.65; color: #cbd5e1; }
      .eyebrow { color: #60a5fa; font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
      h1 { margin: .5rem 0 1rem; font-size: clamp(1.8rem, 6vw, 2.5rem); line-height: 1.1; color: white; }
      button { margin-top: .75rem; width: 100%; padding: .9rem 1.1rem; border: 0; border-radius: .75rem; background: #2563eb; color: white; font: inherit; font-weight: 700; cursor: pointer; }
      small { display: block; margin-top: 1rem; line-height: 1.5; color: #94a3b8; }
      a { color: #93c5fd; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Private referral link</div>
      <h1>Continue to Pete’s portfolio</h1>
      <p>This link was created for one-to-one outreach. Continuing records that this assigned link was deliberately opened. It does not use Google Analytics on this page, and it does not collect an IP address, device fingerprint, location, full referrer, or user agent for Pete’s referral report.</p>
      <form method="post" action="/r/${token}">
        <button type="submit">Continue to the portfolio</button>
      </form>
      <small>The private record is retained for up to 90 days and is used only to understand recruiting outreach. A forwarded link may be opened by someone other than its intended recipient. See the <a href="/privacy">privacy notice</a>.</small>
    </main>
  </body>
</html>`;

export const handleReferralRequest = async (request, env = process.env, fetchImpl = fetch) => {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token') || '';
  const siteUrl = env.REFERRAL_SITE_URL || 'https://peterghiorse.com';

  try {
    const resolved = await getReferralRoute({ token, env, fetchImpl });
    if (!resolved) return new Response('This referral link is invalid, expired, or revoked.', { status: 410, headers: responseHeaders });

    if (request.method === 'GET') {
      return new Response(renderContinuePage(token), {
        status: 200,
        headers: { ...responseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (request.method === 'POST') {
      await recordReferralEngagement({ tokenId: resolved.token_id, route: resolved.route, env, fetchImpl });
      return new Response(null, {
        status: 303,
        headers: { ...responseHeaders, Location: buildAggregateDestination(resolved.route, siteUrl) },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: { ...responseHeaders, Allow: 'GET, POST' } });
  } catch {
    return new Response('Private referral measurement is temporarily unavailable.', { status: 503, headers: responseHeaders });
  }
};

export default {
  fetch(request) {
    return handleReferralRequest(request);
  },
};
