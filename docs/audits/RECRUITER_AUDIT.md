# Recruiter and LLM public-surface release gate

This lane answers one bounded question: does the public, signed-out identity tell a consistent and evidence-backed story to recruiters and retrieval systems?

It does not score private account settings, infer visitor identity, rewrite essays, or claim that keyword coverage predicts a hiring decision. The employer rubrics are deterministic evidence checks, not applicant-tracking simulations.

## What the gate checks

- Built website HTML: required routes, HTTP status, titles, descriptions, canonicals, indexing directives, structured identity claims, profile links, and recruiter positioning.
- Supplied LinkedIn, Substack, and GitHub snapshots: freshness, verification limits, exact public fields, inbound website links, and claim-level citations.
- Cross-surface contradictions: current title, employer, names, canonical profile URLs, and arbitrary structured claims supplied in `claims`.
- Profile and navigation copy only: a conservative list of generic AI-writing tropes. Blog and essay bodies are deliberately excluded from this rule.
- Employer proof bundles: weighted Anthropic, OpenAI, and Google rubrics with direct source excerpts for every matched signal.
- Referral readiness: each external profile should link to the website with a channel-specific `utm_source`.

Every red or yellow result includes source IDs, URLs, fields, and excerpts where evidence exists. Missing evidence is itself a yellow flag.

## Snapshot contract

Start from `docs/audits/public-profile-snapshots.example.json`, but do not run the gate against the example. The loader rejects files containing `"example": true` so placeholder copy cannot be mistaken for release evidence.

Each surface requires:

- `id`, `channel`, `status`, `url`, and `capturedAt`.
- `status`: `verified`, `partial`, `blocked`, or `missing`.
- `fields`: exact public values such as `displayName`, `headline`, `about`, `bio`, `currentTitle`, `currentEmployer`, and `profileLinks`.
- `fieldsEvidence`: mapping from a field to an evidence ID.
- `claims`: normalized assertions that should agree across surfaces. Any claim key can be used; matching keys are compared.
- `evidence`: exact excerpt, URL, field, capture timestamp, and source type.

Use `partial` when a login wall or search-index boundary prevents complete verification. Do not fill blocked fields from memory. Evidence source types should be explicit, for example `public-html`, `public-api`, `search-index`, or `manual-signed-out`.

The aliases object permits intentional variants such as Pete/Peter without hiding real contradictions.

## Local release gate

Build first, then provide a current snapshot file:

```sh
npm run build
npm run audit:recruiter -- \
  --snapshots /absolute/path/to/public-profile-snapshots.json \
  --json /tmp/recruiter-audit.json \
  --markdown /tmp/recruiter-audit.md \
  --fail-on red
```

The default failure policy is red only. Use `--fail-on yellow` for a hard pre-promotion gate after all unavoidable verification boundaries have been reviewed. Use `--fail-on none` only for an exploratory report.

The JSON output contains both the normalized content bundle and the report. Its SHA-256 bundle digest excludes the run timestamp, so identical public inputs produce the same evidence identity.

## Signed-out production gate

After deployment, crawl the actual public origin without cookies or credentials:

```sh
node scripts/recruiter-audit/cli.mjs \
  --origin https://peterghiorse.com \
  --snapshots /absolute/path/to/public-profile-snapshots.json \
  --json /tmp/recruiter-audit-production.json \
  --markdown /tmp/recruiter-audit-production.md \
  --fail-on red
```

The crawler sends no authentication or cookie headers, follows public redirects, stays on the supplied origin, ignores assets, and caps traversal at 50 HTML pages by default.

## Manual public-surface procedure

Run this within 30 days of the release. Evidence older than 30 days is yellow; older than 90 days is red.

### LinkedIn

1. Open the profile in a signed-out or private window.
2. Record the visible name, headline, location, About, current title/employer, Featured items, website/contact link, and top visible authored activity.
3. If LinkedIn returns an authwall, set `status` to `partial` or `blocked` and capture the authwall plus current search-index snippets. Never describe hidden headline, About, Skills, Featured, or recruiter settings as verified.
4. Record current authored posts that repeat quantitative claims. Add those assertions under `claims`, especially when a corrected website or Substack version exists.
5. Verify the website link contains `utm_source=linkedin` and a placement-specific medium/content convention.

### Substack

1. Capture the publication home, About page, author profile, archive/RSS, and one representative post while signed out.
2. Record publication name, author name, bio, website/LinkedIn links, current role/employer claims, and exact canonical URL.
3. Confirm the public HTML loads the intended GA4 ID, but keep analytics configuration outside the recruiter claim set.
4. Add any quantitative or methodological claims that also appear on LinkedIn or the website.
5. Verify the website profile link contains `utm_source=substack`.

### GitHub

1. Open the public profile and pinned repositories while signed out.
2. Record display name, bio, location if intentionally public, website link, pinned repository names/descriptions, README identity claims, and visible activity limitations.
3. Do not treat private contribution counts or organization membership as absent; record them only if publicly visible.
4. Verify the website link contains `utm_source=github`.

## Employer rubric interpretation

- `green` means the public bundle contains evidence for at least 75% of the weighted signals.
- `yellow` means the positioning is plausible but one or more dimensions are thin or uncited.
- `red` means the public bundle lacks enough evidence to support that employer-specific narrative.

The Anthropic rubric emphasizes safety, restraint, empirical honesty, technical depth, and human benefit. OpenAI emphasizes shipped AI products, agents/multimodality, evaluation, zero-to-one execution, and product leadership. Google emphasizes scaled leadership, AI/ML depth, measurable user impact, platform thinking, and clear technical communication.

Strengthen a weak dimension only with real public proof. Do not add generic keywords, expose confidential employer information, or distort essay prose to raise a score.

## CI integration requirements

1. Run `npm run build` before the local audit.
2. Supply the snapshot JSON as a CI artifact or checked evidence file; do not silently omit a channel.
3. Preserve the generated JSON/Markdown reports with the release artifacts.
4. Fail pre-merge on red. Before production promotion, review yellow verification boundaries and optionally use `--fail-on yellow`.
5. Run the signed-out origin crawl after production promotion; a protected preview is not public-surface proof.
6. Refresh snapshots whenever profile copy or a public quantitative claim changes, even if the 30-day freshness window has not expired.

Run the audit's own tests with:

```sh
npm run test:recruiter-audit
```
