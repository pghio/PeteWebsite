# Public profile source of truth

Last reviewed: 2026-07-22

The canonical machine-readable registry is `src/data/profile.json`. Website components should consume the adapter exports in `src/data/profile.ts`; public machine-readable files are checked against the registry. Public changes begin in the registry and then flow to the website, LinkedIn, ChatGPeTe on Substack, GitHub, and crawler files.

## Canonical identity and positioning

- Public name: **Pete Ghiorse**
- Current role: **Group Product Manager, AI/ML at Capital One**
- Location: **New York City**
- Positioning: **AI/ML product leader, founder & hands-on builder**
- Canonical one-line copy: **I lead AI/ML products, build production agents, and publish rigorous evaluations of how they behave.**
- Practice loop: **Build -> Instrument -> Evaluate -> Publish -> Revise**

Target roles, exactly:

1. **Group Product Manager**
2. **Director of Product Management**
3. **Principal Product Manager**
4. **Head of AI Product**

Target domains are separate from titles: AI agents, LLM evaluation, model behavior and governance, production machine learning, multimodal consumer AI, and 0-to-1 product development.

## Publication

- Name: **ChatGPeTe**
- Description: **I lead AI/ML products, build production agents, and publish rigorous evaluations of how they behave—plus essays when I have something worth saying.**
- URL: **https://peterghiorse.substack.com**

## Approved public facts

- Pete has been a Group Product Manager for AI/ML at Capital One since 2022.
- Pete founded Honeydew in **2025**, not 2024.
- Honeydew accepts voice, text, and photo input and routes work through a catalog of 60+ tools. Treat this as supporting product detail, not the headline positioning on every core page.
- Pete co-founded and ran GiveTide for five years; GiveTide was acquired in 2022.
- Pete earned a B.S. in Finance & Economics from the University of Richmond, Magna Cum Laude.

## Claim states

- `approved_current`: safe for current public profiles; re-check when a role or product changes.
- `approved_historical`: fixed historical fact.
- `study_snapshot`: safe only with the study date, scope, method, and limitations attached.
- `editorial_position`: Pete’s framing or stated view, not an empirical finding.
- `prohibited_without_evidence`: do not publish without a dated primary evidence record.
- `superseded`: retained only to find and remove stale public copy.

The full claim registry and evidence handles live in `src/data/profile.json`. User counts, retention, transaction volume, funding, latency, transcription accuracy, sync speed, cache hit rates, and other production-performance metrics remain prohibited without dated evidence.

## Exact research snapshots

### Restraint study — June 24, 2026

- 227 synthetic scenarios
- 6 models
- 3 trials per scenario
- 4,086 calls
- 14 parse failures dropped
- 35 destructive-action guard scenarios; 105 guard trials per model
- DeepSeek crossed 21% of its repeated guard trials, touching 11 of 35 distinct guard scenarios
- No real user data was used
- Article: https://peterghiorse.com/blog/llms-knowing-when-to-stop
- Repository: https://github.com/pghio/agent-restraint-evals

### Production model benchmark — April 15, 2026

- 8 models
- 35 scenarios across 6 categories
- 10 trials per model-scenario pair
- 2,800 API calls
- $145.83 model cost
- The June restraint study supersedes the original noisy-input and duplicate-handling conclusions
- Article: https://peterghiorse.com/blog/llm-benchmark-stop-defaulting-to-the-frontier
- Repository: https://github.com/pghio/llm-agent-benchmark

### LLM discoverability field note — April 14, 2026

- 90-day observation window, January 14 through April 13, 2026
- 13 GA4-attributed LLM sessions from 12 users
- 8 of the 13 sessions landed on comparison pages
- 29 separate custom referrer events from 27 users
- Honeydew appeared in 1 of 10 Perplexity queries and 0 of 9 generic Perplexity queries
- Honeydew appeared in 3 of 10 ordinary web-search result sets
- GA4 sessions and custom events are different units and must not be divided into a capture rate
- Article: https://peterghiorse.com/blog/llm-discoverability-research
- Repository: https://github.com/pghio/llm-discoverability-field-note

## Profile copy

LinkedIn headline:

> Group Product Manager, AI/ML at Capital One | Founder, Honeydew | AI Agents, LLM Evaluation, Model Behavior & Production ML

GitHub bio:

> Group PM for AI/ML · Founder, Honeydew · Open tools and research on LLM evals, agent behavior, and production AI.

Content-quality statement:

> AI assists with research, red-teaming, implementation, and editing. I own the thesis, source selection, evaluation design, factual claims, and final editorial judgment.

## Maintenance gate

1. Change canonical facts in `src/data/profile.json` first.
2. Run `npm run check:data`, `npm run test:profile`, and `npm run check:claims`.
3. Update website components and external profiles from `PROFILE`, `PUBLICATION`, `RESEARCH`, and `CLAIMS`; do not retype dates or study counts.
4. Preserve dated study limitations and visible corrections.
5. Use the canonical aggregate referral links from `docs/referral-measurement.md`.
6. Do not put a person’s name, email, company, handle, hashed identifier, or person-specific code in a UTM value or GA4 event.
