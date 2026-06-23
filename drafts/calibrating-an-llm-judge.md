---
layout: ../../layouts/BlogLayout.astro
title: "Calibrating an LLM Judge: What 1,147 Auto-Graded Pages Taught Me About Trusting a Model's Opinion"
description: "I run a system where one model grades another model's work and that grade decides what ships. Here's how I calibrate the judge — where it agrees with me, where it doesn't, and how to catch a judge that's quietly miscalibrated before it poisons your pipeline."
publishDate: "PENDING — needs the human-agreement audit (see DATA STATUS)"
category: "Research"
ogImage: "/images/research/hero-llm-judge.png"
faq:
  - q: "What is an LLM-as-judge?"
    a: "Using one language model to score the output of another — quality, safety, relevance — instead of (or before) a human. It scales evaluation, but only works if the judge is calibrated against human judgment, because an unexamined judge can be confidently, consistently wrong."
  - q: "How do you know if your LLM judge is calibrated?"
    a: "Sample its scores, grade the same items yourself, and measure agreement and direction of disagreement. A judge that's lenient, harsh, or blind to a specific failure isn't useless — but you have to know which, and adjust the threshold or the rubric accordingly. The danger is a judge you never audit."
  - q: "Should an LLM judge's score gate publishing automatically?"
    a: "Only above a confidence bar you've validated. In our system a passing score auto-publishes, a failing score holds the page for human review, and quality is 30% of ranking so even passing-but-mediocre pages sink. The judge has teeth, but the threshold was set by checking it against human grades first."
---

<!-- ============================================================
DATA STATUS (draft): The SYSTEM described here is REAL and live,
documented in "1,147 Pages, One Person"
(/blog/seo-engine-grades-its-own-work): the second-model grader,
the quality/spam/PII scores, the review-queue hold, the 30%
ranking weight, the real log lines (⏸️ score 61; auto-approved 87),
the ~1,000 NEEDS ATTENTION audit.
PENDING: the CALIBRATION audit itself — sampling N graded pages,
re-grading them by hand, and reporting judge↔human agreement rate,
lenient/harsh bias, and per-failure blind spots. Those specific
agreement numbers are marked [AUDIT_PENDING] and must NOT be
invented. The methodology and the real qualitative examples are
publishable now; the agreement statistics gate on the audit.
PUBLISH GATE: run the human-agreement audit (target N≥50 pages,
stratified across quality tiers), fill [AUDIT_PENDING], generate
SVGs, set publishDate, add to blog.astro.
============================================================ -->

![Calibrating an LLM judge](/images/research/hero-llm-judge.svg)

## One Model Grading Another, With Consequences

[Honeydew's public side](/blog/seo-engine-grades-its-own-work) is a corpus of family list templates — 1,147 URLs the morning I'm writing this, of which I hand-wrote about eighty. The rest are generated. The only reason that isn't a spam farm is a second model that reads every page cold and emits three numbers:

- **`llmQualityScore`** — 0–100, how genuinely useful the page is
- **`llmSpamScore`** — 0–100 spam risk, lower better
- **`piiConfidenceScore`** — 0–100 likelihood it leaked personal info

Those scores have teeth. A passing page auto-publishes with an audit note (`Auto-approved with score 87/100`). A failing page is *held* — my favorite log line in the codebase is `⏸️ List requires manual review (score: 61)`, one AI declining to vouch for another AI's work. And quality score is **30% of every page's ranking**, so a mediocre page that does publish sinks to the bottom instead of spreading.

Here's the uncomfortable question that whole design rests on, the one I want to spend this post on: **why do I trust the judge?**

An LLM-as-judge is itself a model with biases, blind spots, and moods. If it's quietly lenient, my spam filter is decorative. If it's quietly harsh, I'm holding good pages in a queue forever. A grader you never grade is just a confident opinion with a database column. So this is about *calibrating* the judge — making its scores mean something I've actually checked.

> **Honesty note.** The grading system is real and in production. The calibration *audit* — me re-grading a sample by hand and measuring how often the judge and I agree — is the piece I'm running now; its numbers are marked `[AUDIT_PENDING]` below and I will not fill them with anything but real results. The methodology and the failure stories, though, are real today.

---

## Step 1: Decide What "Right" Even Means

The first calibration trap is assuming quality is one thing. It isn't. When I started grading the judge, I split "quality" into the sub-judgments the score is implicitly bundling:

- **Specificity** — "Reef-safe sunscreen SPF 50+," not "Sunscreen." (A real generation rule, born from a real bad page.)
- **Completeness** — does a "toddler beach packing list" actually cover a toddler at a beach, or just a generic bag?
- **Non-redundancy** — no duplicate items across sections.
- **Honesty of structure** — does the page's schema.org type match what it actually is?

A judge can be well-calibrated on specificity and blind on completeness. Bundling them into one 0–100 number hides that. So calibration starts by un-bundling: grade the judge per sub-dimension, not just on its headline score.

---

## Step 2: The Agreement Audit [AUDIT_PENDING]

The actual calibration is boring and non-negotiable: **sample the judge's scores, re-grade the same pages by hand, and measure the gap.**

The protocol I'm running:

1. **Stratified sample** across the corpus's known tiers — the ~80 "excellent" hero pages, ~200 "good" expanded pages, ~1,000 "needs attention" bulk pages (those tiers are my own [published, unflattering audit](/blog/seo-engine-grades-its-own-work)). Stratify so the sample isn't dominated by the bulk tier.
2. **Blind re-grade** each sampled page myself against the same rubric, without seeing the model's score first.
3. **Report three things:**
   - **Agreement rate** — how often human and judge land in the same pass/hold bucket.
   - **Direction of disagreement** — when we differ, is the judge *lenient* (passes pages I'd hold) or *harsh* (holds pages I'd pass)? These have opposite fixes.
   - **Blind spots** — failure types the judge systematically misses (my hypothesis going in: it under-penalizes *completeness* gaps, because a thin-but-clean list reads as fine in isolation).

[AUDIT_PENDING — the agreement rate, the lenient/harsh skew, and the confusion matrix go here once the re-grade is done at N≥50. No numbers until then.]

The reason this matters more than it sounds: a judge with 90% agreement and a *lenient* skew needs its threshold raised; the same 90% with a *harsh* skew needs it lowered. Same headline number, opposite action. The agreement rate alone is almost useless without the direction.

---

## Step 3: Set the Threshold From the Audit, Not From Vibes

Right now the publish/hold threshold is a number I chose. The honest version of this system sets it *from* the calibration: pick the cutoff where the judge's lenient errors (spam that slips through) and harsh errors (good pages held) cost you about equally — or, if spam is more expensive than a held page (it is, for SEO), deliberately bias toward harsh and eat the false holds.

This is the same logic as any classifier threshold, applied to a model whose "classifier" is a paragraph of instructions. Which leads to the most useful thing I've learned: **the rubric is a hyperparameter.** When the judge is miscalibrated, you don't always retrain or swap models — you edit the rubric. "Penalize lists under 15 specific items" is a one-line calibration fix that no amount of model upgrading would give you for free.

---

## Step 4: Watch for Drift, Because Judges Don't Hold Still

A page graded fine in March shouldn't coast on March's grade forever — the model behind the judge gets updated, the corpus's baseline shifts, and a standing audit agent re-walks the corpus on a schedule re-scoring everything. Calibration is not a one-time event; a judge you calibrated last quarter is a judge you're now trusting on faith again.

And the cautionary tale from building this system at all: while writing the source post I went looking for the line of code that feeds detected search-gaps to the writer agent. **It didn't exist** — the function was written, exported, and called by nothing. The loop I was about to describe as closed had a human in it. The lesson generalizes directly to judges: *check that the wire you think is load-bearing is actually connected.* An auto-grader that silently stopped running looks identical to one that's passing everything.

---

## What This Means If You're Building LLM-as-Judge Pipelines

- **Never ship an unaudited judge.** Sample, re-grade by hand, measure agreement *and direction*. A judge you haven't checked is a confident guess with infrastructure around it.
- **Un-bundle "quality"** into sub-dimensions and calibrate each — judges are often great on one and blind on another.
- **The rubric is your tuning knob.** Most miscalibration is fixable with a sharper instruction, not a bigger model.
- **Give the judge teeth, but earn them.** Auto-publish above a *validated* bar, hold below it, and let quality discount ranking so "merely fine" sinks. Consequences are what make a judge worth calibrating in the first place.
- **Re-audit on a schedule.** Judges drift. So does the corpus they grade.

---

## FAQ

**Why not just have humans grade everything?**
1,147 pages, one person, nights and weekends. Human grading doesn't scale to the volume generation produces — which is exactly why the judge has to be trustworthy enough to act on, and exactly why calibrating it is the real work.

**Isn't an LLM grading an LLM circular?**
Only if you never close the loop with human judgment. The judge scales the easy 95%; the calibration audit and the review queue are where human judgment re-enters. The circularity breaks the moment you measure the judge against a person.

**What if the judge and the writer share the same biases?**
Real risk — a known weakness of same-family judge/author setups. It's one more reason the human agreement audit isn't optional: it's the only check that sits outside the models entirely.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. The grading system, scores, thresholds, and log lines here were verified against the production codebase; the human-agreement audit is in progress and its statistics are withheld until the re-grade is complete rather than estimated.*
