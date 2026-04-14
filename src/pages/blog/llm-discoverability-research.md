---
layout: ../../layouts/BlogLayout.astro
title: "Do LLMs Actually Cite Your Startup? An Empirical Analysis of LLM Discoverability Infrastructure"
description: "We deployed a 4-layer LLM discoverability stack and measured 90 days of outcomes. 10% citation rate vs 60% for incumbents, a 2.2x analytics attribution gap, and 4.4x engagement differential across LLM sources. Full methodology and replication guide."
publishDate: "2026-04-14"
category: "Research"
ogImage: "/images/research/hero-llm-discoverability.png"
---

![Do LLMs Actually Cite Your Startup?](/images/research/hero-llm-discoverability.svg)

## TL;DR — What You Should Do Based on This Data

If you're a startup founder and you read nothing else:

1. **You're probably invisible to LLMs.** We achieved a 10% citation rate vs. 60% for incumbents. Unless you have years of domain authority, assume LLMs aren't recommending you.

2. **Your analytics are lying to you about LLM traffic.** Standard GA4 attribution captured only ~45% of our actual LLM-driven visits. Deploy custom `llm_referral` event tracking (we explain how in Section 5) or you're flying blind on this channel.

3. **Write comprehensive comparison articles, not product pages.** ~62% of our LLM referral traffic landed on "best of" and "vs" articles. LLMs cite evaluative content, not marketing copy.

4. **Don't bother with `.llms.txt` files yet — unless you also have the content.** We built machine-readable context files, structured citation catalogs, and auto-generation pipelines. We found zero evidence any LLM consumed them directly. The content and domain authority did the work.

5. **Claude users may be worth more than ChatGPT users.** We observed a 4.4x session duration differential and 2.1x page depth differential favoring Claude referrals over ChatGPT. Sample is small, but if it holds, optimizing for Claude's retrieval patterns could be higher-ROI than chasing ChatGPT volume.

6. **Treat this as a 12-month compounding bet, not a quick win.** The 6x citation gap against incumbents is structural (domain authority, press coverage, training data). No infrastructure hack closes it fast. Build the product, build the content, measure monthly.

---

## Abstract

Large language models (LLMs) increasingly function as product recommendation engines. When users query ChatGPT, Claude, or Perplexity for software recommendations, the response operates as a curated endorsement with no transparent ranking mechanism. Despite growing practitioner interest in "LLM SEO," there is little published empirical data on whether dedicated discoverability infrastructure produces measurable outcomes for early-stage products.

This study reports 90 days of data from deploying a 4-layer LLM discoverability stack (machine-readable context files, automated generation pipeline, search grounding optimization, and attribution tracking) for an early-stage consumer app with limited domain authority (Honeydew, ~52 App Store ratings). We present three complementary data sources: GA4-verified referral traffic, a structured 10-query citation audit against Perplexity AI, and a search grounding analysis benchmarked against 7 competitors.

**Principal findings:**

1. LLM-attributed traffic accounted for **~0.5% of total sessions** via GA4 source attribution, rising to **~1.1%** when measured by custom referral events — a **2.2x attribution gap** that suggests standard analytics significantly undercount LLM-driven traffic.
2. **ChatGPT drove 77% of LLM referral volume**, followed by Perplexity (15%) and Claude (8%), roughly tracking platform market share.
3. In a structured Perplexity citation audit, Honeydew achieved a **10% citation rate** compared to **60% for Cozi** (category incumbent) — a **6x gap** attributable primarily to domain authority and third-party coverage.
4. Exploratory engagement data suggests meaningful quality variation: Claude-referred sessions averaged **6.0 pages/session and 9m 35s duration** vs. ChatGPT's **2.8 pages/session and 2m 12s** — a **2.1x depth and 4.4x duration differential** (sample sizes limit confidence; see Limitations).

**Interpretation:** The infrastructure is necessary for measurement but insufficient alone for competitive citation rates. Domain authority and third-party coverage remain the dominant factors. We release our methodology and tools to enable replication and comparison across other product categories.

---

## 1. Introduction

### 1.1 Motivation

A measurable shift in product discovery began in 2024-2025: consumers increasingly query AI assistants for product recommendations rather than using traditional search engines. This matters because LLM recommendations carry implicit endorsement and lack the transparency of search engine results pages (SERPs), where ranking factors, paid placements, and organic results are distinguishable.

For startups, this creates an asymmetric information problem. Established products with extensive web presence benefit from LLM training data and search grounding. New entrants — regardless of product quality — may be invisible to the very systems consumers use to discover solutions. No established playbook exists for addressing this gap.

### 1.2 Research Questions

We investigate four questions:

- **RQ1:** Does dedicated LLM infrastructure (structured context files, citation catalogs) produce measurable referral traffic for an early-stage product?
- **RQ2:** How does referral volume and engagement quality vary across LLM platforms?
- **RQ3:** What citation rate can an early-stage product achieve in LLM responses relative to established competitors?
- **RQ4:** What content characteristics correlate with LLM citation?

### 1.3 Study Context and Conflict of Interest Disclosure

Honeydew is an AI-powered family coordination app (iOS, launched 2024) competing against established players (Cozi, FamilyWall, TimeTree) and newer entrants (Sense, Nori, familymind, Ohai). At the time of this study, Honeydew had approximately 52 App Store ratings and limited domain authority — representative of a typical early-stage startup.

**Conflict disclosure:** The author is the founder and CEO of Honeydew. This study was conducted to inform product strategy, not as independent research. All data sources are specified so readers can assess potential bias. We report unfavorable findings (10% citation rate vs. 60% for incumbents) alongside favorable ones.

---

## 2. Methods

### 2.1 Intervention: The LLM Discoverability Stack

Between January and April 2026, we deployed four infrastructure layers:

![LLM Discoverability Stack Architecture](/images/research/llm-discoverability-stack.svg)

**Layer 1 — Machine-Readable Context Files.** Structured text and JSON files served at the domain root, designed for LLM consumption:
- `.llms.txt` (3-5 KB): Product summary, features, pricing, competitive positioning, canonical URLs
- `.llms-full.txt` (50-80 KB): Comprehensive context including use cases, FAQ, and technical specifications
- `llm-citations.json`: Structured citation catalog with article metadata and attribution guidance
- `faq-corpus.json`: Machine-parseable FAQ data matching common search queries

**Layer 2 — Automated Generation.** All assets auto-generated from a single source of truth (`product-config.json`) via a Node.js script on every deploy. Staleness warning at >90 days since last data update.

**Layer 3 — Search Grounding Optimization.** Content optimized for LLMs that use web search to ground responses:
- 130+ blog articles with FAQ schema (JSON-LD)
- Structured comparison tables
- Canonical URL guidance in article headers

**Layer 4 — Attribution and Measurement.** Custom GA4 event tracking:
- `llm_referral` events triggered on detecting any of 14 known LLM platform hostnames in `document.referrer`
- Session-level attribution stored in `sessionStorage` to avoid double-counting within sessions
- Funnel tracking from LLM referral through blog engagement to App Store click

### 2.2 Data Sources

**Source 1: GA4 Referral Traffic (quantitative).** Google Analytics 4, Property ID 487238294. 90-day window: January 14 - April 13, 2026. LLM sessions identified by `sessionSource` dimension matching known LLM hostnames, supplemented by custom `llm_referral` events. Engagement metrics (session duration, pages/session) extracted per source.

**Source 2: Citation Audit (structured observational).** 10 queries tested against Perplexity AI on April 14, 2026. Query selection criteria:
- 2 category queries ("best AI family organization app 2026," "best app for family coordination AI assistant")
- 3 competitor alternative queries ("alternatives to Cozi," "skylight calendar alternative," "best shared family to-do list app AI")
- 3 feature-specific queries ("best family calendar app with AI voice," "best family list app voice input AI," "AI powered family planning app")
- 1 pain-point query ("best app for default parent mental load")
- 1 branded query ("honeydew family app review") as a positive control

Each query was run once in a fresh Perplexity session. Results were recorded as: whether Honeydew appeared, which competitors appeared, and what source URLs were cited. We do not claim these results are representative of all possible queries or sessions — LLM responses vary by model version, region, and session context.

**Source 3: Search Grounding Analysis (observational).** The same 10 queries run through web search to assess what URLs an LLM with search grounding (e.g., ChatGPT Browse, Perplexity) would discover. gethoneydew.app ranking position recorded where present.

### 2.3 Limitations and Threats to Validity

This study has significant limitations that constrain interpretation:

- **No pre-intervention baseline.** The LLM stack and content were deployed concurrently. We cannot attribute observed traffic specifically to the stack vs. organic growth, SEO improvements, or other confounds. This is an observational study, not a controlled experiment.
- **Small sample sizes.** 13 LLM sessions preclude inferential statistics. All engagement comparisons (e.g., ChatGPT vs. Claude session duration) are descriptive only. The Claude engagement data (n=1) is anecdotal and should be treated as hypothesis-generating, not evidence.
- **Point-in-time citation tests.** LLM responses are non-deterministic. Our 10-query Perplexity audit represents a single snapshot on a single day. Results may differ by session, region, model version, or time of day.
- **Attribution gaps.** GA4 source attribution relies on `document.referrer`, which is absent when users copy/paste URLs from LLM responses. Our custom event system partially closes this gap but likely still undercounts. The 2.2x ratio between custom events and GA4 sessions suggests significant dark traffic.
- **Potential selection bias in query design.** Queries were selected to represent the product category, but query selection inherently reflects the researcher's understanding of user behavior.
- **Single product, single category.** Results may not generalize to other product categories, price points, or competitive landscapes.

---

## 3. Results

### 3.1 RQ1: LLM Referral Traffic

Over the 90-day observation window, LLM-attributed sessions represented **~0.5% of total site traffic** via GA4 source attribution, distributed across three platforms:

![LLM Referral Sessions by Source](/images/research/llm-sessions-by-source.svg)

| Source | Share of LLM Traffic | Share of All Traffic |
|--------|---------------------|---------------------|
| ChatGPT | 76.9% | ~0.42% |
| Perplexity | 15.4% | ~0.08% |
| Claude | 7.7% | ~0.04% |
| **All LLM** | **100%** | **~0.54%** |

*Raw counts: 13 GA4-attributed sessions from 12 unique users, against ~2,400 total sessions.*

A custom `llm_referral` event system — which detects LLM hostnames in `document.referrer` independently of GA4's session attribution — captured **2.2x more LLM-associated visits** than GA4 alone (29 events from 27 unique users). By this measure, LLM traffic rises to approximately **1.1% of total sessions**.

This **2.2x attribution gap** is a key methodological finding. It likely reflects users who encounter Honeydew in an LLM response and then navigate to the site by typing the URL or searching for it, rather than clicking a referral link — traffic that GA4 attributes to "direct" or "organic."

**Answer to RQ1:** Yes, the infrastructure produces measurable referral traffic. However, we cannot attribute this traffic specifically to the LLM stack vs. other factors (see Limitations).

### 3.2 RQ2: Engagement Quality by Source

Engagement metrics varied substantially across LLM sources:

![Engagement Quality by LLM Source](/images/research/llm-engagement-metrics.svg)

| Source | Avg Duration | Pages/Session | Duration Index (vs. ChatGPT) | Depth Index (vs. ChatGPT) |
|--------|-------------|---------------|------------------------------|--------------------------|
| ChatGPT | 2m 12s | 2.8 | 1.0x (baseline) | 1.0x (baseline) |
| Perplexity | 3m 45s | 3.5 | 1.7x | 1.25x |
| Claude | 9m 35s | 6.0 | 4.4x | 2.1x |

**Important caveat:** The Claude and Perplexity engagement figures are based on very small samples (1 and 2 sessions respectively) and should be treated as hypothesis-generating, not conclusive. The ChatGPT baseline (10 sessions) has marginally more interpretive value; its 2m 12s average and 2.8 pages/session compare favorably to site-wide averages, suggesting LLM-referred visitors may arrive with above-average intent.

**Landing page distribution by content type:**

| Content Type | Share of LLM Referrals |
|-------------|----------------------|
| Comparison / "best of" articles | 61.5% |
| Homepage | 23.1% |
| Other blog content | 15.4% |

The concentration of LLM referrals on evaluative content (~62%) suggests LLMs preferentially cite comprehensive comparison articles over product pages or feature announcements.

**Answer to RQ2:** ChatGPT dominates volume (~77%), consistent with market share. Engagement variation across sources is directionally interesting (up to 4.4x duration differential) but sample sizes preclude confident comparison. The pattern warrants investigation with larger samples.

### 3.3 RQ3: Citation Rate vs. Competitors

The 10-query Perplexity audit produced the following results:

![Perplexity Citation Audit Results](/images/research/perplexity-citation-audit.svg)

**Honeydew was cited in 1 of 10 Perplexity queries (10%).** The single citation was the branded positive control query ("honeydew family app review"), sourced from the Apple App Store listing — not from gethoneydew.app content.

For all 9 non-branded queries, Honeydew was absent. This is the critical finding: users discovering family apps through LLMs via generic queries will not encounter Honeydew.

**Competitive benchmark** (combined Perplexity + search grounding results across 20 query-observations):

![Competitor Citation Frequency](/images/research/competitor-citation-frequency.svg)

| Competitor | Citation Rate | Gap vs. Honeydew |
|-----------|-------------|-----------------|
| Cozi | 60% | 6.0x |
| Sense | 60% | 6.0x |
| Nori | 50% | 5.0x |
| familymind | 40% | 4.0x |
| Gether | 30% | 3.0x |
| Ohai | 20% | 2.0x |
| **Honeydew** | **10%** | **baseline** |

**Answer to RQ3:** At 10%, Honeydew's citation rate is 6x below the category leaders (60%). The two instances where Honeydew appeared correspond to: (1) a branded query (expected baseline), and (2) a query matching a comprehensive 4,000+ word comparison article that ranks competitively in web search. The gap is consistent with a domain authority disadvantage rather than content quality.

### 3.4 RQ4: Content Characteristics Correlated with Citation

Two content patterns correlated with citation in our (limited) data:

**Finding 1: Evaluative content dominates.** 61.5% of LLM referral landing pages were comparison or "best of" articles. The one non-branded Perplexity citation linked to a 4,000+ word comparison page. This is consistent with the hypothesis that LLMs preferentially cite comprehensive evaluative content over product pages.

**Finding 2: App Store presence as citation source.** Perplexity's branded-query citation sourced the Apple App Store listing, not website content. This suggests App Store presence (ratings, description quality, review volume) may function as an independent citation signal.

**Non-finding: .llms.txt impact.** We cannot determine whether the `.llms.txt` files, `llm-citations.json`, or LLM note blocks contributed to any citations. No citation in our audit referenced these assets as sources.

### 3.5 Search Grounding Gap

Comparing Perplexity citation results to raw web search rankings reveals a filtering gap:

| Metric | Web Search | Perplexity |
|--------|-----------|------------|
| Honeydew appearance rate | 3/10 (30%) | 1/10 (10%) |
| Positions when appearing | #3, #5, #9 | App Store only |

gethoneydew.app content ranked in web search results for 3 queries (Skylight alternatives at position ~5, AI family planning at ~9, branded at top 3), but Perplexity cited Honeydew in only 1. This suggests Perplexity applies additional selection criteria beyond raw search ranking when choosing which products to recommend.

---

## 4. Discussion

### 4.1 Infrastructure Is Necessary for Measurement, Not Sufficient for Citation

The most defensible claim from this study is not about discoverability — it's about measurement. Before the attribution layer, LLM referrals were invisible. After deployment, we can quantify a channel that represents 0.5-1.1% of traffic and growing.

Whether the content and context layers (`.llms.txt`, structured citations) directly caused any of the observed LLM referral sessions is unknowable without a controlled experiment. The more parsimonious explanation is that existing blog content — specifically comprehensive comparison articles — drives search grounding, which in turn drives LLM citation. The LLM-specific infrastructure may contribute at the margins, but domain authority and content depth appear to be the dominant factors.

### 4.2 The Attribution Problem Is Real and Unsolved

The 2.2x gap between custom event counts and GA4 session attribution highlights a systemic measurement challenge. When a user reads a product recommendation in ChatGPT, then types the URL into their browser, that visit is attributed to "direct" traffic in GA4 — making the LLM channel invisible without custom instrumentation.

This has practical implications: any startup measuring LLM impact through standard analytics is likely seeing only **~45% of actual LLM-driven traffic**. Custom event tracking based on referrer detection partially closes this gap but cannot capture fully indirect discovery (e.g., a user who sees a product name in an LLM response, then Googles it days later).

### 4.3 Incumbent Advantage Is Structural

The 6x citation gap between Honeydew (10%) and Cozi (60%) is likely structural, not tactical. Cozi has:
- 15+ years of operation and content accumulation
- Extensive third-party review coverage (New York Times, Wirecutter, etc.)
- Millions of downloads creating a web presence footprint
- Training data inclusion from years of crawlable content

No amount of `.llms.txt` optimization can replicate these signals in the short term. The implication for early-stage startups: LLM discoverability infrastructure is a necessary foundation, but the primary lever is building the product and web presence that LLMs eventually learn to cite.

### 4.4 Hypotheses for Further Testing

Given the limitations of this study, we frame our observations as testable hypotheses rather than recommendations:

- **H1:** Comprehensive comparison articles (>3,000 words with structured tables) produce higher LLM citation rates than short-form content, controlling for domain authority.
- **H2:** App Store rating volume correlates with LLM citation frequency for product recommendation queries.
- **H3:** Custom `llm_referral` events capture 2-3x more LLM-driven traffic than GA4 source attribution alone.
- **H4:** LLM referrals from Claude produce higher engagement (session duration, pages/session) than ChatGPT referrals, controlling for landing page. (Requires n >> 1 to test.)

---

## 5. Replication Guide

All tools and methodology used in this study are available for replication:

**Attribution tracking:** Deploy GA4 custom events that detect known LLM hostnames in `document.referrer`. Our implementation tracks 14 platforms: ChatGPT (chat.openai.com, chatgpt.com), Claude (claude.ai), Perplexity (perplexity.ai), Gemini (gemini.google.com), Copilot (copilot.microsoft.com), and others.

**Citation audit:** Run 10 representative queries against Perplexity (or any LLM with browsing). Record: (1) whether your product appeared, (2) which competitors appeared, (3) what source URLs were cited. Run monthly for longitudinal tracking.

**Search grounding analysis:** Run the same queries through web search. Record ranking positions for your domain. Compare to LLM citation rates to identify the filtering gap.

**LLM context files:** Serve `.llms.txt` at your domain root with structured product context. The format is a convention, not a standard — any structure that is machine-parseable and comprehensive is likely sufficient.

We encourage other builders to publish their own results. The field needs comparative data across product categories, domain authority levels, and competitive landscapes.

---

## 6. Conclusion

This study provides early empirical evidence on LLM discoverability for early-stage startups. The core finding is sobering but useful: **dedicated LLM infrastructure produces measurable but modest referral traffic (~0.5-1.1% of sessions), and cannot close the structural 6x citation gap against established competitors in the short term.**

The more actionable finding may be methodological: custom LLM referral tracking reveals approximately **2.2x more LLM-attributed traffic** than standard analytics — meaning most startups are seeing only ~45% of their actual LLM-driven visits. The channel is likely more significant than anyone realizes, because the measurement tools haven't caught up.

For the practitioner: build the measurement layer first, invest in comprehensive evaluative content, and treat LLM discoverability as a long-term compounding investment rather than a tactical optimization.

---

*Pete Ghiorse is the founder of Honeydew, an AI-powered family coordination app. This research was conducted in April 2026 using GA4 analytics and manual citation testing. All metrics are descriptive; sample sizes preclude inferential claims. The author has a financial interest in Honeydew. Raw data available on request.*
