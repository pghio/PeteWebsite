---
layout: ../../layouts/BlogLayout.astro
title: "1,147 Pages, One Person: Inside the SEO Engine That Grades Its Own Work"
description: "My site's sitemap listed 1,147 pages. I hand-wrote about eighty. A breakdown of the generator, the incomplete review and ranking controls around it, and the missing wire I found while fact-checking this post."
publishDate: "2026-06-09"
category: "Engineering"
ogImage: "/images/research/hero-seo-engine.png"
faq:
  - q: "How do you keep AI-generated SEO pages from becoming spam?"
    a: "The code includes a review path where a second model can score a new page's quality, spam risk, and PII risk before approval. Quality also contributes 30% of the corpus ranking score. The safeguard is not retroactive proof that every existing page is good: the corpus still contains a large thin tier, and a hard threshold remains unfinished."
  - q: "What is programmatic SEO?"
    a: "Generating many pages from structured data plus templates or models, instead of writing each one by hand. It can scale one person to thousands of pages, but without review and enforcement the same technique can produce doorway spam."
  - q: "How does the system decide which pages to create?"
    a: "A Search Console analyzer flags queries with 50+ impressions, zero clicks, and a position worse than 10 as candidates where existing coverage may be missing or underperforming. Those candidates currently route through a human (me) to the weekly writer agent; wiring them directly is the top of the backlog."
  - q: "Do llms.txt files actually get read by AI assistants?"
    a: "We serve llms.txt and an approximately 18,000-word llms-full.txt. A small 90-day descriptive audit found no direct evidence that an assistant consumed either file, but the design cannot isolate why a model did or did not cite us. I treat the files as crawlability aids, not evidence of citation impact."
  - q: "Is the code open source?"
    a: "Not currently. The reusable patterns are described here, but there is no maintained public package or repository to link to. Honeydew's implementation, content, prompts, and credentials remain private."
---

![Inside the SEO engine that grades its own work](/images/research/hero-seo-engine.svg)

My site's sitemap listed 1,147 URLs when I took the snapshot for this post. I wrote roughly eighty of the core list pages by hand. Generating the rest was cheap; building checks around generation was the actual work.

The system has useful controls — a second-model grader, a review path for new AI pages, ranking penalties for weak work, and a recurring audit — but those controls do not turn the existing corpus into 1,147 certified-good pages. The corpus still contains a substantial thin tier, and one hard threshold is unfinished.

The parts I trust most are the ones with failure history behind them: a rule added after literal `${itemCount}` reached production, and a missing call site I discovered while fact-checking the supposed closed loop.

---

## Why I built it

Honeydew is an AI family organizer I build solo, nights and weekends. Its public side is a library of list templates — packing lists, chore charts, meal plans — that families can browse and copy. Those pages are how parents find the product: somebody searches "toddler beach packing list," lands on ours, copies it, and maybe meets Dew.

That only works if enough pages exist to cover the seasons, audiences, and situations families search for. The morning I'm writing this, the corpus sitemap lists **1,147 URLs**. There is no version of my life where I write those by hand, and no version of my budget where I pay someone else to.

Generating a thousand pages is cheap. The useful question comes immediately after:

**Who checks the machine's work?**

This post describes what I built so far: a constrained writer, a grader, a review path with a hold state, ranking that uses the grade, and a recurring corpus audit. It also describes where the automation stops and I remain the wire.

## The system, end to end

Here's the whole system on one screen:

![Architecture: demand analysis, a writer agent, a grading layer with hold and publish paths, and the crawler-facing surface](/images/research/seo-engine-architecture.svg)

Four parts:

**Finding demand.** A Search Console analyzer runs over the last 28 days of query data and flags three signals: *keyword gaps* (50+ impressions, zero clicks, position worse than 10 — real demand, no page answering it), *content opportunities* (100+ impressions, position worse than 15, under 5 clicks), and *position declines* (any page that dropped more than 5 spots versus its stored snapshot, escalating to critical past 15). Findings persist to a table and surface in a nightly health report.

**Production.** A weekly writer agent generates three new topics per run, on a six-day cooldown so it cannot spiral. Each topic becomes a full list page: 5–7 sections, 25–60 items, written under the failure-derived rules below.

**Grading.** Pages that enter the grading pipeline get a second-model pass that scores and structures them. The important distinction is between having that path in the code and proving that it has validated every page already in the corpus; I can claim the former, not the latter.

**The crawler surface.** Every page is server-rendered identically for humans and bots, ships schema-branched JSON-LD, lands in a single-query sitemap, and is described in a machine-readable corpus that eight AI crawlers are explicitly welcomed to read.

A note on scope: the writer does not blog, spin articles, or rewrite competitors. It produces one narrow thing — list templates intended to be useful inside the product when the visitor arrives.

## Production rules written after failures

The writer agent's prompt does not open with encouragement. It opens with this comment, verbatim from the source:

> *"Every rule below exists because a real crawler or quality review caught a bug."*

Ten-ish hard rules follow. A sample, with their origin stories:

- **Interpolation is radioactive.** One rule exists because a single wrong quote character, a `'` where a backtick belonged, shipped the literal text `${itemCount}` into FAQ answers on live pages. It sat there in front of crawlers until I caught it. The rule now forbids the entire pattern.
- **Slugs are sacred.** An early pass generated lists that could be filtered into category pages without slugs, minting URLs that 301-redirected and burned crawl budget. Now: no slug, no existence.
- **Meta descriptions must carry the actual item count**, not a hardcoded "50+", plus the word "free."
- **No blank items, no placeholder items** ("Monday:" with nothing after it), **no duplicate items across sections.** Item names must be specific enough to be useful on their own: "Reef-safe sunscreen SPF 50+," not "Sunscreen."
- **Titles must be unique against a named list of high-competition collisions** the corpus already covers, so the agent can't pile onto its own keywords.

None of this came from a best-practices post. It is a changelog of embarrassments encoded as constraints — failures translated into orders the next run has to obey.

## Grading, review, and ranking

After a page exists, a second model reads it cold and emits structured judgment: a primary and secondary category, tags, target audience, a one-paragraph summary, the correct schema.org type for the page's structured data — and three numbers that matter:

- **`llmQualityScore`** — 0–100, how genuinely useful this page is
- **`llmSpamScore`** — 0–100 spam risk, lower is better
- **`piiConfidenceScore`** — 0–100 likelihood the page accidentally contains someone's personal information

Plus safety flags and a 1,536-dimension embedding, all written to a semantic metadata table and ingested into a knowledge graph.

The scores affect three parts of the system:

**The review path.** Newly generated content can enter a review queue where a quality-review agent checks item specificity, filler phrases, structure, and completeness. A passing review can flip the list discoverable with an audit note (`Auto-approved with score 87/100`). A failed review can leave it held with concrete fix suggestions ("Replace 3 placeholder items with specific, actionable content") until a human looks at it. The log line for that second case is my favorite in the codebase:

> `⏸️ List requires manual review (score: 61)`

That is one AI declining to vouch for another AI's work. I have never once been sad to see it.

**Ranking.** Quality score is **30% of the corpus ranking score**. It influences what surfaces on category pages, in related-list modules, and in the "cite these first" section of the machine-readable corpus. If a low-scoring page is already discoverable, ranking pushes it down rather than proving it should have been published in the first place.

**The recurring audit.** A health agent re-walks the corpus on a schedule, re-scoring and flagging drift, so a page that was fine in March does not coast forever on March's grade.

There is also a `TODO` in the seeder, in my own handwriting, asking for a hard quality-threshold filter that does not exist yet. The review path is real. I cannot infer from that code that every existing page cleared it, and the missing threshold means the control is unfinished.

### The corpus the controls still have to improve

If you know SEO, "1,147 pages, mostly machine-written" already sounds like doorway spam. That suspicion is reasonable.

My internal audit uses three labels. Roughly eighty hand-built hero lists are the strongest cohort. Config-expanded lists form a smaller middle cohort. Bulk theme-by-audience pages are the largest cohort, and many are thin enough to be labeled **NEEDS ATTENTION**.

The only same-snapshot figures I can defend are 1,147 total URLs and roughly eighty hand-built core list pages. The middle and bulk cohorts were counted while the corpus was moving, and the sitemap also contains category and utility pages, so I do not assign numeric totals to those cohorts here.

The conclusion does not need the inflated precision. A large portion of the corpus needs improvement or removal. Ranking weak pages lower is useful, but it does not make thin pages good, and it does not substitute for a publish threshold that is still unfinished.

## One render for people and crawlers

Programmatic SEO can become evasive at the serving layer through special HTML for bots or incomplete client-only pages for humans. This system instead serves everyone the same thing:

- **Server-side rendering for every visitor.** A catch-all route renders the full React tree to HTML on the server. Googlebot, GPTBot, and a parent on the school-pickup wifi all receive the same complete document. No cloaking, no prerender service, nothing to get flagged for.
- **Boring, correct HTTP.** ETags with 304s, stale-while-revalidate caching, and 301s that strip `utm_` and click-ID parameters so Google never indexes duplicate URL variants.
- **Schema-branched JSON-LD.** The grader's `schemaOrgType` decision drives the structured data: packing lists emit `ItemList`, step-by-step content emits `HowTo` with positioned steps, itineraries emit `Trip`. Plus breadcrumbs and app markup. A comment in the structured-data builder explains that `aggregateRating` was removed because Search Console rejects it on list-type parents. That comment cost me real time in Search Console before I understood the problem.
- **An FAQ generator under orders.** Every generated FAQ answer must contain at least one specific number, date, or actionable step. Vague answers don't win featured snippets; "the 5-4-3-2-1 packing rule" does.
- **A machine-readable corpus for AI.** `llms.txt` plus a dynamically regenerated `llms-full.txt`, about 18,000 words this morning, listing every discoverable page by category, the top lists by quality score ("cite these first"), and canonical-URL guidance. The robots.txt explicitly welcomes eight AI crawlers by name — GPTBot, ChatGPT-User, Claude-Web, Anthropic-AI, PerplexityBot, Cohere-AI, AI2Bot, Google-Extended — and is configured to block selected scraper user agents.

## The missing wire

I planned to describe this system as a closed loop: Search Console finds the gap, the writer fills it, the grader checks it, the audit measures it, around forever. Self-driving SEO. It's a great sentence.

While fact-checking it, I went looking for the exact line of code where detected keyword gaps feed the weekly writer's topic selection.

It doesn't exist. The function is there — `getKeywordGapTopics()`, exported, documented, ready — and it is called by exactly nothing. The gap report goes to a dashboard. I read the dashboard. The writer's steering lives in a prompt I edit by hand when the report tells me coverage is thin somewhere.

So the architecture diagram needs a human in it: production, grading, publishing, and serving can run without me; *demand selection* still closes through a guy reading a report with his coffee. I nearly described a closed loop that the call graph did not support. Wiring that last step is now at the top of my backlog.

I'm leaving this section in because the gap between "what I built" and "what I almost said I built" is exactly the gap that makes most AI-system writeups useless. Check your call sites before you write your victory lap.

## Citation impact is still unproven

I have not shown that this infrastructure causes AI assistants to cite Honeydew. Earlier this year I ran a small 90-day descriptive audit against seven competitors. It observed few citations for Honeydew and no direct evidence that an assistant consumed my `llms.txt` files.

That audit cannot isolate whether the result came from domain authority, third-party coverage, query fit, model behavior, sampling noise, or the infrastructure itself. I therefore treat `llms.txt` and the crawler surface as accessibility work, not evidence of citation lift. The defensible claim is narrower: this system lowers the labor required to produce and inspect pages. It has not established that the resulting corpus earns trust or distribution.

## Boundaries

- **Not a growth hack.** This took months of corrections and has not established meaningful AI-citation impact. It is infrastructure with an uncertain distribution payoff.
- **The thin tier is real.** A large cohort of bulk pages needs attention. The system can rank and flag them, but improvement and removal are unfinished work.
- **No automated link-building.** There's a backlink-outreach agent spec'd in the codebase that I keep paused. Automated production of *pages* is defensible when graded; automated manufacturing of *endorsements* is where this genre turns into the thing Google rightly punishes.
- **Demand selection isn't autonomous.** The loop closes through me.
- **One product, one category.** A family-list corpus on a young domain. Your table, your category, and your authority curve will behave differently.
- **No public package.** I once planned to release these patterns as `pg-to-seo`, but there is no maintained public repository today. This post describes an internal system, not a supported library.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. The implementation details in this post — the rules, scores, log lines, and missing call site — were checked against the production codebase at publication. Corpus counts change over time; only the 1,147-URL sitemap and roughly eighty hand-built pages refer to the snapshot described here. The author has an obvious financial interest in Honeydew.*
