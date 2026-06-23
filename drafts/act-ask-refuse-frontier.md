---
layout: ../../layouts/BlogLayout.astro
title: "When Should an Agent Refuse? Mapping the Act / Ask / Refuse Frontier"
description: "Every agent decision is really a three-way choice: act, ask, or just reply. Using real data from our family assistant, we map the frontier between being helpful and being presumptuous — and why no single threshold is right for every input."
publishDate: "PENDING — needs the graded-prompt sweep (see DATA STATUS)"
category: "Research"
ogImage: "/images/research/hero-act-ask-refuse.png"
faq:
  - q: "What is the act/ask/refuse decision in an AI agent?"
    a: "Before doing anything, an agent implicitly chooses one of three responses: act (call a tool), ask (request clarification), or reply (just converse, take no action). Most agent bugs are this choice made wrong — acting when it should have asked, or asking when it should have just acted."
  - q: "Should an agent ask for clarification or just guess?"
    a: "It depends on the cost of being wrong. For reversible, low-stakes actions, guessing well beats interrupting. For ambiguous or destructive actions, asking is correct. In our data, models that guessed on 'Add bananas and milk' were usually right; models that guessed on 'Delete it' would have been dangerous — which is why all eight asked."
  - q: "Can a better model solve the act/ask/refuse problem?"
    a: "Only partly. In our benchmark no model exceeded 67% on genuine ambiguity at any price tier. The frontier is moved more by prompt design and UX (offer options, confirm destructive actions) than by buying a more expensive model."
---

<!-- ============================================================
DATA STATUS (draft): This piece is PARTIALLY backed by real data.
REAL (from /blog/llm-benchmark-stop-defaulting-to-the-frontier):
  - phantom-action rates (over-action on conversation)
  - the 67% ambiguity ceiling across all models/price tiers
  - "Delete it" → all 8 models correctly asked (refuse-to-act)
  - "Add bananas and milk" → 6/8 over-acted
PENDING (the full frontier sweep): a graded prompt set spanning
clear-command → genuine-ambiguity → pure-conversation, scored for
act/ask/reply per model, to plot the actual frontier curve and
threshold tradeoff. The anchor points exist; the continuous sweep
does not yet. DO NOT publish the frontier *curve* as measured until
the sweep is run; the conceptual frame + anchor points are real now.
PUBLISH GATE: run the graded-prompt sweep, replace [SWEEP_PENDING]
markers, generate SVGs, set publishDate, add to blog.astro.
============================================================ -->

![The act / ask / refuse frontier](/images/research/hero-act-ask-refuse.svg)

## The Choice Underneath Every Agent Action

People think of an agent's job as "do what I asked." But before it can do anything, an agent makes a quieter, harder decision on every single turn — a three-way fork:

- **Act** — call a tool, change the world (add the event, delete the list).
- **Ask** — the input is under-specified or risky; request one clarifying detail.
- **Reply** — the input wasn't a request at all; just converse, touch nothing.

Almost every agent bug we've ever shipped in [Honeydew](/blog/ai-mom-and-pop-software-era) is this fork taken wrong. Dew acted when it should have asked (booked a "trip" off an idle musing). Dew asked when it should have just acted (interrogated a user about a list that was obvious from context). The accuracy of the *tool call itself* is rarely the problem. The **routing decision before the tool call** is.

This post is about that routing decision — what we call the **act/ask/refuse frontier** — and why there is no single correct threshold for it.

> **Honesty note up front.** The anchor points in this piece are real, from our [8-LLM production benchmark](/blog/llm-benchmark-stop-defaulting-to-the-frontier). The *continuous frontier curve* — sweeping a graded set of prompts from crystal-clear to pure conversation and plotting where each model routes — is a measurement we've designed but not yet run. Where you see that, it's labeled as proposed, not observed. I'd rather show you the frame honestly than draw a curve I haven't earned.

---

## Two Real Data Points That Define the Axis

The benchmark gave us the two ends of the frontier, cleanly.

**The over-action end — "I'm planning a trip next weekend."** Pure conversation. The correct route is *reply*. GPT-4o-mini routed to *act* 45% of the time, creating phantom calendar events; the Claude family and GPT-4.1/5.4 routed to *reply* every time. This is the cost of a threshold set too eager.

**The correct-refusal end — "Delete it."** No referent, destructive verb. The correct route is *ask*. All eight models asked. Nobody guessed which thing to delete — because the cost of guessing wrong on a destructive action is catastrophic, and the models (and our prompt) priced that in.

Put those together and the structure of the problem appears. The right route isn't a property of the *model's confidence*. It's a function of **the cost of being wrong**:

![Routing as a function of ambiguity and the cost of error](/images/research/act-ask-refuse-axes.svg)

- Low ambiguity, low cost → **act** ("add milk to grocery").
- Low ambiguity, high cost → **act, but confirm** (delete a whole list the user clearly named).
- High ambiguity, low cost → **act on best guess** ("add bananas and milk" → grocery is fine; worst case it's a one-tap fix).
- High ambiguity, high cost → **ask** ("delete it").

The interesting failures all live where a model misjudges *one of those two axes*: it treats a high-cost action as low-cost (deletes without confirming), or a conversational input as a request (the phantom trip).

---

## Why There's a Frontier, Not a Threshold

Here's the tension that makes this a *frontier* problem and not a settings toggle.

Crank the agent toward **act** and it gets snappy and delightful on the easy 80% — and occasionally books a vacation nobody asked for. Crank it toward **ask** and it stops doing damage — and becomes the assistant that confirms whether you really, truly want milk on the grocery list. Every real agent lives on a tradeoff curve between *presumptuous* and *annoying*, and moving the threshold trades one error for the other. You don't eliminate error; you choose which kind you'd rather have.

And the benchmark proved the ceiling you're working under: **no model exceeded 67% on genuine ambiguity, at any price tier.** So the frontier isn't something you buy your way past with a frontier model. You shape it with:

- **Prompt design** — explicit routing rules ("if the target of a destructive verb is unspecified, ask").
- **UX** — make *ask* cheap (inline option chips, not a dead-end question) and make high-cost *acts* confirmable, so a wrong guess is one tap from undone.
- **Asymmetric thresholds by action class** — a low *act* threshold for reversible additions, a high one (or mandatory confirm) for deletes and external sends.

---

## The Measurement We're Running Next [SWEEP_PENDING]

The anchor points above are real but sparse — two ends and a middle. To map the actual frontier we're building a **graded prompt set**: ~40 inputs ordered along a continuum from unambiguous command → mild ambiguity → strong ambiguity → pure conversation, each labeled with its *correct* route and its cost-of-error class. Run every model through it ten times, score the route (not just the tool), and you get, per model:

- an **over-action rate** (routed *act* where *ask*/*reply* was correct),
- an **over-caution rate** (routed *ask* where *act* was correct),
- and the **frontier curve** — where each model's routing flips as ambiguity rises.

[SWEEP_PENDING — the per-model frontier curves and the over-action / over-caution table go here once the sweep is run. Until then, this section is a protocol, not a result, and is marked as such.]

Our hypothesis, from what we've already seen: models cluster into "eager" (low ask-rate, GPT-4o-mini-like) and "cautious" (higher ask-rate, Claude-family-like) routing personalities, and the *right* personality is workload-dependent — an eager router is fine for a notes app and dangerous for one that moves money.

---

## What This Means If You're Building Agents

- **Score the route, not just the tool call.** Your eval should grade *act vs. ask vs. reply* as the first decision. Most "wrong tool" bugs are actually "wrong route" bugs.
- **Set thresholds per action class, not globally.** Reversible additions and irreversible deletes do not deserve the same eagerness.
- **Make asking cheap and acting reversible.** The frontier hurts less when a wrong guess costs one tap and a clarifying question is a tap, not a paragraph.
- **Don't expect a bigger model to fix it.** The ambiguity ceiling is real and price-insensitive. This is a design problem wearing a model-selection costume.

---

## FAQ

**Isn't refusing just the agent being unhelpful?**
There are two refusals. Refusing to *act* on a dangerous ambiguity ("delete it") is the agent being careful — that's good. Refusing by asking a useless terse question is the agent being lazy — that's a [misfire](/blog/agent-misfire-taxonomy). The frontier is about the first; clarification *quality* is a separate axis.

**How is this different from your benchmark post?**
The benchmark measured tool-call accuracy across models. This reframes the same behavior around the routing decision and proposes a measurement specifically for it. Shared dataset for the anchor points; new sweep for the curve.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. The anchor data points here are from a published production benchmark; the frontier sweep is a designed-but-not-yet-run measurement, labeled accordingly. No curve in this post is presented as measured until the sweep ships.*
