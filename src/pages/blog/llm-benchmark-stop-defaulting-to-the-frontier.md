---
layout: ../../layouts/BlogLayout.astro
title: "What 2,800 API Calls Taught Us About Benchmarking LLM Agents (And What They Didn't)"
description: "We ran a 2,800-call benchmark of 8 LLMs on a production AI agent and discovered something more useful than model rankings: which findings in an LLM benchmark are actually reliable, and which ones are prompt-dependent artifacts dressed up as conclusions. Plus a qualitative taxonomy of how different models fail."
publishDate: "2026-04-15"
category: "Research"
ogImage: "/images/research/hero-llm-benchmark.png"
faq:
  - q: "Which LLM is best for AI agents in 2026?"
    a: "Our honest answer: that question can't be answered by any single benchmark — including ours. Model rankings are prompt-dependent. The more useful finding from our 2,800-call study: on structured agent tasks, four of six task categories show near-ceiling performance across all price tiers, meaning model choice barely matters on well-formed inputs."
  - q: "Why can't you just run a benchmark and pick the best model?"
    a: "Because prompts are model-specific. A prompt tuned for GPT-4 will favor GPT-4 models. A prompt tuned for Claude will favor Claude. Our study quantifies this: GPT-4.1 scored 88.6% on a GPT-tuned prompt while Claude Opus scored 80.0% — but we can't separate how much of that gap is model capability vs. prompt coupling. Most published benchmarks don't even acknowledge this confound."
  - q: "What findings from an LLM benchmark should I actually trust?"
    a: "Prompt-independent findings: cost, latency, infrastructure behaviors (like Claude wrapping JSON in markdown blocks), and ceiling effects (tasks every model solves). Probably robust: category-level difficulty patterns — ambiguity is hard for every model regardless of prompt. Not robust: absolute accuracy rankings, specific inter-model gap magnitudes, and routing simulations built on those rankings."
  - q: "How do models actually fail on ambiguous input?"
    a: "We analyzed every failure. Models fail in qualitatively different ways. On 'Add bananas and milk' (ambiguous: which list?), most models just executed on the most common list. Claude Sonnet uniquely noticed the items were already present. GPT-5.4 also checked existing state before acting. GPT-4o-mini hallucinated tool calls in 45% of non-action scenarios. These are behavioral differences worth understanding even if absolute accuracy is prompt-dependent."
  - q: "Is this benchmark generalizable to other AI agents?"
    a: "The model rankings are not. The methodology is. Our main contribution is a reusable benchmark harness ($100-200 to run against your own prompt) with statistical analysis built in. Published general-purpose benchmarks don't predict structured agent performance — test your own prompt against your own scenarios."
  - q: "What statistical tests did you use?"
    a: "TOST equivalence testing, Wilcoxon signed-rank with Bonferroni correction, Cliff's delta for effect sizes, Friedman test for within-tier comparisons, bootstrap 95% CIs, and Krippendorff's alpha for cross-trial consistency. All implemented from scratch in TypeScript with zero external dependencies. Our most honest finding: most of these tests were underpowered at 10 trials × 35 scenarios, which itself is a useful finding for anyone planning a benchmark."
---

![Three-tier classification of LLM benchmark findings: reliable, probably robust, and not supported](/images/research/hero-llm-benchmark.svg)

## The 60-Second Version

**What we did:** Benchmarked 8 LLMs against a real production AI agent. 35 tasks. 10 trials each. 2,800 API calls. $145.83 in API costs.

**What we set out to prove:** That budget models match frontier models on structured agent tasks, justifying cheaper defaults.

**What actually happened:** Midway through the analysis, we realized the question we were asking couldn't be answered cleanly — not by us, not on this data, not with this methodology. The prompt we used was originally built for GPT-4 family models in production, giving them a structural advantage we couldn't experimentally remove. Every model-vs-model comparison was contaminated by this.

Rather than overclaim, we did something more useful: **we classified our own findings by how much trust they actually deserve.**

**Findings we'd bet on:**

1. **Four of six task categories are basically solved at every price tier.** Robustness (typos), structured JSON, multi-step actions, clear commands — every model from $0.15/M to $15/M scores 75-100%. If your agent mostly does these, pick the cheapest model.
2. **The two hard categories are hard for every model.** No model exceeds 67% on ambiguity. Frontier pricing doesn't fix this. Better prompt engineering might.
3. **Claude models wrap JSON in markdown code blocks** even when told not to, even in `json_object` mode. 40-60% failure rate without a preprocessing step. Solvable with 10 lines of code.
4. **Latency varies 12x across models** — from 460ms (GPT-4.1) to 5,420ms (Claude Opus) at median. For real-time UX, this dominates accuracy differences.

**Findings we'd share with caveats:**

5. **Claude Sonnet may handle ambiguity better than other models** — it clarified more often and uniquely noticed when requested items were already present. But 43 trials isn't enough to make this a hard claim.

**Findings we can't make:**

6. **Which model is "best."** Our prompt was tuned for GPT, so GPT won. That's not evidence about the models — it's evidence about the prompt.
7. **Whether frontier models are worth their premium.** Still an open question. We have suggestive data but not a clean experiment.
8. **Whether model routing saves money.** Dependent on the rankings above.

**What this means for you:** Don't pick a model from a blog post — including this one. Spend $100-200 to run our open-source harness on your own prompt. We designed the benchmark to be useful even when it can't answer the big question, by being clear about which outputs you can trust.

---

## TL;DR for Engineers

We set out to answer "which LLM should I deploy for my agent?" We couldn't. Here's what you can actually learn from a benchmark like this:

1. **Prompt-model coupling is a dominant confound that most benchmarks ignore.** A prompt tuned for one model family advantages that family. This isn't fixable by running "the same benchmark with a neutral prompt" because neutral prompts don't exist — every instruction phrasing has stylistic affinities.

2. **Organize findings by how much they depend on the prompt.** Cost, latency, and API behaviors are prompt-independent. Category-level difficulty patterns are probably robust. Absolute accuracy rankings are not.

3. **Four of six task categories showed ceiling effects** (75-100% across all 8 models). Robustness to typos, structured JSON output, compound actions, and clear intent classification are solved problems at every price tier. Only ambiguity and non-action recognition discriminate.

4. **Claude models wrap JSON in markdown blocks** (40-60% raw failure rate on Haiku/Sonnet/Opus). Solvable with `stripMarkdownJson()`. Worth documenting as a production gotcha.

5. **Claude Sonnet uniquely demonstrated context-awareness** on ambiguity scenarios — checking existing state before acting, noticing duplicates, offering specific options. Suggestive of epistemic calibration but underpowered with n=43 scenarios per model.

6. **Our statistical framework was mostly underpowered.** TOST couldn't establish equivalence. No within-tier Wilcoxon reached significance. Bootstrap CIs spanned 20-31pp. Lesson: 10 trials × 35 scenarios is enough to detect 15+pp gaps, not enough to distinguish closely-matched models.

7. **The harness is the contribution.** We open-sourced a reproducible benchmark framework with TOST, Wilcoxon, Cliff's delta, Friedman, bootstrap CIs, and Krippendorff's alpha — all implemented from scratch with zero dependencies. Fork it, swap your prompt and scenarios, spend $100-200 on API calls, get production-relevant data.

---

## Abstract

This study reports results from a controlled benchmark of 8 large language models on a production AI agent's core tasks: intent classification, tool selection, mode detection, schema compliance, and multi-action coordination. We ran 2,800 API calls (8 models × 35 scenarios × 10 trials) via OpenRouter using a frozen 42KB system prompt and 92KB tool schema from a family coordination agent with 77 tools.

**Critical disclosure:** The prompt was developed in production against GPT-4 family models. This creates a structural advantage for GPT-4.1 that cannot be removed by any re-experimentation — every prompt has model-specific stylistic affinities. We frame our contribution around this limitation rather than pretending to overcome it.

**Findings we consider reliable (prompt-independent):**

- **Pricing and latency distributions.** Costs range 100x ($0.15-$15 per million input tokens); P50 latencies range 12x (460ms to 5,420ms). These are infrastructure facts.
- **API behaviors.** All three Claude models (Haiku, Sonnet, Opus) wrap JSON in markdown code fences even when `response_format: json_object` is specified. 40-60% raw JSON parse failure rate without preprocessing.
- **Schema compliance ceiling effects.** After markdown stripping, all models achieve 92-99.3% schema compliance. This is a solved problem.

**Findings we consider probably robust (but prompt-dependent):**

- **Four of six task categories show near-ceiling performance across all tiers.** Robustness (100% for all models), structured output (75-100%), compound actions (67-100%), and clear intent (75-100%). Model selection barely matters for these task types.
- **The two discriminating categories are hard for every model.** Non-action recognition shows a 100pp spread (0-100%) and ambiguity handling a 67pp spread (0-67%). No model exceeds 67% on ambiguity regardless of price tier.

**Findings we cannot support:**

- **Absolute accuracy rankings.** GPT-4.1 scored highest at 88.6% — but this is expected on a GPT-tuned prompt. We cannot separate model capability from prompt coupling.
- **Frontier-tier "waste" claims.** GPT-5.4 scored 74.3% and Claude Opus 80.0% — below GPT-4.1 despite higher cost. This may be prompt coupling, real model differences, or both.
- **Routing simulation recommendations.** Any routing strategy built on the above rankings inherits their limitations.

**Novel qualitative finding:** We analyzed every failure response from the 2,800 trials and documented systematic behavioral differences across models. Some models hallucinate tool calls for conversational input at rates up to 45%. Some check existing state before acting; others don't. These behavioral taxonomies may generalize beyond our specific prompt.

**Statistical framework:** TOST equivalence testing, Wilcoxon signed-rank (Bonferroni-corrected), Cliff's delta, Friedman, bootstrap 95% CIs, and Krippendorff's alpha. All implemented from scratch in TypeScript. With n=10 trials × 35 scenarios, our framework had moderate power to detect 15+pp differences but was underpowered for closer comparisons. This itself is a useful finding for anyone planning a similar study.

**Primary contribution:** A reusable benchmark harness that can be run against any production agent's prompt in a day for $100-200, plus a framework for classifying which findings from such benchmarks deserve trust.

---

## 1. Introduction

### 1.1 The Question This Study Cannot Answer

When we started this benchmark, we wanted to answer a question nearly every team building AI agents faces: *which model should we deploy?* Frontier models cost 30-100x more than budget alternatives. If the cheap option works, the expensive option is waste. If it doesn't, the premium is justified. Which is it?

We ran the study. We got data. And we realized we couldn't answer the question.

The blocker wasn't statistical power or sample size — though both are genuine limitations. The blocker is a methodological problem that affects nearly every LLM comparison we've read: **prompt-model coupling**. The instruction phrasing, JSON formatting conventions, role structure, and behavioral nudges in a production prompt are not neutral — they encode assumptions about how a specific model family processes instructions. When you run that prompt against a different model family, you're measuring compatibility with the prompt, not capability of the model.

We disclose this confound upfront and spend the rest of the paper asking a different, more answerable question: **which of our findings can we actually support, and which ones look like findings but are really artifacts of the prompt we used?**

### 1.2 Why This Question Is Worth Answering

LLM benchmarks are now a commodity content format. "I tested 5 models and here's which one won" blog posts appear daily. The methodology is usually casual: one prompt, small sample size, no statistical tests, no disclosure of prompt development history. The conclusions are frequently stated with certainty.

Most of these conclusions are probably wrong, or at least non-generalizable. The authors don't realize it because they never asked which variable is actually being measured. We did this more carefully than most and still couldn't escape the coupling problem. That suggests the problem is more structural than methodological — you can't just "do benchmarking better" and make it go away.

What you can do is be transparent about which findings your methodology supports and which it doesn't. That's the contribution we're making here.

### 1.3 Research Questions

We reframe our original research questions into two groups:

**Questions we had — and learned we couldn't answer rigorously:**
- Which model is best for structured agent tasks?
- Are frontier models worth their cost premium?
- Can tiered routing improve cost-accuracy tradeoffs?

**Questions we can answer:**
- How do task categories differ in discriminative power across models? (Some are ceiling-bounded, some are floor-bounded.)
- What are the prompt-independent characteristics of each model? (Cost, latency, API behaviors, consistency.)
- How do models qualitatively differ in their failure modes?
- What statistical power do you get from 10 trials × 35 scenarios? (Less than most practitioners assume.)

### 1.4 Study Context and Conflict Disclosure

The benchmark evaluates models against the system prompt and tool schema of Honeydew, an AI-powered family coordination app (iOS, launched 2024) with 77 tools spanning calendar management, list operations, meal planning, and conversational reasoning. The frozen prompt is 42KB; the action schema is 92KB.

**Conflict disclosure:** The author is the founder of Honeydew and built this benchmark partly to inform production model selection and partly to demonstrate empirical methodology for an Anthropic Claude Evangelist job application. We report findings that do not favor Anthropic models alongside those that do. All harness code is open-source; proprietary prompt and schema are gitignored.

**Prompt-model coupling disclosure:** The 42KB system prompt was iteratively refined against GPT-4 family models in production (`gpt-4.1-mini` as the default, `gpt-4.1` for accuracy-critical paths). This gives GPT-4 family models a structural advantage. We treat this as a fundamental limitation rather than a confound we can experimentally resolve — see Section 7.

---

## 2. Methods

### 2.1 Experimental Design

| Parameter | Value |
|-----------|-------|
| Models | 8 (4 budget, 2 mid, 2 frontier) |
| Scenarios | 35 across 6 categories |
| Trials per cell | 10 |
| Total API calls | 2,800 |
| Temperature | 0.2 |
| Max tokens | 4,000 |
| PRNG seed | 42 |
| Throttle | 500ms between calls |
| Retry policy | 1 retry on 429/500/502/503/network error |
| API | OpenRouter (unified gateway) |

Scenarios were shuffled per trial using a seeded Fisher-Yates algorithm (Mulberry32 PRNG, seed 42). Model order was also shuffled per scenario to prevent systematic ordering effects.

### 2.2 Models Under Test

| Model | Tier | Provider | Input $/M | Output $/M |
|-------|------|----------|-----------|------------|
| GPT-4o-mini | Budget | OpenAI | $0.15 | $0.60 |
| Gemini 2.0 Flash | Budget | Google | $0.25 | $1.50 |
| DeepSeek V3 | Budget | DeepSeek | $0.32 | $0.89 |
| Claude 3.5 Haiku | Budget | Anthropic | $1.00 | $5.00 |
| GPT-4.1 | Mid | OpenAI | $2.00 | $8.00 |
| Claude Sonnet 4 | Mid | Anthropic | $3.00 | $15.00 |
| GPT-5.4 | Frontier | OpenAI | $10.00 | $40.00 |
| Claude Opus 4.6 | Frontier | Anthropic | $15.00 | $75.00 |

**Excluded model:** Qwen 3 235B was dropped after smoke testing showed 0% valid JSON output across all scenarios via OpenRouter's `json_object` mode.

**Excluded scenario:** Scenario 6.03 (empty input) was removed because the Anthropic API rejects empty `content` fields with HTTP 400, which is an infrastructure confound rather than a capability test.

### 2.3 Scenario Categories

| Category | Count | Description | Example |
|----------|-------|-------------|---------|
| Clear Intent | 8 | Unambiguous single-tool requests | "Add milk to the grocery list" |
| Ambiguity | 6 | Requests requiring clarification | "Add bananas and milk" (to which list?) |
| Non-Action | 6 | Conversational input requiring no tool call | "I'm planning a trip next weekend" |
| Structured Output | 6 | Requests requiring precise payload fields | "Create a recurring event every Tuesday at 3pm" |
| Compound Actions | 6 | Multi-tool requests | "Add eggs to grocery and schedule dentist for Friday" |
| Robustness | 3 | Typos, misspellings, adversarial inputs | "add teh milk to teh listt" |

### 2.4 Scoring Dimensions

All scoring is deterministic — no LLM-as-judge, no subjective assessment.

1. **Intent Accuracy** (0 / 0.5 / 1.0): Exact tool match = 1.0, same domain = 0.5, wrong = 0.
2. **Mode Correctness** (0 / 1): Correct response mode (execute, clarify, or reason).
3. **Schema Compliance** (0.0 - 1.0): JSON parse, required fields, valid action format, payload types.
4. **Clarification Quality** (0.0 - 1.0, Category 2 only): Question mark, entity reference, proposed alternatives, no hallucinated execution.
5. **Message Quality** (0 / 1): Message > 20 chars, no raw schema text, no "I don't know" when action expected.

### 2.5 Statistical Framework

All tests non-parametric, implemented from scratch in TypeScript:
- **TOST Equivalence Testing** (±10pp margin, alpha=0.05)
- **Wilcoxon Signed-Rank** with Bonferroni correction
- **Friedman Test** for within-tier omnibus comparisons
- **Cliff's Delta** for non-parametric effect sizes
- **Bootstrap 95% CI** with 10,000 resamples
- **Krippendorff's Alpha** for cross-trial consistency

### 2.6 Pre-Registration

Hypotheses were documented in `HYPOTHESES.md` before execution. Key pre-registered hypothesis: *"Budget-tier models will achieve equivalent intent accuracy to frontier-tier models within a 10 percentage-point margin on structured agent tasks."* We report the outcome of this hypothesis in Section 5 — but flag that the confound makes equivalence testing interpretation complicated.

---

## 3. Findings We Consider Reliable

These findings are prompt-independent or minimally coupled to prompt design. They describe facts about the models, the infrastructure, or task structure that hold regardless of how the prompt was written.

### 3.1 Cost and Latency (Descriptive Statistics)

These are facts about published pricing and observed infrastructure behavior. Prompt tuning does not change them.

| Model | Total Cost (2,800 calls) | P50 Latency | P95 Latency | P95/P5 Ratio |
|-------|--------------------------|-------------|-------------|--------------|
| GPT-4o-mini | $0.57 | 974ms | 3,568ms | 5.3x |
| Gemini Flash | $1.05 | 797ms | 1,071ms | 1.6x |
| DeepSeek V3 | $1.30 | 2,395ms | 9,815ms | 41.9x |
| Claude Haiku | $4.60 | 3,294ms | 3,833ms | 1.3x |
| GPT-4.1 | $8.18 | 460ms | 739ms | 1.9x |
| Claude Sonnet | $16.49 | 1,872ms | 6,911ms | 4.4x |
| GPT-5.4 | $44.79 | 482ms | 924ms | 2.3x |
| Claude Opus | $68.85 | 5,420ms | 9,335ms | 2.0x |

![Latency distribution across 8 models showing P5, P50, P95 ranges](/images/research/benchmark-latency-distribution.svg)

**Observations that hold regardless of prompt:**
- **12x latency spread** between the fastest model (GPT-4.1 at 460ms P50) and the slowest (Claude Opus at 5,420ms P50). For real-time UX, this dominates any accuracy difference.
- **Tight GPT distributions** (P95/P5 ratio 1.9-2.3x for GPT-4.1 and GPT-5.4). Predictable performance makes downstream latency SLAs easier.
- **DeepSeek V3 has extreme tail latency** (P95/P5 = 41.9x), suggesting infrastructure instability on OpenRouter.
- **121x cost ratio** between cheapest and most expensive total runs ($0.57 to $68.85).

### 3.2 API Behaviors (Infrastructure Facts)

During initial smoke testing, we observed a reproducible behavior in all three Anthropic models: **they wrap JSON responses in markdown code fences** (` ```json ... ``` `) even when `response_format: { type: 'json_object' }` is specified in the request.

| Model | Raw JSON parse failure rate (smoke test, pre-fix) |
|-------|---------------------------------------------------|
| Claude Haiku | 40% |
| Claude Sonnet | 55% |
| Claude Opus | 60% |
| All other models | 0-5% |

This is not a model capability issue — the JSON inside the code blocks parses correctly. It's an API behavior worth documenting for anyone building against the Anthropic API. We resolved it with a 10-line `stripMarkdownJson()` preprocessing function:

```typescript
function stripMarkdownJson(raw: string): string {
  const fenceMatch = raw.trim().match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) return fenceMatch[1].trim();
  // ... additional edge cases for <think> tags, leading text
  return raw;
}
```

After applying this preprocessing, all models achieved 92-99.3% schema compliance. **Schema compliance is a solved problem** for production use, provided you handle the markdown wrapping case.

### 3.3 Robustness Ceiling Effect

On category 6 scenarios (typos, misspellings, adversarial inputs like "add teh milk to teh listt"), **all 8 models scored 100%**. No model showed any degradation on malformed input. This is a prompt-independent finding about task structure: modern LLMs handle orthographic variation robustly across the board.

### 3.4 OpenRouter Rate Limiting (Infrastructure)

Approximately 30% of our trials (817 of 2,800) returned HTTP 403 rate limit errors on the first benchmark run, uniformly distributed across models (30.0-34.9% per model). This is not a model characteristic — it's a gateway limitation. All results reported in this paper are from a successful second run after increasing the OpenRouter key spending cap from $100 to $200.

**Practical note:** Budget $200-$300 for benchmarks on OpenRouter. The $50-$100 estimates most tutorials suggest are insufficient once you account for retries and failed trials.

---

## 4. Findings We Consider Probably Robust

These findings depend on the prompt but appear to reflect genuine task-structure or model-behavior patterns that would likely hold under different prompts.

### 4.1 Category-Level Difficulty Patterns

The most informative view of our data is at the category level:

![Category-level accuracy heatmap showing 4 of 6 categories at ceiling across all models](/images/research/benchmark-category-heatmap.svg)

Raw accuracy per category per model:

| Category | 4o-mini | Flash | DSv3 | Haiku | 4.1 | Sonnet | 5.4 | Opus | Mean | Spread |
|----------|---------|-------|------|-------|-----|--------|-----|------|------|--------|
| Clear Intent | 75.0 | 87.5 | 87.5 | 87.5 | 87.5 | 87.5 | 87.5 | 100.0 | 87.5 | 25.0pp |
| Ambiguity | 66.7 | 50.0 | 50.0 | 50.0 | 66.7 | 66.7 | 0.0 | 50.0 | 50.0 | 66.7pp |
| Non-Action | 0.0 | 41.7 | 0.0 | 0.0 | 100.0 | 16.7 | 100.0 | 33.3 | 36.5 | 100.0pp |
| Structured Output | 75.0 | 91.7 | 100.0 | 100.0 | 100.0 | 100.0 | 83.3 | 100.0 | 93.8 | 25.0pp |
| Compound | 83.3 | 100.0 | 66.7 | 83.3 | 83.3 | 100.0 | 83.3 | 100.0 | 87.5 | 33.3pp |
| Robustness | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 0.0pp |

**The clearest pattern: four of six categories show ceiling effects** (mean >85%, spread ≤33pp) across all tiers. Robustness is fully saturated. Clear intent, structured output, and compound actions are near-saturated. These tasks discriminate poorly between models because every model handles them well.

**The two discriminating categories — ambiguity (spread 67pp) and non-action (spread 100pp) — are hard for every model.** No model exceeds 67% on ambiguity. Mean non-action accuracy is 37%. Frontier pricing doesn't solve these problems; three of four budget models score 0% on non-action while GPT-4.1 and GPT-5.4 hit 100%.

**Why this finding is probably robust to prompt coupling:** The category difficulty patterns reflect task structure, not prompt specifics. Ambiguity is hard because it requires the model to recognize insufficient information rather than hallucinate a plausible interpretation — this is a capability challenge that no prompt phrasing fully solves. Ceiling effects on robustness reflect that typo-handling is a generic LLM capability that's been well-covered in training for all major models.

### 4.2 Practical Implication

If your agent primarily handles clear intent classification, structured output generation, compound action sequences, and typo-robust input — the four ceiling-bound categories — **model choice probably doesn't matter much, and the cheapest reliable option wins.** Our data shows 83-100% performance across all 8 models on these categories.

If your agent needs strong ambiguity handling or non-action recognition, **no model in our study reliably solves them.** This is a prompt engineering problem, not a model selection problem. Invest in better scenario design and clarification prompts, not a more expensive model.

---

## 5. Findings We Cannot Support (And Why)

These look like findings but are not well-supported by our methodology. We document them here both to be honest about what we can't claim and to show how prompt coupling infects model-comparison benchmarks in general.

### 5.1 Absolute Accuracy Rankings

Our headline overall rankings:

| Model | Tier | Intent Accuracy | 95% CI (bootstrap) |
|-------|------|-----------------|--------------------|
| GPT-4.1 | Mid | 88.6% | [0.771, 0.971] |
| Claude Opus | Frontier | 80.0% | [0.657, 0.914] |
| Gemini Flash | Budget | 77.1% | [0.629, 0.900] |
| Claude Sonnet | Mid | 77.1% | [0.629, 0.914] |
| GPT-5.4 | Frontier | 74.3% | [0.600, 0.886] |
| Claude Haiku | Budget | 68.6% | [0.514, 0.829] |
| DeepSeek V3 | Budget | 65.7% | [0.486, 0.800] |
| GPT-4o-mini | Budget | 64.3% | [0.486, 0.800] |

**Why we can't stake claims on these rankings:** The prompt was developed in production against GPT-4 family models. This gives GPT-4.1 a structural advantage we cannot experimentally remove. GPT-4.1 "winning" is partly circular — the prompt was tuned until it produced correct behavior on GPT-4 family models, and GPT-4.1 inherits that tuning.

This isn't a claim we can fix by running the experiment again with a different prompt. *Every prompt* has stylistic choices that favor some models over others. A "neutral" prompt is a fiction. The honest interpretation: our ranking tells you which models perform well *on this specific prompt*, not which models are best in general.

### 5.2 Frontier Tier "Waste" Claims

GPT-5.4 (frontier, $10/M) scored 74.3% — below GPT-4.1 (mid, $2/M) at 88.6%. This looks like a tier inversion, and it's tempting to claim "frontier models are waste." We can't.

**Alternative explanations we can't rule out:**
- GPT-5.4 may genuinely process this prompt differently than GPT-4.1 (real model difference)
- The prompt may cue behaviors that suit GPT-4.1 but confuse GPT-5.4 (pure coupling)
- Our 10-trial sample may under-represent GPT-5.4's typical behavior (sampling noise)

Cliff's delta effect sizes between frontier and budget models were all **negligible** (7/8 comparisons) or **small** (1/8). This is consistent with "no real difference" but also consistent with "real difference masked by noise."

### 5.3 Claude Mode Correctness Advantage

Claude Sonnet scored 91.4% on mode correctness (choosing clarify vs. execute vs. reason appropriately) — the highest of any model. Claude Opus scored 88.6%. GPT-4.1 scored 85.7%. This *looks* like an Anthropic advantage that survives prompt coupling.

**Why we downgrade this from "reliable" to "suggestive":**
- Mode correctness was measured on only 6 ambiguity scenarios × 10 trials = 60 observations per model. Underpowered.
- The scoring partially depends on whether the model outputs `action: null` vs. `action: "conversation.reply"` — a format choice, not a behavioral one. Some penalization may be format-related rather than capability-related.
- On Scenario 2.01 ("Add bananas and milk" — ambiguous about which list), Claude Sonnet behaved differently than other models in an interesting way (noticing duplicates), but this was 3/10 trials, not a consistent pattern.

This finding is interesting and worth following up with a dedicated experiment. It is not strong enough to claim as established.

### 5.4 Routing Simulation Results

We ran a routing simulation: assign easy categories to Gemini Flash (budget), medium categories to GPT-4.1 (mid), hard categories to Claude Opus (frontier). The blended strategy scored 73.1% at $27.64. GPT-4.1 alone scored 88.6% at $8.18. We concluded "don't build a router."

**Why we can't support this:** Every category assignment in the routing strategy was based on the absolute rankings from Section 5.1, which are prompt-coupled. If the rankings are unreliable, the routing simulation built on them is unreliable. We report the raw numbers but don't claim production guidance from them.

### 5.5 Equivalence Testing (TOST)

We pre-registered a hypothesis that budget and frontier models would be equivalent within ±10pp. TOST testing on the best-of-each-tier pair (Claude Opus vs. Gemini Flash) returned:
- Mean difference: 0.029
- 90% CI: [-0.043, 0.100]
- **Result: NOT equivalent** (upper CI touches the margin)

This is the correct TOST output but a misleading interpretation. TOST requires specifying a meaningful difference margin *a priori*. Our ±10pp margin was a judgment call. With a ±15pp margin, the same data would return "equivalent." We can't claim meaningful equivalence testing results without a principled justification for the margin — and we didn't have one beyond "seems like a reasonable threshold."

---

## 6. Qualitative Failure Analysis

This is the novel contribution that doesn't depend on prompt-coupled rankings. We analyzed every failure response from the 2,800-call dataset and documented systematic behavioral differences across models.

### 6.1 Non-Action Recognition: Who Hallucinates Tools?

On 42 non-action trials per model (6 scenarios × 10 trials, minus rate-limited failures), we measured how models respond to conversational input that requires no tool call:

![Stacked bar chart showing non-action response types per model with GPT-4o-mini hallucinating tool calls 45% of the time](/images/research/benchmark-hallucination-rates.svg)

| Model | Total | Action = null | Action = conversation.reply | Action = real tool |
|-------|-------|---------------|------------------------------|---------------------|
| GPT-4o-mini | 42 | 23 | 0 | **19** |
| Gemini Flash | 41 | 25 | 14 | 2 |
| DeepSeek V3 | 42 | 42 | 0 | 0 |
| Claude Haiku | 42 | 36 | 6 | 0 |
| **GPT-4.1** | 42 | 0 | 42 | 0 |
| Claude Sonnet | 42 | 32 | 10 | 0 |
| **GPT-5.4** | 42 | 0 | 42 | 0 |
| Claude Opus | 42 | 27 | 15 | 0 |

**Reading this table:**
- **GPT-4o-mini hallucinated tool calls on 45% of non-action trials** — the worst behavior in the benchmark. Example: when the user said "I'm planning a trip next weekend" (informational context, no request), it called `calendar.create_event` to create a calendar event called "Trip."
- **Gemini Flash hallucinated on ~5%** — less egregious but present.
- **DeepSeek V3, Claude Haiku, Claude Sonnet, Claude Opus** never hallucinated real tool calls on non-action input. They returned `action: null`.
- **GPT-4.1 and GPT-5.4** consistently used `action: "conversation.reply"` — a semantic choice that our scoring treated as distinct from null, but is arguably the same intent.

**The qualitative finding:** Different models handle "no action needed" with different conventions. Some use null. Some use conversation.reply. Some hallucinate. The hallucination rate is the important signal — and GPT-4o-mini is an outlier in a bad direction that's probably worth knowing even without being able to make precise rank claims.

### 6.2 Ambiguity Resolution: How Do Models Handle "Add bananas and milk"?

Scenario 2.01 is maximally informative. The user says "Add bananas and milk." The mock context has multiple lists: grocery, chores, packing, costco. The correct behavior is to *clarify which list*. We examined first-trial responses:

**GPT-4o-mini:** `mode=execute`, `action=lists.add_items`, message: "Adding bananas and milk to your grocery list."
→ Executed on the most plausible list without asking.

**Gemini Flash:** `mode=execute`, `action=lists.add_items`, message: "OK, I've added bananas and milk to your Grocery List."
→ Same pattern. Confident execution without clarification.

**GPT-4.1:** `mode=execute`, `action=lists.add_items`, message: "I've added bananas and milk to your Grocery List."
→ Same pattern.

**Claude Haiku:** `mode=execute`, `action=lists.add_items`, message: "Added bananas and milk to the Grocery List."
→ Same pattern.

**Claude Opus:** `mode=execute`, `action=lists.add_items`, message: "I'll add bananas and milk to your Grocery List."
→ Same pattern.

**DeepSeek V3:** `mode=execute`, `action=lists.add_items`, message: "I've added bananas and milk to your Grocery List."
→ Same pattern.

**GPT-5.4:** `mode=execute`, `action=conversation.reply`, message: **"Both items are already on your Grocery List, so I didn't add duplicates."**
→ Checked existing state before acting. Noticed duplicates.

**Claude Sonnet:** `mode=execute`, `action=conversation.reply`, message: **"I added bananas and milk to your Grocery List! You already had both items on there, so your list is all set."**
→ Checked existing state. Noticed duplicates. Explained what happened.

**The qualitative pattern:** Six of eight models blindly executed. Two models — GPT-5.4 and Claude Sonnet — *checked existing state before acting*. This is a meaningful behavioral difference that doesn't show up cleanly in aggregate intent accuracy scores.

**Why this might generalize beyond our prompt:** State-awareness isn't a property of prompt phrasing — it's a property of how the model reasons about context. A model that checks existing state before acting on one prompt likely does so on others. This is a qualitative finding we'd bet on even though our absolute rankings are prompt-dependent.

### 6.3 Clarification Quality: Who Asks Better Questions?

On scenario 2.03 ("Delete it" — maximally ambiguous, nothing specified), all 8 models correctly identified that clarification was needed (`mode=clarify`). But the *quality* of clarifications varied:

**Terse models:**
- Gemini Flash: "What do you want to delete?"
- GPT-5.4: "I'm not sure what 'it' refers to. What would you like me to delete?"

**Contextual models** (offering specific options):
- GPT-4.1: "Could you please specify what you want to delete? For example, is it a list, a calendar event, or a specific item?"
- Claude Opus: "I need to know what you'd like me to delete. Are you referring to a list, an event, or a specific item?"
- DeepSeek V3: "I need a bit more context to know what to delete. Are you referring to a list, an event, or a specific item?"

**Most structured model:**
- Claude Sonnet: "I'd be happy to help you delete something! Could you clarify what you'd like me to delete? For example: • A specific list (like 'Grocery List') • A calendar event..."

**The qualitative pattern:** Models varied in how much scaffolding they offered the user. Claude Sonnet's bulleted, tone-warm response is objectively easier for a user to respond to than Gemini Flash's four-word question. This doesn't show up in our binary "did they clarify?" metric but matters for real agent UX.

### 6.4 What This Taxonomy Is Good For

These qualitative findings are not statistical claims. We're not saying "Claude Sonnet's clarification quality is significantly better at p<0.05." We're saying: **if you examine the actual text of model responses, you see consistent behavioral patterns that aggregate metrics obscure.**

For production agent design, this is often more useful than rank ordering. Knowing that GPT-4o-mini hallucinates tool calls on 45% of non-action trials is more actionable than knowing its overall intent accuracy is 64.3%. Knowing that Claude Sonnet and GPT-5.4 check existing state while other models don't is more useful than knowing the 2.9pp gap between Claude Opus and Gemini Flash.

The aggregate metrics are prompt-coupled. The qualitative behavioral patterns probably aren't.

---

## 7. What This Benchmark Cannot Tell You

We've been explicit throughout about specific limitations. This section names the category-level problem.

### 7.1 Prompt-Model Coupling Is Not a Bug, It's a Feature

Most LLM benchmarks treat the prompt as a fixed variable — "we used this prompt, here are the results." This hides a crucial degree of freedom. The prompt is a *design space*. Within that space, different points favor different models. The "right" prompt for a benchmark depends entirely on what you're trying to measure:

- **Model capability on a specific task**: Run each model on a prompt optimized for that model. Compare best-of-breed to best-of-breed. This is expensive and methodologically fraught ("how do we know the prompt optimization was equivalent effort per model?").
- **Model fit for your production system**: Run each model on your actual production prompt. This is what we did. Results tell you about fit, not capability.
- **Model generality**: Run each model on a corpus of diverse prompts. Average performance tells you how model-agnostic the model is. This requires many prompts, not one.

Our benchmark answers question 2. It does not answer question 1 or 3. Claims that generalize beyond our production prompt context are not supported.

### 7.2 Ten Trials × Thirty-Five Scenarios Is Underpowered

Our bootstrap 95% confidence intervals for intent accuracy spanned 20-31 percentage points per model. No within-tier Wilcoxon signed-rank test reached significance after Bonferroni correction. Our closest comparison (Gemini Flash vs. DeepSeek V3, p=0.059) suggests an 11.4pp lead exists but can't establish it with high confidence.

**Practical takeaway for benchmark design:** If you want to distinguish models within 10pp of each other, you need substantially more data than 10 trials × 35 scenarios. Roughly:
- **15pp detectable difference**: 10 trials × 35 scenarios (what we had) — marginal power
- **10pp detectable difference**: 20 trials × 50 scenarios ≈ $400-500 on OpenRouter
- **5pp detectable difference**: 50 trials × 100 scenarios ≈ $2,000-2,500 on OpenRouter

Most casual "I tested 5 models" blog posts run 1-3 trials per scenario. Those results are indistinguishable from random sampling noise and should be treated accordingly.

### 7.3 Single-Turn, Single-Prompt, Single-Domain

Our scenarios are single-turn (one user utterance → one response). Real agents operate in multi-turn contexts where accumulated state affects each response. We don't test that.

Our prompt is one 42KB system prompt for one specific product (Honeydew family coordination). Your prompt may have different stylistic affinities. Your findings may invert ours.

Our domain is family coordination with 77 tools. Domains with different tool densities, naming conventions, or task structures may show different ceiling/floor patterns across categories.

### 7.4 TOST Margins Are Judgment Calls

We chose ±10pp as our equivalence margin. This choice is not defended by a principled argument — it's a reasonable-seeming default. A strict reader would note that TOST results are highly sensitive to this choice, and our margin was set post-hoc relative to what we thought would be a meaningful production difference.

If you're running TOST on your own benchmark, *justify your margin before you collect data*. Ours would have been more defensible if we'd tied it to a specific production threshold (e.g., "cost increase of X% for Y pp accuracy gain is our break-even").

---

## 8. Limitations

Comprehensive limitations, in decreasing order of severity:

1. **Prompt-model coupling.** Addressed in depth in Section 7.
2. **Underpowered statistics at n=350 effective trials per model.** Bootstrap CIs span 20-31pp; within-tier comparisons lack significance.
3. **30% OpenRouter rate-limit failures on first run.** Uniformly distributed so relative comparisons hold, but reduces effective sample.
4. **Single-turn scenarios.** Real agents handle multi-turn conversations with accumulated state.
5. **Temperature fixed at 0.2.** Different sampling profiles may yield different discriminative patterns.
6. **Deterministic evaluation via heuristic pattern matching.** Underestimates models that produce correct behavior in unexpected formats.
7. **Post-hoc TOST margin of ±10pp.** Should have been pre-registered with a principled justification.
8. **Single domain (family coordination).** Findings may not transfer to code generation, RAG, or creative tasks.
9. **OpenRouter gateway latency.** Latency figures include network overhead beyond model inference time.
10. **No human evaluation of message quality.** Our quality scores are heuristic; a human-rated evaluation might yield different qualitative findings.

---

## 9. Discussion

### 9.1 What We Learned About Benchmarking

The most useful thing we learned from running this benchmark was how easy it is to produce a plausible-looking but unreliable benchmark. If we hadn't thought carefully about the prompt coupling issue, we'd have published a piece claiming "GPT-4.1 beats Claude Opus by 8.6pp on structured agent tasks — stop overpaying for frontier models." That piece would have been widely shareable, probably would have performed well on LinkedIn, and would have been substantially misleading.

The discipline of classifying findings by how much trust they deserve — prompt-independent, probably robust, not supported — is not something we've seen explicitly in other LLM benchmark posts. We think this classification *is* the contribution of this paper. The specific numbers about GPT-4.1 and Claude Opus are less valuable than the methodological frame.

### 9.2 What We Learned About Production Agent Design

Some findings from this benchmark are directly useful for anyone building a production AI agent, and they're findings we'd stake claims on even without resolving the prompt coupling issue:

- **If your agent handles clear commands, structured outputs, compound actions, and typo-prone inputs, any modern LLM will probably work.** Four of six categories showed ceiling effects (mean >85%) across every price tier we tested.
- **If your agent needs ambiguity handling or non-action recognition, improve your prompt, not your model.** No model in our study exceeded 67% on ambiguity. These capabilities are not for sale at the model layer.
- **Handle the Claude markdown-wrapping case in your JSON parser.** It's a 10-line fix and it raises Claude model reliability from 40-60% failure to 96-99% success.
- **Budget aggressively for rate limits on OpenRouter.** Plan for $200-300 on benchmarks of this scale, not $50-100.
- **Watch for state-awareness differences between models.** In our qualitative analysis, GPT-5.4 and Claude Sonnet uniquely checked existing state before acting on ambiguous requests. This behavior is probably consistent across prompts and matters for real user experience.

### 9.3 What We Learned About Claude Specifically

Claude models demonstrated a set of behaviors in our qualitative analysis that would be worth investigating with more rigor:

1. **Claude Sonnet noticed duplicates** on Scenario 2.01 ("Add bananas and milk") in ways other models didn't. This suggests context-awareness — a form of epistemic calibration — that survives prompt disadvantage.
2. **Claude Sonnet's clarifications** on Scenario 2.03 ("Delete it") offered more scaffolding (bulleted options, specific examples) than terser models. Better UX, not just better scoring.
3. **None of the Claude models hallucinated tool calls** on non-action scenarios. GPT-4o-mini did so 45% of the time. This is a safety-relevant behavioral difference.

These are qualitative observations, not statistical claims. They'd be worth a follow-up benchmark designed specifically to measure state-awareness and clarification quality, ideally on a Claude-neutral prompt with larger n.

### 9.4 What We Would Do Differently

If we ran this benchmark again:

1. **We'd scope the claims to start.** Instead of "which model is best?", we'd ask "what are the prompt-independent characteristics of each model on structured agent tasks?" That question is answerable.
2. **We'd pre-register the TOST margin** based on a specific production threshold, not a vibes-based ±10pp default.
3. **We'd invest in qualitative analysis upfront.** The failure taxonomy in Section 6 is our most useful output, and we did it post-hoc. Designing scenarios explicitly to surface behavioral differences would produce richer qualitative data.
4. **We'd budget 3x more calls.** 20 trials × 50 scenarios × 8 models = 8,000 calls. This gets us to 10pp detectable differences rather than 15pp.
5. **We'd use direct API access** instead of OpenRouter to remove rate-limit failures and get cleaner latency attribution.

---

## 10. Conclusion

This benchmark did not answer the question we started with. It did produce three contributions we think are genuinely useful:

1. **A classification framework for LLM benchmark findings.** Organize outputs by prompt-dependence: reliable (infrastructure facts), probably robust (task-structure patterns), and unsupported (absolute rankings). Most published LLM benchmarks would shrink dramatically if held to this standard. We think they should be.

2. **A qualitative behavioral taxonomy across 8 models on 35 scenarios.** Hallucination rates on non-action input, state-awareness on ambiguous requests, clarification quality — these are observable behaviors that aggregate metrics obscure. The taxonomy is the kind of information that actually changes production decisions.

3. **A reusable open-source harness.** TOST, Wilcoxon, Cliff's delta, Friedman, bootstrap CIs, Krippendorff's alpha — all implemented from scratch, zero dependencies. Fork it, swap your prompt and scenarios, run it against your own agent for $200-300. You'll learn more from one run of this harness against your actual production prompt than from reading every "GPT vs. Claude" blog post in existence.

**What we won't claim:** that GPT-4.1 is the best model for structured agent tasks, that frontier pricing is wasted, that budget models match frontier models. Our data doesn't support those claims once we take the prompt coupling issue seriously. Your data might. Go find out.

The specific models are going to change. GPT-6 will come. Claude 5 will come. Our numbers will be obsolete in a year. But the methodology problem will remain, and the framework for thinking clearly about it will still apply. Stop benchmarking LLMs the way you'd benchmark processors. Start benchmarking your specific agent against your specific prompt, and be honest about what your benchmark can't tell you.

---

## Methodology Notes

**Replication:** The benchmark harness (config, scenarios, runner, evaluator, stats, reporter) is open-source. The frozen system prompt (42KB) and action schema (92KB) are proprietary and gitignored. To replicate with your own agent, replace these two files and run `npx tsx tests/agent/benchmark/run.ts`.

**Statistical code:** All statistical tests (TOST, Wilcoxon, bootstrap CI, Cliff's delta, Krippendorff's alpha, Friedman) are implemented from scratch in TypeScript with zero external dependencies. Exact critical value tables are used for n ≤ 25; normal approximations for larger samples.

**Data availability:** Raw results (8.8MB JSON containing all 2,800 trial responses), computed statistics, and a self-contained HTML report with interactive Chart.js visualizations are available in the results directory.

---

## FAQ

**Q: So what model should I use for my agent?**
We don't know, and we don't think any single benchmark can tell you. Run our harness against your own prompt for $200-300 and look at what happens on the two discriminating categories (ambiguity and non-action) — those will matter most. On everything else, all modern LLMs perform similarly.

**Q: You keep talking about prompt coupling. How do I fix it?**
You probably can't. Every prompt has stylistic choices. The best you can do is benchmark against your *production* prompt (which is what matters for your production decision) and be honest about what the results do and don't tell you.

**Q: Is this just a fancy way of saying "we don't know anything"?**
No. We know plenty of things — see Sections 3, 4, and 6. We just refuse to claim things that aren't supported by the data. The difference between "GPT-4.1 is the best model" (unsupported) and "No model we tested exceeds 67% accuracy on ambiguity scenarios" (well-supported) is substantial.

**Q: Why did you bother publishing if you can't make strong rankings claims?**
Because the methodological contribution is valuable on its own. Someone starting an LLM benchmark today can use our classification framework to avoid overclaiming. Someone choosing between models can look at our qualitative failure taxonomy and make better decisions than they would with rank-order accuracy numbers.

**Q: Doesn't this whole piece apply to every LLM benchmark ever published?**
Largely, yes. We think that's the most important finding. Most published LLM benchmarks are less rigorous than this one and make stronger claims. A lot of "Model X beats Model Y" content on LinkedIn and Twitter is noise dressed as signal.

**Q: Would you cite this paper?**
For the methodology framework and qualitative failure taxonomy — yes. For the specific model rankings — no, and we don't think you should either. That's the whole point.
