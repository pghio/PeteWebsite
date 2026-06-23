---
layout: ../../layouts/BlogLayout.astro
title: "Does the Model Change the User? A Protocol for Measuring the Human Half of the Loop"
description: "We obsess over how models behave. We rarely ask the reverse: when you swap the model under an agent, do the people using it change how they talk, what they trust it with, how often they come back? Here's the study I want to run on our family assistant — and why almost nobody runs it."
publishDate: "PENDING — protocol only; needs a real model swap with cohorts"
category: "Research"
ogImage: "/images/research/hero-model-changes-user.png"
faq:
  - q: "Does the underlying AI model affect user behavior?"
    a: "Plausibly, yes — but it's rarely measured. When an agent gets better at handling ambiguity or stops over-acting, users may phrase requests more loosely, hand it higher-stakes tasks, and return more often. This piece proposes a protocol to measure that feedback direction; it does not yet report results."
  - q: "Why is the human side of AI behavior understudied?"
    a: "Because it's hard. It needs a real model swap, before/after cohorts, behavioral instrumentation, and patience for confounds (seasonality, product changes). Benchmarks measure the model in isolation; this measures the human-agent loop, which only exists in a live product."
  - q: "What would you measure?"
    a: "Request phrasing (length, specificity, ambiguity), task stakes (reversible vs. consequential actions delegated), trust signals (confirmations, undos, thumbs-down), and retention — compared before and after an underlying model change, against a held-back cohort."
---

<!-- ============================================================
DATA STATUS (draft): This is a PROTOCOL / HYPOTHESIS piece by
design. It is NOT backed by results and must not be dressed up as
one. Motivation draws on REAL published findings (the 67% ambiguity
ceiling; phantom-action behavior differences; Dew runs on GPT-4.1)
from /blog/llm-benchmark-stop-defaulting-to-the-frontier. The study
itself requires a real underlying-model swap with before/after
cohorts and enough traffic — neither of which exists yet. Publish
as an explicitly-framed "study I want to run," matching the repo's
"future work" honesty. When results exist, they become a separate
post; this one stays a protocol.
PUBLISH GATE: confirm framing reads unambiguously as protocol;
generate hero SVG; set publishDate; add to blog.astro.
============================================================ -->

![Does the model change the user?](/images/research/hero-model-changes-user.svg)

## The Question We Keep Pointing the Wrong Way

Every LLM benchmark — [including ours](/blog/llm-benchmark-stop-defaulting-to-the-frontier) — measures the same direction: hold the inputs fixed, vary the model, see how the model behaves. It's the natural experiment, and it's the one the whole field runs.

But there's a second direction nobody seems to measure, and it might matter more for a live product: **hold the model's job fixed, swap the model underneath, and watch how the *humans* change.**

Because users adapt. If you've ever used a voice assistant that kept mishearing you, you started talking to it like a robot — clipped, loud, unnatural. That's the loop running backwards: the model's behavior trained *you*. So the question I can't stop thinking about, running an agent real families use every day: when Dew gets better — stops over-acting, handles a looser sentence, asks a smarter clarifying question — **do families start handing it more of their actual mental load?** Or do the habits people formed early just calcify, regardless of what the model underneath can now do?

I don't have the answer. This post is the *protocol* — the study I want to run, written down honestly before I have results, because the design is the interesting part and because most writeups of this kind quietly skip the part where they admit they haven't run it yet.

> **What this is.** A research protocol and a set of hypotheses, motivated by real published findings. It reports **no results.** When the swap runs and the data clears a volume bar (the same discipline that's currently [holding our mental-load piece](/blog/) at N≥300), the results will be their own post. This one stays a plan.

---

## Why This Is Worth Measuring

Three reasons the human half of the loop is the half that pays.

**Product decisions hinge on it.** If a better model makes users delegate higher-stakes tasks, a model upgrade isn't a cost line — it's a growth lever, and you'd fund it differently. If users *don't* change no matter how good the model gets, then your model spend past "good enough" is buying nothing, and the [benchmark finding that cheap and frontier models tie on most tasks](/blog/llm-benchmark-stop-defaulting-to-the-frontier) becomes a literal budget instruction.

**It's where trust actually lives.** A model's safety and helpfulness aren't properties of the model alone; they're properties of how a human comes to rely on it. The same agent is safe with a cautious user and dangerous with one who's learned to trust it blindly. You can't read that off a benchmark — only off behavior over time.

**Almost nobody has the setup to run it.** It requires a live product, an underlying-model swap you control, behavioral instrumentation, and the patience to wait out confounds. That's rare enough that even a clean negative result would be worth publishing.

---

## The Protocol

**The intervention.** A real swap of the model under Dew — concretely, moving off our current GPT-4.1 production model (or a deliberate capability change) — with the agent's prompt, tools, and UI held as fixed as possibly. The model is the only thing that moves.

**The design.** Staged rollout with a held-back cohort: a fraction of families stay on the old model as a control, the rest move, randomized at the family level. Before/after *and* treatment/control, so seasonality and unrelated product changes don't masquerade as a model effect.

**What I'd measure — four families of signal, all from aggregate counts, no message contents** (the same privacy line that governs all of [Honeydew's metrics](/blog/seo-engine-grades-its-own-work)):

1. **Phrasing** — mean request length, specificity, and the share of requests that land in the ambiguous bucket. Hypothesis: a more capable model lets users get *lazier* in a good way — looser, more natural sentences — because they learn it'll cope.
2. **Task stakes** — the mix of reversible additions vs. consequential actions (deletes, external sends, anything hard to undo). Hypothesis: trust shows up as users delegating *riskier* things over time.
3. **Trust signals** — confirmation rates, undo rates, thumbs-down, retries within 60 seconds (a signal we [already track for deploy-gating](/blog/)). Hypothesis: these fall as the model improves, then plateau.
4. **Retention and depth** — return cadence and number of distinct intent types used per family. Hypothesis: a better model widens the *range* of the load families hand over, not just the volume.

**The honesty guards, decided up front:**
- A volume gate before any claim (N large enough per cohort; no under-powered conclusions — the rule that's [currently keeping a finished draft unpublished](/blog/)).
- Pre-registered hypotheses (above) so the data can't tempt me into a tidier story after the fact.
- A loud null-result clause: if users don't change, that's the finding, and it's an important one.

---

## The Hypotheses, Stated Plainly So I Can Be Wrong

![Predicted user-behavior shifts after a model upgrade, with a null-result column](/images/research/model-changes-user-hypotheses.svg)

| Signal | Prediction if the model matters | Null result (also interesting) |
|---|---|---|
| Request phrasing | Looser, more natural, more ambiguous-but-handled | Phrasing habits set early, never move |
| Task stakes | Users delegate riskier, less-reversible work | Stakes stay flat regardless of capability |
| Trust signals | Fewer confirmations/undos/thumbs-down, then plateau | No change — trust is about UX, not model |
| Breadth & retention | Wider intent range, more frequent return | Same handful of intents, same cadence |

If the right column wins, the uncomfortable but valuable conclusion is that **past "good enough," model capability doesn't change user behavior — UX and habit do.** That would reframe a lot of model-upgrade spending as theater. I genuinely don't know which way it goes, which is exactly why it's worth measuring rather than asserting.

---

## What This Means If You Run a Live AI Product

- **Instrument the human side now,** before your next model swap — phrasing, stakes, trust, breadth. The swap is a natural experiment you only get to run if you were already measuring.
- **Treat a model upgrade as an intervention with a control,** not a silent deploy. Hold a cohort back so you can attribute the change.
- **Be ready for the null.** "Users didn't change" is a real, fundable finding — it tells you where to stop spending.

---

## FAQ

**Why don't you have results yet?**
Because doing it right needs a real model swap with cohorts and enough traffic to clear a volume bar — and I won't publish under-powered behavioral data any more than I'd [publish an under-powered intent map](/blog/). The protocol is the honest deliverable today.

**Couldn't you just A/B test it quickly?**
The signals I care about (trust, delegated stakes, breadth) are slow — they develop over weeks of habit, not a session. A fast A/B catches phrasing changes and misses the interesting half.

**Isn't this just retention analysis?**
Retention is one of four signal families here, and the least novel. The point is the *direction* — measuring how the model's behavior reshapes the human's, which standard product analytics rarely isolates.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. This is an explicitly pre-result protocol: it reports no findings, draws its motivation from published benchmark data, and will yield a separate, data-backed post only after the swap is run and clears a volume gate.*
