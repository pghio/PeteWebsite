# PeteWebsite

Personal website and portfolio for Pete Ghiorse.

## Tech Stack

- [Astro](https://astro.build/) — Static site framework
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [Vercel](https://vercel.com/) — Deployment

## Development

```bash
npm install
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
- Set `PUBLIC_GA_MEASUREMENT_ID` to override that public measurement ID for a preview or alternate environment.
- Reader email addresses remain in Substack; website analytics accepts only the anonymous events and parameters allow-listed in `src/components/Analytics.astro`.

## Deployment

Deployed to Vercel. Push to `main` to trigger a production build.
