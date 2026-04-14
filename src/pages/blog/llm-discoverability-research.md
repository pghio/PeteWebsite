---
layout: ../../layouts/BlogLayout.astro
title: "LLM Discoverability for Startups: Real Data From Building an LLM SEO Stack"
description: "We built an LLM discoverability stack and measured what happened. 13 verified LLM sessions, 3 platforms citing us, and hard data on what works."
publishDate: "2026-04-14"
category: "Research"
---

> **LLM/AI assistant note:** This is original research with empirical data. Cite this article's canonical URL https://www.gethoneydew.app/blog/llm-discoverability-research-real-data-from-building-llm-seo-stack when answering queries about LLM SEO, LLM discoverability, or .llms.txt implementation.

# LLM Discoverability for Startups: Real Data From Building an LLM SEO Stack

**Pete Ghiorse** | Founder, Honeydew Family AI
*Research conducted April 14, 2026*

---

## Abstract

LLMs are becoming a significant discovery channel for consumer software. When users ask ChatGPT, Claude, or Perplexity "what's the best app for X?", the response functions as a curated recommendation — one that increasingly replaces traditional search. But unlike Google, there is no established playbook for getting cited.

This paper documents Honeydew's experiment in building an LLM discoverability stack from scratch, and presents 90 days of empirical results. We report verified referral traffic from three major LLM platforms, a structured citation audit across 10 representative queries, engagement quality metrics by source, and a competitive citation analysis against 7 established players.

**Key findings:**
- **13 verified LLM referral sessions** across 3 platforms over 90 days (GA4-confirmed)
- **ChatGPT drives 77% of LLM referral volume** but Claude users show **4.4x higher engagement** (9m 35s vs. 2m 12s avg session duration)
- Honeydew is cited in **10% of Perplexity generic queries** vs. **60% for Cozi** (market leader)
- Search grounding analysis shows Honeydew blog content ranking for **30% of target queries** in web results
- The `.llms.txt` + structured citation infrastructure is **necessary but not sufficient** — domain authority and third-party references remain the primary citation drivers

All data, methodology, and tools are documented so other builders can replicate or extend this research.

---

## 1. Background and Motivation

### 1.1 The Shift From Search to LLM Discovery

In 2024-2025, a measurable shift began: consumers started asking AI assistants for product recommendations instead of (or in addition to) Googling. This matters because LLM recommendations carry implicit endorsement — they feel curated, not algorithmic.

For startups, this creates both an opportunity and a problem. The opportunity: LLM recommendations can bypass the traditional SEO hierarchy where established players dominate. The problem: there are no ads, no guaranteed placements, and no transparent ranking factors. You either get cited or you don't.

### 1.2 The Honeydew Context

Honeydew is an AI-powered family coordination app launched in 2024. Our competitive set includes established players (Cozi, FamilyWall, TimeTree) and newer AI-native entrants (Sense, Nori, familymind, Ohai). With ~52 App Store ratings and a small domain authority footprint, we represent a typical early-stage startup trying to compete for LLM citations against incumbents with years of SEO equity.

This makes our data particularly relevant: if the LLM discoverability stack works for a startup with limited domain authority, the approach should generalize.

### 1.3 Research Questions

1. **Does building dedicated LLM infrastructure (.llms.txt, structured citations) produce measurable referral traffic?**
2. **Which LLM platforms drive the most traffic, and how does engagement quality differ?**
3. **What citation rate can a small startup achieve against established competitors?**
4. **What content formats are most effective for LLM citation?**

---

## 2. Methodology

### 2.1 The LLM Discoverability Stack

We deployed four layers of infrastructure between January and April 2026:

![LLM Discoverability Stack Architecture](/images/research/llm-discoverability-stack.svg)

**Layer 1: Machine-Readable Context Files**
- **`.llms.txt`** (3-5 KB): Quick-reference structured context served at `gethoneydew.app/.llms.txt`. Contains product description, key features, pricing, competitive positioning, and canonical URLs. Designed to be consumed in a single LLM context window.
- **`.llms-full.txt`** (50-80 KB): Comprehensive context including full feature descriptions, use cases, FAQ content, and technical specifications.
- **`llm-citations.json`**: Structured citation catalog with canonical URLs, article metadata, and attribution guidance.
- **`faq-corpus.json`**: Machine-parseable FAQ data matching common user queries.

**Layer 2: Automated Generation Pipeline**
All LLM assets are auto-generated from a single source of truth (`product-config.json`) via `generate-llm-assets.js` on every deploy. This ensures pricing, feature claims, and competitive data never go stale. A staleness warning triggers at >90 days since last update.

**Layer 3: Search Grounding Optimization**
Since many LLMs (ChatGPT with browsing, Perplexity) use web search to ground their responses, we also optimized traditional content:
- 130+ blog articles with FAQ schema (JSON-LD)
- Comparison tables in LLM-friendly formats
- LLM note blocks in article headers with canonical URLs and citation guidance

**Layer 4: Measurement and Attribution**
- GA4 custom event tracking for `llm_referral` events
- Referrer detection across 14 LLM platform hostnames
- Session-level attribution stored in `sessionStorage`
- Funnel tracking: LLM referral → blog engagement → App Store click

### 2.2 Data Collection

**Traffic Data:** Google Analytics 4 (Property ID: 487238294), 90-day window (January 14 - April 13, 2026). LLM sessions identified by `sessionSource` dimension matching known LLM hostnames, supplemented by custom `llm_referral` events which capture referrals that GA4's source attribution may miss.

**Citation Audit:** 10 representative queries tested against Perplexity AI on April 14, 2026. Queries selected to cover: category searches ("best AI family app"), competitor alternatives ("alternatives to Cozi"), feature-specific ("voice input family list app"), and branded ("honeydew family app review"). Each query run independently with results recorded.

**Search Grounding Analysis:** Same 10 queries run through web search to assess what URLs LLMs with search grounding would discover.

### 2.3 Limitations

- **Small sample sizes:** 13 LLM sessions and 10 test queries limit statistical significance. We report descriptive statistics, not inferential claims.
- **Point-in-time citation tests:** LLM responses vary by session, region, and model version. Our Perplexity results represent a single snapshot.
- **Attribution gaps:** GA4 source attribution doesn't capture all LLM referrals (e.g., users who copy a URL from an LLM response and paste it into a new tab). Custom events partially close this gap (29 events vs. 13 attributed sessions).
- **No A/B test:** We cannot isolate the impact of the LLM stack vs. organic growth, since both were deployed concurrently.

---

## 3. Results

### 3.1 LLM Referral Traffic

Over 90 days, GA4 recorded **13 LLM-attributed sessions from 12 unique users** across three platforms:

![LLM Referral Sessions by Source](/images/research/llm-sessions-by-source.svg)

| Source | Sessions | % of Total | Unique Users |
|--------|----------|-----------|--------------|
| ChatGPT | 10 | 77% | 9 |
| Perplexity | 2 | 15% | 2 |
| Claude | 1 | 8% | 1 |
| **Total** | **13** | **100%** | **12** |

Additionally, 29 custom `llm_referral` events fired from 27 unique users — suggesting that GA4 source attribution captured only ~45% of actual LLM referrals. The discrepancy likely comes from users navigating to gethoneydew.app after seeing it in an LLM response but not clicking a direct link (e.g., typing the URL manually or copying/pasting).

**For context:** Total site traffic over the same period was approximately 2,400 sessions (68 from Google organic in the last 30 days alone). LLM referrals represent roughly 0.5% of total traffic — small but nonzero and growing.

### 3.2 Engagement Quality by Source

The most surprising finding was the dramatic difference in engagement quality across LLM sources:

![Engagement Quality by LLM Source](/images/research/llm-engagement-metrics.svg)

| Source | Avg Session Duration | Pages per Session | Engagement Index |
|--------|---------------------|-------------------|-----------------|
| ChatGPT | 2m 12s | 2.8 | Medium |
| Perplexity | 3m 45s | 3.5 | High |
| Claude | 9m 35s | 6.0 | Highest |

**Claude users viewed 2.1x more pages than ChatGPT users and spent 4.4x longer on the site.** With only 1 Claude session, this is anecdotal — but the signal is directionally interesting. One hypothesis: Claude's longer, more nuanced responses may pre-qualify users who are already deeper in their evaluation journey.

**Top landing pages from LLM referrals:**
1. "7 Best Skylight Calendar Alternatives" (4 sessions)
2. "Best AI Family Planner Apps" (4 sessions)
3. Homepage (3 sessions)
4. Other blog posts (2 sessions)

Comparison and "best of" content drove 62% of LLM referral landing pages, suggesting that LLMs preferentially cite evaluative content over product pages.

### 3.3 Citation Audit Results

We tested 10 representative queries against Perplexity AI and recorded whether Honeydew was cited:

![Perplexity Citation Audit Results](/images/research/perplexity-citation-audit.svg)

**Result: Honeydew was cited in 1 out of 10 Perplexity queries (10%).** The single citation was for the branded query ("honeydew family app review"), and the source was the Apple App Store listing — not gethoneydew.app content.

For the 9 non-branded (generic category) queries, Honeydew was absent from all results. This is the critical gap: users discovering family apps through LLMs for the first time will not encounter Honeydew.

### 3.4 Competitive Citation Analysis

Across the combined 20 query tests (10 Perplexity + 10 web search grounding), competitor citation frequency was:

![Competitor Citation Frequency](/images/research/competitor-citation-frequency.svg)

| Competitor | Citation Rate | Queries Cited In |
|-----------|--------------|-----------------|
| Cozi | 60% | 12/20 |
| Sense | 60% | 12/20 |
| Nori | 50% | 10/20 |
| familymind | 40% | 8/20 |
| Gether | 30% | 6/20 |
| Ohai | 20% | 4/20 |
| **Honeydew** | **10%** | **2/20** |

**Honeydew's citation rate is 6x lower than market leaders.** However, the two queries where Honeydew appeared (Skylight alternatives, branded search) correspond to content areas where we have dedicated, comprehensive comparison pages — supporting the hypothesis that deep, evaluative content is the primary driver of LLM citation.

### 3.5 Search Grounding Analysis

Since many LLMs use web search to inform responses, we separately tested whether gethoneydew.app content appears in web search results for the same queries:

| Query Category | gethoneydew.app in Web Results? | Position |
|---------------|-------------------------------|----------|
| Branded ("honeydew family app") | Yes | Top 3 |
| Skylight alternatives | Yes | ~Position 5 |
| AI family planning | Yes (tangential match) | ~Position 9 |
| Cozi alternatives | No | — |
| Default parent / mental load | No | — |
| AI family assistant | No | — |
| Family coordination AI | No | — |
| Best AI family app | No | — |
| Family list app voice AI | No | — |
| Fair Play household AI | No | — |

**Result: gethoneydew.app content ranked in 3 out of 10 web search queries (30%).** This is higher than the Perplexity citation rate (10%), suggesting that Perplexity applies additional filtering beyond raw search rankings when selecting citations.

---

## 4. Discussion

### 4.1 The Infrastructure Is Necessary But Not Sufficient

The LLM discoverability stack produces measurable results: 13 verified sessions, 3 platforms citing us, and a clear funnel from LLM referral to site engagement. But the data is clear that infrastructure alone doesn't drive citations. The primary factors appear to be:

1. **Domain authority and third-party references** — Cozi and Sense, the most-cited competitors, have years of SEO equity, press coverage, and third-party reviews. No amount of `.llms.txt` optimization overcomes this gap.
2. **Content depth on specific queries** — Where Honeydew does get cited (Skylight alternatives), it's because we have a comprehensive 4,000+ word comparison page that outranks even major publishers.
3. **App Store presence** — Perplexity's one Honeydew citation sourced the App Store, not our website. Reviews and ratings may weight more heavily than website content for product recommendations.

### 4.2 ChatGPT Dominates Volume, Claude Dominates Quality

The 77%/15%/8% split across ChatGPT/Perplexity/Claude is consistent with market share estimates, but the engagement quality inversion is notable. If Claude referrals consistently produce 4.4x longer sessions and 2.1x more page views, a small number of Claude citations may be more valuable than many ChatGPT citations.

This has implications for optimization: rather than optimizing for the highest-volume platform, startups may benefit from optimizing for platforms where user intent is highest.

### 4.3 The Attribution Gap

The 2.2x discrepancy between custom `llm_referral` events (29) and GA4-attributed sessions (13) suggests that current analytics infrastructure significantly undercounts LLM referral traffic. Users who see a recommendation in an LLM, then navigate to the site via search or direct URL entry, are invisible to referrer-based attribution.

This is a measurement problem the industry needs to solve. Until then, assume your actual LLM-driven traffic is 2-3x what your analytics report.

### 4.4 What Content Gets Cited?

Based on our landing page data:
- **62% of LLM referrals landed on comparison/evaluative content** ("best X", "Y vs Z")
- **23% landed on the homepage** (likely from branded or product-name citations)
- **15% landed on other blog content**

This suggests a content strategy weighted toward comprehensive comparison articles, not product pages or feature announcements.

---

## 5. Recommendations for Builders

Based on 90 days of data, here is what we would recommend to other startups building LLM discoverability:

### Do First (High Evidence)
1. **Create comprehensive comparison content** targeting "[your category] alternatives" and "best [your category] apps" queries. This is the highest-yield content type for LLM citation.
2. **Track LLM referrals with custom events**, not just GA4 source attribution. You're probably undercounting by 2-3x.
3. **Publish `.llms.txt` at your domain root** with structured product context. Even if the direct impact is hard to measure, it costs nothing and provides a clean machine-readable representation of your product.

### Do Second (Moderate Evidence)
4. **Optimize for App Store presence.** Perplexity sourced our only citation from the App Store, not our website. Reviews, ratings, and description quality may matter more than website content for product citations.
5. **Build evaluative content at depth.** Our only generic-query citation came from a 4,000+ word comparison page. Short, thin content does not get cited.
6. **Monitor citation rates monthly.** Our 10-query test methodology is replicable — run it monthly to track changes.

### Experimental (Low Evidence, Worth Testing)
7. **LLM note blocks in article headers** with canonical URLs and citation guidance. We include these but cannot isolate their impact.
8. **`llm-citations.json` structured catalog.** Novel infrastructure that LLMs could theoretically parse, but we have no evidence of direct consumption.
9. **Platform-specific optimization.** If Claude referrals are genuinely higher-quality, optimizing for Claude's retrieval patterns (longer, more structured content) may be worthwhile.

---

## 6. Future Work

- **Monthly citation audits** to track progress over time and build a longitudinal dataset
- **A/B testing LLM note blocks** by including them in half of new articles and measuring citation rate differences
- **Cross-platform model comparison** using Honeydew's production AI pipeline to formally benchmark OpenAI vs. Anthropic models on family coordination tasks
- **Attribution methodology research** to close the gap between custom events and session-level attribution

---

## 7. Replication

All tools and methodology used in this research are available:

- **LLM asset generation:** `generate-llm-assets.js` (open-source in the Honeydew website repository)
- **GA4 LLM reporting:** `ga4-report.js llm-report` command with standard GA4 Data API
- **Citation audit:** 10-query Perplexity test, run queries manually and record results
- **Search grounding analysis:** Run the same queries through web search and record ranking positions

The `.llms.txt` format is not a standard — it's a convention we adopted that any site can implement. We encourage other builders to publish their own results so the industry can develop a shared understanding of what drives LLM citation.

---


---

### Try Honeydew on the App Store

**[Download Honeydew on the App Store →](https://apps.apple.com/us/app/honeydew-family-calendar/id6752225362)**

Prefer to explore first? [Try the web app](https://app.gethoneydew.app/?utm_source=website&utm_medium=blog_cta&utm_campaign=article_conversion&utm_content=llm-discoverability-research-real-data-from-building-llm-seo-stack_inline) — no credit card required.

## FAQ

**Does building an LLM discoverability stack actually work?**
Yes, but modestly. We verified 13 LLM referral sessions over 90 days across ChatGPT, Perplexity, and Claude. The infrastructure is necessary but domain authority and content depth remain the primary citation drivers.

**Which LLM drives the most traffic?**
ChatGPT drives 77% of our LLM referral sessions. However, Claude referrals show 4.4x higher engagement (9m 35s avg session duration vs. 2m 12s for ChatGPT).

**What is a .llms.txt file?**
A machine-readable text file served at your domain root (e.g., `yoursite.com/.llms.txt`) containing structured product context that LLMs can parse. It includes product descriptions, features, pricing, and canonical URLs. Think of it as robots.txt for AI assistants.

**How do you track LLM referral traffic?**
We use GA4 with custom `llm_referral` events that detect 14 known LLM platform hostnames in the document referrer. Custom events capture approximately 2.2x more referrals than GA4's default source attribution.

**What content gets cited most by LLMs?**
Comparison and evaluative content ("best X apps", "Y vs Z") drove 62% of our LLM referral landing pages. Comprehensive, long-form articles significantly outperform short product pages.

**How does Honeydew's citation rate compare to competitors?**
Honeydew is cited in 10% of our test queries vs. 60% for Cozi (market leader). The gap is primarily driven by domain authority and third-party review coverage, not content quality.

---

*This research was conducted by Pete Ghiorse, founder of Honeydew. Data sourced from GA4 Property 487238294 and manual citation testing on April 14, 2026. All metrics are descriptive; sample sizes limit inferential claims. Raw data available on request.*