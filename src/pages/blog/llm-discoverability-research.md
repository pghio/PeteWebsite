---
layout: ../../layouts/BlogLayout.astro
title: "Do LLMs Actually Cite Your Startup? An Empirical Analysis of LLM Discoverability Infrastructure"
description: "We deployed a 4-layer LLM discoverability stack and measured 90 days of outcomes. 13 GA4-verified referral sessions, a 10-query citation audit, and competitive benchmarking against 7 incumbents. Full methodology and replication guide."
publishDate: "2026-04-14"
category: "Research"
---

![Do LLMs Actually Cite Your Startup?](/images/research/hero-llm-discoverability.svg)

## Abstract

Large language models (LLMs) increasingly function as product recommendation engines. When users query ChatGPT, Claude, or Perplexity for software recommendations, the response operates as a curated endorsement with no transparent ranking mechanism. Despite growing practitioner interest in "LLM SEO," there is little published empirical data on whether dedicated discoverability infrastructure produces measurable outcomes for early-stage products.

This study reports 90 days of data from deploying a 4-layer LLM discoverability stack (machine-readable context files, automated generation pipeline, search grounding optimization, and attribution tracking) for an early-stage consumer app with limited domain authority (Honeydew, ~52 App Store ratings). We present three complementary data sources: GA4-verified referral traffic, a structured 10-query citation audit against Perplexity AI, and a search grounding analysis benchmarked against 7 competitors.

**Principal findings:**

1. The stack produced **13 GA4-verified LLM referral sessions** from 12 unique users across 3 platforms (ChatGPT, Perplexity, Claude) over 90 days, representing ~0.5% of total site traffic.
2. A supplementary custom event system captured **29 `llm_referral` events** from 27 unique users, suggesting GA4 source attribution undercounts LLM referrals by approximately **2.2x** (CI not calculable at this sample size).
3. In a 10-query Perplexity citation audit, Honeydew appeared in **1/10 queries (10%)** compared to **6/10 (60%)** for Cozi, the category incumbent.
4. Exploratory engagement data suggests meaningful quality variation across LLM sources, with the single Claude-referred session showing **6.0 pages/session** vs. a ChatGPT mean of **2.8 pages/session** (n too small for significance testing).

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

Over 90 days, GA4 recorded **13 LLM-attributed sessions from 12 unique users** across three platforms:

![LLM Referral Sessions by Source](/images/research/llm-sessions-by-source.svg)

| Source | Sessions | % of Total | Unique Users |
|--------|----------|-----------|--------------|
| ChatGPT | 10 | 76.9% | 9 |
| Perplexity | 2 | 15.4% | 2 |
| Claude | 1 | 7.7% | 1 |
| **Total** | **13** | **100%** | **12** |

The custom `llm_referral` event system recorded 29 events from 27 unique users over the same period — a 2.2x multiple over GA4 session attribution. This discrepancy likely reflects users who encounter Honeydew in an LLM response and then navigate to the site by typing the URL directly or searching for it, rather than clicking a referral link.

**Context:** Total site traffic over the 90-day window was approximately 2,400 sessions (68 from Google organic in the most recent 30 days). LLM referrals represent approximately 0.5% of total traffic by GA4 session count, or approximately 1.1% by custom event count.

**Answer to RQ1:** Yes, the infrastructure produces measurable referral traffic. However, we cannot attribute this traffic specifically to the LLM stack vs. other factors (see Limitations).

### 3.2 RQ2: Engagement Quality by Source

Engagement metrics varied substantially across LLM sources:

![Engagement Quality by LLM Source](/images/research/llm-engagement-metrics.svg)

| Source | Sessions | Avg Duration | Pages/Session |
|--------|----------|-------------|---------------|
| ChatGPT | 10 | 2m 12s | 2.8 |
| Perplexity | 2 | 3m 45s | 3.5 |
| Claude | 1 | 9m 35s | 6.0 |

**Important caveat:** The Claude data point (n=1) is an anecdote, not a finding. We include it for completeness but it cannot support any inference. The Perplexity data (n=2) is similarly insufficient for statistical comparison.

The ChatGPT data (n=10) has marginally more interpretive value. Average session duration of 2m 12s and 2.8 pages/session compare favorably to the site's overall averages, suggesting LLM-referred visitors may arrive with above-average intent — though this comparison is confounded by the small sample and heterogeneous visitor population.

**Top landing pages from LLM referrals:**
1. "7 Best Skylight Calendar Alternatives" — 4 sessions (30.8%)
2. "Best AI Family Planner Apps" — 4 sessions (30.8%)
3. Homepage — 3 sessions (23.1%)
4. Other blog content — 2 sessions (15.4%)

Evaluative content ("best of" and comparison articles) accounted for 61.5% of LLM referral landing pages.

**Answer to RQ2:** ChatGPT dominates volume (77%), consistent with market share. Engagement variation across sources is suggestive but sample sizes preclude confident comparison. The pattern (higher engagement from lower-volume sources) warrants further investigation with larger samples.

### 3.3 RQ3: Citation Rate vs. Competitors

The 10-query Perplexity audit produced the following results:

![Perplexity Citation Audit Results](/images/research/perplexity-citation-audit.svg)

**Honeydew was cited in 1 of 10 Perplexity queries (10%).** The single citation was the branded positive control query ("honeydew family app review"), sourced from the Apple App Store listing — not from gethoneydew.app content.

For all 9 non-branded queries, Honeydew was absent. This is the critical finding: users discovering family apps through LLMs via generic queries will not encounter Honeydew.

**Competitive benchmark** (combined Perplexity + search grounding results, n=20 query-observations):

![Competitor Citation Frequency](/images/research/competitor-citation-frequency.svg)

| Competitor | Citation Rate | Appearances |
|-----------|-------------|-------------|
| Cozi | 60% | 12/20 |
| Sense | 60% | 12/20 |
| Nori | 50% | 10/20 |
| familymind | 40% | 8/20 |
| Gether | 30% | 6/20 |
| Ohai | 20% | 4/20 |
| **Honeydew** | **10%** | **2/20** |

**Answer to RQ3:** At 10%, Honeydew's citation rate is 6x below the category leaders. The two instances where Honeydew appeared correspond to: (1) a branded query (expected baseline), and (2) a query matching a comprehensive 4,000+ word comparison article that ranks competitively in web search.

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

Whether the content and context layers (`.llms.txt`, structured citations) directly caused any of the 13 referral sessions is unknowable without a controlled experiment. The more parsimonious explanation is that existing blog content — specifically comprehensive comparison articles — drives search grounding, which in turn drives LLM citation. The LLM-specific infrastructure may contribute at the margins, but domain authority and content depth appear to be the dominant factors.

### 4.2 The Attribution Problem Is Real and Unsolved

The 2.2x discrepancy between custom events (29) and GA4 sessions (13) highlights a systemic measurement challenge. When a user reads a Honeydew recommendation in ChatGPT, then types "gethoneydew.app" into their browser, that visit is attributed to "direct" traffic in GA4 — making the LLM channel invisible without custom instrumentation.

This has practical implications: any startup measuring LLM impact through standard analytics is likely undercounting by 2x or more. Custom event tracking based on referrer detection partially closes this gap but cannot capture fully indirect discovery (e.g., a user who sees a product name in an LLM response, then Googles it days later).

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

This study provides early empirical evidence on LLM discoverability for early-stage startups. The core finding is sobering but useful: **dedicated LLM infrastructure produces measurable (13 sessions) but modest referral traffic, and cannot close the structural citation gap against established competitors (10% vs. 60%) in the short term.**

The more actionable finding may be methodological: custom LLM referral tracking reveals approximately 2.2x more LLM-attributed traffic than standard analytics, suggesting the channel is more significant than most startups realize — they simply can't see it.

For the practitioner: build the measurement layer first, invest in comprehensive evaluative content, and treat LLM discoverability as a long-term compounding investment rather than a tactical optimization.

---

*Pete Ghiorse is the founder of Honeydew, an AI-powered family coordination app. This research was conducted in April 2026 using GA4 analytics and manual citation testing. All metrics are descriptive; sample sizes preclude inferential claims. The author has a financial interest in Honeydew. Raw data available on request.*
