---
layout: ../../layouts/BlogLayout.astro
title: "1,147 Pages, One Person: Inside the SEO Engine That Grades Its Own Work"
description: "My site's sitemap lists 1,147 pages. I hand-wrote about eighty. A breakdown of the system that writes, scores, and publishes the rest: the generator, the grader that holds weak pages for review, and the one wire I found missing while fact-checking this post."
publishDate: "2026-06-09"
category: "Engineering"
ogImage: "/images/research/hero-seo-engine.png"
faq:
  - q: "How do you keep AI-generated SEO pages from becoming spam?"
    a: "Make quality a consequence, not a hope. In our system every page is scored by a second model (quality 0-100, spam risk, PII risk), AI-generated content sits in a review queue until a passing score flips it discoverable, and quality is 30% of every page's ranking score — so weak pages that do publish sink instead of spreading."
  - q: "What is programmatic SEO?"
    a: "Generating many pages from structured data plus templates or models, instead of writing each one by hand. It scales one person to thousands of pages — and turns into doorway spam unless something with teeth grades the output. The grading machinery is the actual product."
  - q: "How does the system decide which pages to create?"
    a: "A Search Console analyzer flags queries with 50+ impressions, zero clicks, and a position worse than 10 — real demand with no page answering it. Detected gaps currently route through a human (me) to the weekly writer agent; wiring them directly is the top of the backlog."
  - q: "Do llms.txt files actually get read by AI assistants?"
    a: "We serve llms.txt and a ~18,000-word llms-full.txt, and in 90 days of measurement we found no direct evidence any LLM consumed them. Domain authority and third-party editorial coverage appear to dominate AI citation decisions. Full data in our LLM discoverability study."
  - q: "Is the code open source?"
    a: "The reusable core is being released as pg-to-seo: point it at a Postgres table and get server-rendered pages, schema-branched JSON-LD, a single-query sitemap with ETags, and an AI-crawler-aware robots.txt. Honeydew's content and prompts stay private."
---

![Inside the SEO engine that grades its own work](/images/research/hero-seo-engine.svg)

## TL;DR — What's In Here

If you're building content systems and read nothing else:

1. **Generation stopped being the hard part.** My site's sitemap lists 1,147 URLs as I write this. I hand-crafted roughly eighty. The engineering that matters is everything wrapped *around* the generator.

2. **Quality has to be a consequence, not a hope.** Every page gets scored by a second model: quality 0–100, spam risk, PII risk. AI-generated content waits in a review queue until a passing score flips it visible. Quality is 30% of every page's ranking score, so "merely fine" sinks.

3. **Every generation rule is a scar.** The writer's prompt opens with: *"Every rule below exists because a real crawler or quality review caught a bug."* One rule exists because a stray quote once shipped literal `${itemCount}` onto live pages.

4. **I publish my own unflattering grade.** My internal audit rates ~1,000 of those pages "NEEDS ATTENTION." Hiding that would be the spammer's move. Grading it honestly, and making the grade load-bearing, is the defensible one.

5. **I found a missing wire while fact-checking this post.** The function that feeds detected search gaps to the writer agent exists, is exported, and is called by exactly no one. Today that wire is me, reading a report. More on this below.

6. **The reusable core is going up as pg-to-seo.** Postgres table in; rendered pages, JSON-LD, sitemap, AI-aware robots.txt out. The repository goes up alongside this post's LinkedIn launch, and the link will land here.

---

## 1. One Person Can't Hand-Write the Modern Web

Honeydew is an AI family organizer I build solo, nights and weekends. Its public side is a library of list templates — packing lists, chore charts, meal plans — that families can browse and copy. Those pages are how parents find the product: somebody searches "toddler beach packing list," lands on ours, copies it, and maybe meets Dew.

That only works if the pages exist. All of them. For every season, audience, and situation a family might search for. The morning I'm writing this, the corpus sitemap lists **1,147 URLs**. There is no version of my life where I write those by hand, and no version of my budget where I pay someone else to.

So the actual question was never "can I generate a thousand pages?" Any LLM can do that for a few dollars, which is precisely the problem. The question is the one that comes right after:

**Who checks the machine's work?**

This post is the answer I've built so far: a writer under hard rules, a grader with real consequences, a review queue with a hold state, and a corpus I audit and grade in public. Plus the one place where the automation honestly stops and a human, me, is still the wire.

## 2. The Machine, End to End

Here's the whole system on one screen:

![Architecture: demand analysis, a writer agent, a grading layer with hold and publish paths, and the crawler-facing surface](/images/research/seo-engine-architecture.svg)

Four parts:

**Finding demand.** A Search Console analyzer runs over the last 28 days of query data and flags three signals: *keyword gaps* (50+ impressions, zero clicks, position worse than 10 — real demand, no page answering it), *content opportunities* (100+ impressions, position worse than 15, under 5 clicks), and *position declines* (any page that dropped more than 5 spots versus its stored snapshot, escalating to critical past 15). Findings persist to a table and surface in a nightly health report.

**Production.** A weekly writer agent generates exactly three new topics per run, on a six-day cooldown so it can't spiral. Each topic becomes a full list page: 5–7 sections, 25–60 items, written under the scar-tissue rules in section 3.

**Grading.** Every page, generated or hand-made, gets a second-model pass that scores and structures it. This is the part that separates a content system from a spam farm, so it gets its own section.

**The crawler surface.** Every page is server-rendered identically for humans and bots, ships schema-branched JSON-LD, lands in a single-query sitemap, and is described in a machine-readable corpus that eight AI crawlers are explicitly welcomed to read.

A note on what this isn't: the writer doesn't blog, doesn't spin articles, doesn't rewrite competitors. It produces one narrow thing — genuinely useful list templates — because that's the one thing the product can back up when the visitor arrives.

## 3. Production: Every Rule Is a Scar

The writer agent's prompt does not open with encouragement. It opens with this comment, verbatim from the source:

> *"Every rule below exists because a real crawler or quality review caught a bug."*

Ten-ish hard rules follow. A sample, with their origin stories:

- **Interpolation is radioactive.** One rule exists because a single wrong quote character, a `'` where a backtick belonged, shipped the literal text `${itemCount}` into FAQ answers on live pages. It sat there in front of crawlers until I caught it. The rule now forbids the entire pattern.
- **Slugs are sacred.** An early pass generated lists that could be filtered into category pages without slugs, minting URLs that 301-redirected and burned crawl budget. Now: no slug, no existence.
- **Meta descriptions must carry the actual item count**, not a hardcoded "50+", plus the word "free."
- **No blank items, no placeholder items** ("Monday:" with nothing after it), **no duplicate items across sections.** Item names must be specific enough to be useful on their own: "Reef-safe sunscreen SPF 50+," not "Sunscreen."
- **Titles must be unique against a named list of high-competition collisions** the corpus already covers, so the agent can't pile onto its own keywords.

None of this came from a best-practices post. It's a changelog of embarrassments, encoded as constraints. Which is, I'd argue, what a production prompt actually is: the residue of everything that went wrong, phrased as an order.

## 4. Grading: Scores With Consequences

After a page exists, a second model reads it cold and emits structured judgment: a primary and secondary category, tags, target audience, a one-paragraph summary, the correct schema.org type for the page's structured data — and three numbers that matter:

- **`llmQualityScore`** — 0–100, how genuinely useful this page is
- **`llmSpamScore`** — 0–100 spam risk, lower is better
- **`piiConfidenceScore`** — 0–100 likelihood the page accidentally contains someone's personal information

Plus safety flags and a 1,536-dimension embedding, all written to a semantic metadata table and ingested into a knowledge graph.

Scores without consequences are decoration. Here are the consequences:

**Consequence one: the hold.** AI-generated content sits in a review queue, and a quality-review agent walks it, checking item specificity, filler phrases, structure, and completeness. Pass, and the list is flipped discoverable with an audit note (`Auto-approved with score 87/100`). Fail, and it stays held with concrete fix suggestions ("Replace 3 placeholder items with specific, actionable content") until a human looks at it. The log line for that second case is my favorite in the codebase:

> `⏸️ List requires manual review (score: 61)`

That is one AI declining to vouch for another AI's work. I have never once been sad to see it.

**Consequence two: the ranking.** Quality score is **30% of every page's ranking score** in the corpus. It decides what surfaces on category pages, in related-list modules, and in the "cite these first" section of the machine-readable corpus. A page that publishes at quality 62 doesn't get deleted. It gets buried, which on the web is most of the way to the same thing.

**Consequence three: the standing audit.** A health agent re-walks the corpus on a schedule, re-scoring and flagging drift, so a page that was fine in March doesn't coast forever on March's grade.

And one confession: there's a `TODO` in the seeder, in my own handwriting, asking for a hard quality-threshold filter that doesn't exist yet. The grading machinery is real. Finished, it is not.

## 5. The Honest Corpus

If you know SEO, "1,147 pages, mostly machine-written" pattern-matched to *doorway spam* three sections ago. Fair. Here's my own internal audit's grading of the corpus, published on purpose:

![The corpus, honestly graded: roughly 80 hero pages rated excellent, 200 expanded pages rated good, 1,000 bulk pages rated needs-attention](/images/research/seo-engine-corpus-honest.svg)

- **~80 hero lists — "EXCELLENT."** Hand-crafted, 40–100+ items, the pages that earn featured snippets and that I'd defend line by line.
- **~200 config-expanded lists — "GOOD."** Generated variants of strong bases, 20–30 items each.
- **~1,000 bulk lists — "NEEDS ATTENTION."** Theme-by-audience cross products, 15–20 items. Thin. My audit says so in capital letters.

(Tier counts are rounded, so they don't sum exactly to the sitemap's 1,147, which also carries category and utility pages.)

I could have cited only the first two tiers and this post would read better. But the bulk tier is the entire reason the grading machinery exists: those are the pages the quality score holds at the bottom of the ranking, the ones the review agent files fix-suggestions against, the ones that get improved or eventually culled. Volume is what the generator gives you for free. The grade is what makes the volume defensible.

If you're building one of these systems and you *don't* have an internal audit willing to stamp "NEEDS ATTENTION" on roughly 1,000 of your 1,147 pages, you don't have a content system. You have a spam cannon with good intentions.

## 6. The Crawler Surface: One Render for Everyone

The serving layer is where most programmatic SEO quietly cheats: special HTML for bots, hydration tricks for humans. This system serves everyone the same thing:

- **Server-side rendering for every visitor.** A catch-all route renders the full React tree to HTML on the server. Googlebot, GPTBot, and a parent on the school-pickup wifi all receive the same complete document. No cloaking, no prerender service, nothing to get flagged for.
- **Boring, correct HTTP.** ETags with 304s, stale-while-revalidate caching, and 301s that strip `utm_` and click-ID parameters so Google never indexes duplicate URL variants.
- **Schema-branched JSON-LD.** The grader's `schemaOrgType` decision drives the structured data: packing lists emit `ItemList`, step-by-step content emits `HowTo` with positioned steps, itineraries emit `Trip`. Plus breadcrumbs and app markup. There's a scar here too: a comment in the structured-data builder explaining that `aggregateRating` was removed because Search Console rejects it on list-type parents. That comment cost me real time in Search Console before I understood the problem.
- **An FAQ generator under orders.** Every generated FAQ answer must contain at least one specific number, date, or actionable step. Vague answers don't win featured snippets; "the 5-4-3-2-1 packing rule" does.
- **A machine-readable corpus for AI.** `llms.txt` plus a dynamically regenerated `llms-full.txt`, about 18,000 words this morning, listing every discoverable page by category, the top lists by quality score ("cite these first"), and canonical-URL guidance. The robots.txt explicitly welcomes eight AI crawlers by name — GPTBot, ChatGPT-User, Claude-Web, Anthropic-AI, PerplexityBot, Cohere-AI, AI2Bot, Google-Extended — and blocks the scrapers that only ever cost bandwidth.

## 7. The Wire I Found Missing While Writing This

I planned to describe this system as a closed loop: Search Console finds the gap, the writer fills it, the grader checks it, the audit measures it, around forever. Self-driving SEO. It's a great sentence.

While fact-checking it, I went looking for the exact line of code where detected keyword gaps feed the weekly writer's topic selection.

It doesn't exist. The function is there — `getKeywordGapTopics()`, exported, documented, ready — and it is called by exactly nothing. The gap report goes to a dashboard. I read the dashboard. The writer's steering lives in a prompt I edit by hand when the report tells me coverage is thin somewhere.

So the honest architecture diagram has a human in it: production, grading, publishing, and serving run without me; *demand selection* still closes through a guy reading a report with his coffee. The marketing version of this post would have claimed the loop. The engineering version admits the loop's last wire is biological, and that wiring it is now the top of my backlog.

I'm leaving this section in because the gap between "what I built" and "what I almost said I built" is exactly the gap that makes most AI-system writeups useless. Check your call sites before you write your victory lap.

## 8. Does Any of This Make AIs Actually Cite Me?

Barely, so far — and I measured it properly rather than guessing. Earlier this year I ran a 90-day study with a structured citation audit against seven competitors, an audit I now rerun monthly. The short version: incumbents get cited at rates I currently can't touch, the gap is domain authority and third-party coverage rather than infrastructure, and I found no evidence any LLM directly consumed my carefully-built llms.txt files. The full data, methodology, and the unflattering numbers are in [Do LLMs Actually Cite Your Startup?](/blog/llm-discoverability-research)

The one-sentence reconciliation of that study with this post: **production is automatable; authority is not.** This engine solves the supply problem completely and the trust problem not at all. Nothing in this stack makes a human decide you're worth vouching for. Knowing which problem you're solving is most of the strategy.

## 9. Run It Yourself: pg-to-seo

I'm releasing the reusable core as **pg-to-seo**. The repository goes up alongside this post's LinkedIn launch, and the link will land right here. Point it at any Postgres table with a slug and an `updated_at` column and you get:

- Server-rendered pages through a pluggable data adapter
- The JSON-LD array builder with schema-type branching — `aggregateRating` scar included as a comment, so you don't repeat my mistake
- The single-query, ETag-cached sitemap (deliberately unpaginated, so concurrent writes can't skip or duplicate rows)
- The AI-crawler-aware robots.txt and the tracking-param 301 middleware
- A demo dataset so it runs out of the box

What's not in it: Honeydew's content, the writer prompts, what I know about the category, and anything with a credential in it. The engine travels; the editorial judgment stays home.

## 10. What I'm Not Claiming

- **Not a growth hack.** This took months of scar accumulation, and per my own published study it has not (yet) bought me meaningful AI citations. It's infrastructure, with infrastructure's payoff curve.
- **The thin tier is real.** ~1,000 bulk pages graded "NEEDS ATTENTION" by my own audit. The system's job is to hold them down and improve them, and that work is visibly unfinished.
- **No automated link-building.** There's a backlink-outreach agent spec'd in the codebase that I keep paused. Automated production of *pages* is defensible when graded; automated manufacturing of *endorsements* is where this genre turns into the thing Google rightly punishes.
- **Demand selection isn't autonomous.** Section 7. The loop closes through me.
- **One product, one category.** A family-list corpus on a young domain. Your table, your category, and your authority curve will behave differently.

---

## Frequently Asked Questions

**How do you keep AI-generated SEO pages from becoming spam?**
Make quality a consequence, not a hope: a second model scores every page (quality 0–100, spam, PII), AI content waits in a review queue until a passing score flips it visible, and quality is 30% of ranking — so weak pages sink instead of spreading.

**What is programmatic SEO?**
Generating many pages from structured data plus templates or models instead of hand-writing each one. It scales one person to thousands of pages, and becomes doorway spam the moment nothing with teeth grades the output.

**How does the system decide which pages to create?**
A Search Console analyzer flags queries with 50+ impressions, zero clicks, and a position worse than 10 — proven demand with no page answering it. Today those findings route through me to the writer agent; wiring them directly is the top of the backlog.

**Do llms.txt files actually get read by AI assistants?**
I serve both llms.txt and an ~18,000-word llms-full.txt, and in 90 days of measurement found no direct evidence any LLM consumed them. Domain authority and third-party coverage appear to dominate. Data in [the discoverability study](/blog/llm-discoverability-research).

**Is the code open source?**
The core is being released as **pg-to-seo** (repository goes up with this post's LinkedIn launch): Postgres table in; rendered pages, schema-branched JSON-LD, ETag-cached sitemap, and an AI-aware robots.txt out.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. Every code detail in this post — the rules, the scores, the log lines, the missing call site — was verified against the production codebase the morning of publication. The author has an obvious financial interest in Honeydew; the unflattering findings are included accordingly.*
