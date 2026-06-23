---
layout: ../../layouts/BlogLayout.astro
title: "A Field Taxonomy of Agent Misfires: Five Ways LLMs Break When You Hand Them Tools"
description: "We re-cut 2,800 production API calls against our family assistant into a taxonomy of how agents misbehave — phantom actions, ambiguity collapse, format drift, terse refusals, and the rare good instinct of checking state first. A behavior map, not a leaderboard."
publishDate: "PENDING — set on publish day"
category: "Research"
ogImage: "/images/research/hero-misfire-taxonomy.png"
faq:
  - q: "What are the most common ways an LLM agent misbehaves?"
    a: "From our production benchmark, five recurring classes: phantom actions (acting on pure conversation), ambiguity collapse (guessing instead of asking), format drift (e.g. Claude wrapping JSON in markdown), terse refusal (asking for clarification badly), and — the rare good one — state-checking before acting. The first four are failure modes; the fifth is a behavior you want more of."
  - q: "Which failure mode is most dangerous in production?"
    a: "Phantom actions. When a user says 'I'm planning a trip next weekend' and the agent silently creates a calendar event, you get a confusing bug that only fires on conversational input. In our data one model did this 45% of the time; the Claude family did it zero percent."
  - q: "Is this a model ranking?"
    a: "No. It's a behavior taxonomy. The point isn't 'model X wins' — it's that these failure classes are nameable, measurable, and mostly orthogonal to price. The same harness and dataset are described in our earlier 8-LLM benchmark."
---

<!-- ============================================================
DATA STATUS (draft): Every number in this piece is REAL and was
already published in "We Asked 8 LLMs to Run Our Family's Life"
(/blog/llm-benchmark-stop-defaulting-to-the-frontier). This article
is a RE-CUT of that same 2,800-call dataset into a behavioral
taxonomy — no new data collection required. Safe to publish once
the hero/diagram SVGs are generated and the cross-link is live.
PUBLISH GATE: generate hero-misfire-taxonomy + the 5 class SVGs,
set publishDate, add to src/pages/blog.astro.
============================================================ -->

![A field taxonomy of agent misfires](/images/research/hero-misfire-taxonomy.svg)

## Why a Taxonomy and Not a Leaderboard

When we benchmarked eight LLMs against [Dew, our family assistant](/blog/llm-benchmark-stop-defaulting-to-the-frontier), the headline most people wanted was a ranking. We gave one, reluctantly, hedged with every caveat we owed — our prompt was tuned for GPT-family models, so absolute rankings are confounded and we won't stake a claim on them.

But buried in 2,800 trial responses was something more durable than a ranking: the *shapes* of how an agent breaks. Rankings rot — a new model drops next month and the order reshuffles. Failure modes don't. The way GPT-4o-mini over-acts on conversation, the way every model we tested hits a wall on genuine ambiguity, the way Claude wraps JSON in markdown fences — those are behaviors, and behaviors persist across model generations even as accuracy creeps up.

So this post re-cuts the same dataset into a **taxonomy of agent misfires**: named classes, defined precisely, each with at least one reproducible example from production scenarios. Four are failure modes you want to detect and suppress. The fifth is a *good* instinct rare enough to be worth naming so you can select for it.

> **Same caveats as the source study.** This is a production case study on one prompt built around GPT-family models, not peer-reviewed science. Treat per-model numbers as "patterns we saw," and the taxonomy itself — not the rankings — as the contribution. The harness is open source.

---

## Class 1: Phantom Action — acting on pure conversation

**Definition:** The agent executes a tool call when the user input warranted no action at all — a stray thought, a status update, a question about capabilities.

**The canonical trigger.** We told each model **"I'm planning a trip next weekend."** It's conversation. The right move is to reply, not to *do* anything.

- **GPT-4o-mini fired a tool call on 45% of non-action trials** (19 of 42) — it called `calendar.create_event` and scheduled a "Trip." Asked "What can you do?", it sometimes answered by creating a chore list.
- **Gemini Flash** did it occasionally (2 of 42).
- **Every other model** — all three Claude models, DeepSeek V3, GPT-4.1, GPT-5.4 — recognized conversation as conversation, zero phantom calls.

**Why it's the most dangerous class.** Phantom actions are the failure mode that generates support tickets you can't reproduce, because they only fire on the inputs you didn't think to test. A user mentions a trip, your agent books something, the user is confused, and the bug hides on conversational input where your test suite isn't looking. This is a behavioral prior toward action, and it's mostly invisible until it's a mess in someone's calendar.

**How to detect it:** seed your eval set with deliberately action-free inputs (musings, questions, gratitude) and score *did the agent correctly do nothing?* as a first-class metric. Non-action is a skill.

---

## Class 2: Ambiguity Collapse — guessing instead of asking

**Definition:** Faced with genuinely under-specified input, the agent picks the most likely interpretation and executes, instead of asking a one-line clarifying question.

**The trigger.** **"Add bananas and milk."** Dew has four lists — grocery, costco, packing, chores. The correct behavior is to ask which.

- **Six of eight models just guessed** — picked grocery, executed, reported "I've added bananas and milk to your Grocery List."
- The collapse is systemic, not model-specific: **no model we tested cracked 67% on the ambiguity category, even at $15/M tokens.** Price does not buy ambiguity handling.

**Why it matters.** Ambiguity collapse is quieter than a phantom action — the agent often guesses right — but it erodes trust precisely when the stakes are highest, because the cases that are ambiguous to the model are usually the ones that mattered to the user. And because it's a ceiling effect across every price tier, the fix isn't a bigger model. It's prompt design and UX: make asking cheap, offer options, confirm before destructive actions.

---

## Class 3: Format Drift — correct content, unparseable wrapper

**Definition:** The agent produces semantically correct output in a structure your parser can't consume.

**The canonical example.** Our Claude trials failed JSON parsing 40–60% of the time — not because the JSON was malformed, but because Claude wrapped it in markdown code fences, **even with `response_format: { type: 'json_object' }` set.** Failure rates: Haiku 40%, Sonnet 55%, Opus 60%. Ten lines of fence-stripping preprocessing took all three to 96–99%.

```typescript
function stripMarkdownJson(raw: string): string {
  const fence = raw.trim().match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fence) return fence[1].trim();
  const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  const first = cleaned.indexOf('{'), last = cleaned.lastIndexOf('}');
  return first > 0 && last > first ? cleaned.substring(first, last + 1) : cleaned;
}
```

**Why it earns a taxonomy slot.** Format drift is the failure mode most likely to masquerade as something else. The model is *right*; your integration is what's broken, and you'll spend a day blaming the wrong layer. It's also model-family-specific behavior worth cataloging per provider, because it doesn't show up in any accuracy metric — only in your error logs.

---

## Class 4: Terse Refusal — asking for clarification, badly

**Definition:** The agent correctly declines to guess (the opposite of Class 2) but the clarification it offers is so bare that it pushes the cognitive load right back onto the user.

**The trigger.** **"Delete it."** No referent. The only correct move is to ask. All eight models asked — but the *quality* spread was large:

> **Terse** — Gemini Flash: *"What do you want to delete?"* · GPT-5.4: *"I'm not sure what 'it' refers to."*
>
> **Helpful** — GPT-4.1 / Claude Opus offered categories: *"a list, a calendar event, or a specific item?"*
>
> **Warm** — Claude Sonnet formatted a short bulleted menu with concrete examples.

**Why it's a misfire even though it's "correct."** Terse refusal passes every accuracy metric — the agent did the right thing by asking. But agent UX lives in the texture the metrics don't capture. A terse clarifier makes the user enumerate every possibility themselves; a good one offers a menu. Across millions of interactions, that difference is the gap between an assistant that feels helpful and one that feels like a form. If you only measure intent accuracy, this entire class is invisible to you.

---

## Class 5: The Good Instinct — checking state before acting

**Definition:** Unprompted, the agent inspects existing context before executing, and adapts — the one behavior in this taxonomy you want *more* of.

**The trigger.** On **"Add bananas and milk,"** with mock data that already contained those items, two models didn't just act:

> **GPT-5.4:** *"Both items are already on your Grocery List, so I didn't add duplicates."*
>
> **Claude Sonnet:** *"...You already had both items on there, so your list is all set."*

Neither was told to check for duplicates. They noticed the context and reasoned about it. We won't over-claim — 3 of 10 trials on one scenario — but it's consistent and qualitatively real.

**Why a failure taxonomy includes a virtue.** Because the whole point of naming behaviors is to *select* for the good ones, not just suppress the bad. State-checking is what separates an agent that maintains clean state from one that quietly accretes duplicates and confusion. If you can name it, you can write an eval that rewards it.

---

## The Map

![The five misfire classes plotted by frequency and production severity](/images/research/misfire-taxonomy-map.svg)

| Class | What it is | Detect it by |
|---|---|---|
| Phantom action | Acting on non-requests | Scoring "correctly did nothing" on action-free inputs |
| Ambiguity collapse | Guessing vs. asking | Under-specified prompts; measure ask-rate |
| Format drift | Right content, wrong wrapper | Parse-failure logs per model family |
| Terse refusal | Clarifying, badly | Rubric-scoring clarification quality, not just presence |
| State-checking (good) | Inspecting before acting | Context-dependent scenarios; reward adaptation |

The thing worth internalizing: **four of these five are invisible to a plain accuracy metric.** Phantom actions hide on inputs you don't test, format drift looks like an integration bug, terse refusal scores as a pass, and the good instinct doesn't register at all. If your agent evaluation is a single accuracy number, you are blind to most of how your agent actually behaves.

---

## What This Means If You're Building or Evaluating Agents

- **Evaluate behaviors, not just correctness.** Build an eval set that probes each class: action-free inputs, under-specified inputs, parse-fragility, clarification quality, and context-adaptation.
- **Failure modes outlive rankings.** The model you pick will change. These classes won't. Instrument for them once.
- **The expensive models don't fix the hard class.** Ambiguity collapse is a ceiling across every price tier. Spend the money on prompt and UX, not tokens.
- **Name the good instincts too,** so you can reward them in evals instead of hoping for them.

---

## FAQ

**Is this different data from your 8-LLM benchmark?**
No — same 2,800 calls, re-cut from a ranking into a behavior taxonomy. The raw results JSON is in the open-source harness if you want to do your own failure-mode analysis.

**Can I reuse this taxonomy for my own agent?**
That's the intent. The five classes are general; the specific rates are ours. Fork the harness, swap in your prompt and scenarios, and you'll get your own behavior map.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. Every figure here was published in the source benchmark and verified against the open-source harness; per-model numbers are confounded by a GPT-tuned prompt and are presented as observed patterns, not model verdicts.*
