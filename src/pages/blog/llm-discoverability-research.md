---
layout: ../../layouts/BlogLayout.astro
title: "Do LLMs Actually Cite Your Startup? A 90-Day Field Note"
description: "What 13 GA4-attributed sessions, 29 custom referrer events, one citation in ten Perplexity queries, and three web-search appearances can—and cannot—tell an early-stage startup about LLM discovery."
publishDate: "2026-04-14"
category: "Research"
ogImage: "/images/research/hero-llm-discoverability.png"
faq:
  - q: "Do LLMs cite startups in their recommendations?"
    a: "In one ten-query Perplexity audit, Honeydew appeared only for the branded positive-control query and for none of the nine generic queries. That is a useful negative result for this product at this moment, not an estimate of how often LLMs cite startups generally."
  - q: "How much traffic do LLMs send to websites?"
    a: "Over 90 days, GA4 attributed 13 Honeydew sessions to LLM sources. A separate referrer detector recorded 29 events from 27 users. Events and sessions are different units and cannot be divided into a reliable capture-rate estimate. Neither method can see someone who reads a recommendation and later types the URL or searches for the brand."
  - q: "Does a .llms.txt file improve LLM discoverability?"
    a: "This field note found no direct evidence that an LLM consumed Honeydew's machine-readable context files. Because the files, content, and measurement changes launched together without a baseline, the effect of any one layer cannot be isolated."
  - q: "How should a startup track LLM referrals?"
    a: "Keep standard analytics and a referrer-based event as separate measures, preserve source-level counts, use tagged links where possible, and repeat a fixed citation-query audit over time. Referrer tracking observes clicks from known hosts; it does not reveal typed URLs, later searches, or other indirect discovery."
---

![Do LLMs Actually Cite Your Startup?](/images/research/hero-llm-discoverability.svg)

For 90 days, I watched a small consumer startup try to become visible to systems like ChatGPT, Claude and Perplexity. We added machine-readable context files, generated them from product data, published comparison content, and instrumented referrals. Then I checked what actually arrived.

The result was modest. GA4 attributed 13 sessions to LLM sources. A separate browser-referrer event recorded 29 events from 27 users. Perplexity mentioned Honeydew in one of ten queries, and that one was the branded control. Ordinary web search surfaced the site in three of the same ten queries.

Those numbers do not prove that the infrastructure created traffic, that analytics missed a fixed share of it, or that long comparison articles cause citations. They are a baseline from one product, one quarter, and a very small sample.

## The observations, without a growth story layered on top

| Observation | Result | What it supports |
|---|---:|---|
| GA4 sessions attributed to LLM sources | 13 sessions, 12 users | Some clicked LLM referrals reached the site |
| Custom `llm_referral` measurement | 29 events, 27 users | A separate referrer detector observed more event records than GA4 labeled sessions |
| Perplexity audit | Honeydew in 1/10 queries | The product was absent from all nine generic queries in this snapshot |
| Web-search check using the same queries | Honeydew in 3/10 result sets | Search could retrieve the site more often than Perplexity chose it |
| LLM-referral landing pages | 8 comparison pages, 3 homepage, 2 other posts | Comparison content was common among these 13 attributed sessions |

The first two rows are deliberately not combined into a ratio. A custom event and a GA4 session are different units with different processing rules. Without a joined event-level audit, 29 divided by 13 is not an “attribution gap,” and 13 divided by 29 is not a GA4 capture rate.

The custom event also depends on `document.referrer`. It can observe a click whose browser preserves a known LLM hostname. It cannot identify someone who reads a recommendation, closes the assistant, and later types the URL or searches for Honeydew. Those indirect journeys remain unobservable in this dataset.

## What we changed

Between January and April 2026, Honeydew deployed four layers:

![LLM Discoverability Stack Architecture](/images/research/llm-discoverability-stack.svg)

1. **Machine-readable context.** Plain-text and JSON files at the domain root described the product, capabilities, FAQs and source pages.
2. **Automated generation.** Those assets were generated from shared product data on deploy so they would not drift independently.
3. **Search-grounded content.** The site published comparison articles, structured tables, canonical URLs and FAQ schema.
4. **Measurement.** GA4 source attribution was supplemented with a session-scoped event when `document.referrer` matched a known LLM hostname.

Everything launched in the same broad period. There was no pre-intervention baseline and no control group. The study therefore cannot assign an effect to the context files, content, instrumentation, organic growth, or any other individual change.

## How the field note was assembled

### Referral observation

The observation window ran from January 14 through April 13, 2026. GA4 sessions were grouped by source when the recorded source matched a known LLM hostname. The custom event separately checked `document.referrer` and recorded one session-scoped event for matching hosts.

### Perplexity citation check

On April 14, 2026, I ran ten queries once each in fresh Perplexity sessions:

- 2 category queries: “best AI family organization app 2026” and “best app for family coordination AI assistant”
- 3 alternative queries: “alternatives to Cozi,” “skylight calendar alternative,” and “best shared family to-do list app AI”
- 3 feature queries: “best family calendar app with AI voice,” “best family list app voice input AI,” and “AI powered family planning app”
- 1 pain-point query: “best app for default parent mental load”
- 1 branded positive control: “honeydew family app review”

For each result I recorded whether Honeydew appeared and which source URL Perplexity cited. One run per query is a snapshot, not a stable citation rate: responses can vary by model version, location, session and time.

### Web-search check

I ran the same ten queries through ordinary web search and recorded whether gethoneydew.app appeared and its approximate position. This is a retrieval comparison, not a second LLM citation test.

## Referral traffic: measurable, but small

GA4 attributed 13 sessions from 12 users to three LLM sources during the 90-day window:

![LLM Referral Sessions by Source](/images/research/llm-sessions-by-source.svg)

| Source | Sessions | Share of the 13 LLM-attributed sessions | Share of ~2,400 total sessions |
|---|---:|---:|---:|
| ChatGPT | 10 | 76.9% | ~0.42% |
| Perplexity | 2 | 15.4% | ~0.08% |
| Claude | 1 | 7.7% | ~0.04% |
| **Total** | **13** | **100%** | **~0.54%** |

The custom referrer detector produced 29 events from 27 users. That is worth monitoring alongside GA4 because the two systems classify traffic differently. It is not evidence of 29 total LLM-driven sessions, and the difference cannot be attributed to typed or search journeys that `document.referrer` never sees.

### Engagement is too sparse to rank sources

| Source | Sessions | Observed average duration | Observed pages/session |
|---|---:|---:|---:|
| ChatGPT | 10 | 2m 12s | 2.8 |
| Perplexity | 2 | 3m 45s | 3.5 |
| Claude | 1 | 9m 35s | 6.0 |

The Claude row describes one visit and the Perplexity row two. They should not be used to claim that one platform sends higher-value readers. At most, they suggest metrics to revisit once each source has a meaningful sample.

Eight of the 13 attributed sessions landed on comparison or “best of” articles, three on the homepage and two on other blog posts. That makes comparison content a reasonable hypothesis for further testing. It does not establish that LLMs generally prefer long evaluative articles; one or two additional sessions would move these shares substantially.

## Citation check: one branded mention, zero generic mentions

![Perplexity Citation Audit Results](/images/research/perplexity-citation-audit.svg)

Honeydew appeared in one of the ten Perplexity responses. The appearance came from the branded positive-control query, “honeydew family app review,” and cited the Apple App Store listing rather than gethoneydew.app.

Honeydew appeared in none of the nine generic category, alternative, feature or pain-point queries. That is the clearest negative finding in the field note: in this snapshot, a person using those generic Perplexity queries would not have encountered the product.

The earlier version of this post combined Perplexity citations and ordinary search appearances into one competitor “citation rate.” That mixed two different observations and has been removed. The data here support a Perplexity result of 1/10 for Honeydew and a separate web-search result of 3/10; they do not support a combined citation percentage.

## Search found the site more often than Perplexity selected it

| Observation | Honeydew appearances |
|---|---:|
| Web-search result sets | 3/10 |
| Perplexity responses | 1/10 |

The site appeared around position 5 for a Skylight-alternatives query, around position 9 for an AI-family-planning query, and within the top results for the branded query. Perplexity cited only the App Store result for the branded query.

That difference could reflect Perplexity's source-selection process, result variability, query execution, or other factors. Ten single-run queries cannot identify the cause.

## What the data do not establish

- **No causal lift from the four-layer stack.** Measurement, content and context files changed together, without a pre-period or control.
- **No estimate of total LLM-driven traffic.** Both analytics methods rely on observable browser journeys. Typed URLs, later searches and cross-device discovery are outside the data.
- **No platform-quality ranking.** Source-level engagement samples range from one to ten sessions.
- **No general startup citation rate.** The citation check covered one product, one category, one provider and ten single-run queries.
- **No demonstrated `.llms.txt` effect.** None of the observed citations referenced the machine-readable files directly.
- **No measured domain-authority or content-quality effect.** Established products may benefit from older domains, third-party coverage, download volume or other signals, but this field note did not isolate or quantify them.

## Hypotheses worth testing next

The observations suggest questions, not conclusions:

1. Do comparison pages receive more LLM-referred landings than product pages after controlling for their share of the site's search traffic?
2. Does App Store review volume correlate with appearance in product-recommendation responses across a larger set of apps?
3. How often do GA4 source labels and a referrer-based event disagree when joined at the event or session level?
4. Does a fixed monthly query panel show citation changes after new third-party coverage or meaningful search-ranking movement?
5. Do machine-readable context files ever appear in crawler logs or cited source lists?

## A practical measurement loop

- Keep GA4 source-attributed sessions and custom referrer events as separate series.
- Preserve raw source, timestamp and landing-page data long enough to audit classification differences without collecting email addresses or other unnecessary personal information.
- Use tagged links in channels you control; do not infer invisible journeys from referrer data.
- Repeat the same citation queries on a schedule, with multiple runs per query, and record provider and model version when available.
- Compare LLM citations with web-search appearances, but do not merge them into one rate.
- Treat comparison content, App Store presence, third-party coverage and context files as separate hypotheses.

## Conflict, materials and scope

I am the founder of Honeydew and conducted this analysis to inform its distribution strategy. The result is not independent research. The query list is published above; the underlying query-level audit and anonymized aggregate analytics are available on request. There is no verified public data repository linked from this post.

The field note is useful as a dated baseline: LLM referrals were observable but small, Honeydew was absent from nine generic Perplexity queries, and ordinary search retrieved the site more often than Perplexity selected it. Anything stronger needs more data and a design capable of supporting the claim.
