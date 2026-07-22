# PeteWebsite

The public portfolio, research archive, and recruiter-facing profile for Pete Ghiorse: Group Product Manager for AI/ML, founder of Honeydew, and hands-on builder.

This repository demonstrates more than a static site. It is a small publishing system for evidence-backed technical work: structured metadata, consent-aware measurement, full-content RSS, cross-surface distribution, visible corrections, and a checked source of truth for public claims.

## What the project proves

- **Product judgment:** the work is organized around real decisions, operating constraints, and what changed after evidence arrived.
- **Technical fluency:** Astro, TypeScript, structured data, analytics instrumentation, RSS, and automated profile checks.
- **Editorial rigor:** methods, limitations, negative results, and corrections remain visible beside the conclusions.
- **Distribution discipline:** the website is canonical; LinkedIn, Substack, GitHub, RSS, and machine-readable profile files route back to it.

The canonical public narrative and approved claims live in [`docs/profile-source.md`](docs/profile-source.md). The production build runs a profile-sync check so stale titles, domains, or unsupported metrics cannot quietly re-enter core profile surfaces.

## Tech Stack

- [Astro](https://astro.build/) — Static site framework
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [Vercel](https://vercel.com/) — Deployment

## Development

```bash
npm install
npm run check:profile
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Newsletter and analytics

- The full-content website feed is available at `/rss.xml` and is the source for Substack archive imports.
- Consent-gated analytics defaults to the PeteWebsite GA4 stream (`G-0JQ5NNRQM2`).
- Inbound attribution preserves consented source, medium, campaign, placement, and landing-page context; `contact_intent` is the recruiter-funnel conversion.
- Canonical profile URLs and GA4 reporting setup live in `docs/referral-measurement.md`.
- Set `PUBLIC_GA_MEASUREMENT_ID` to override that public measurement ID for a preview or alternate environment.
- Reader email addresses remain in Substack; website analytics accepts only the anonymous events and parameters allow-listed in `src/components/Analytics.astro`.

## Deployment

Deployed to Vercel. Push to `main` to trigger a production build.
