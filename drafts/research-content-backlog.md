# Research Content Backlog — model-behavior / evals flavors

Pieces that scratch the research itch *and* build a portfolio that reads like a
Research PM, Model Behaviors candidate. Each builds on work already shipped
(the 8-LLM benchmark, the LLM-as-judge SEO grader, the discoverability study,
the intent-taxonomy pull) so the data infrastructure mostly exists.

Ordered by fit-signal-per-effort.

> **Draft status (updated):** Full drafts now written for #1, #2, #3, #5 in
> `drafts/`. #4 was already drafted (`mental-load-measured.md`) and is gated on
> data volume. Each draft carries a `DATA STATUS` header marking what's backed by
> real published data vs. what still needs measurement before it can ship to
> `src/pages/blog/`.
> - #1 → `agent-misfire-taxonomy.md` — **publish-ready** (re-cut of real benchmark data)
> - #2 → `act-ask-refuse-frontier.md` — frame + anchors real; frontier sweep pending
> - #3 → `calibrating-an-llm-judge.md` — system real; human-agreement audit pending
> - #4 → `mental-load-measured.md` — gated at N≥300 classified requests
> - #5 → `does-the-model-change-the-user.md` — protocol only; needs a real model swap

---

## 1. A Field Taxonomy of Agent Misfires *(highest leverage)*

**Premise:** Re-cut the 8-LLM benchmark data into a *behavioral taxonomy* rather
than a leaderboard. Name and define the failure classes — phantom action
(hallucinated tool call), over-eagerness, ambiguity collapse, format drift
(the Claude JSON-in-markdown thing), silent refusal — and chart how each model
distributes across them.

**Why it lands:** "Develop and maintain taxonomies of model behaviors" is a
literal responsibility of the role. This *is* that artifact, on real data you
already have. Low incremental effort — re-analysis, not new collection.

**Bar:** Each class needs a crisp definition + ≥1 reproducible example.

---

## 2. When Should an Agent Refuse? The Act/Ask/Refuse Frontier

**Premise:** Empirical study of the helpful-vs-presumptuous tradeoff. Take a
graded set of prompts from genuine command → genuine ambiguity → pure
conversation, and measure where each model (and your own tuned agent) draws the
act/ask/refuse line. Plot the frontier; show the cost of moving the threshold.

**Why it lands:** Defaults and steerability constraints under genuine ambiguity —
the heart of the role. Demonstrates judgment where there's no clean answer.

**Bar:** A defensible prompt taxonomy + inter-rater agreement on the labels.

---

## 3. Calibrating an LLM Judge: What the SEO Grader Taught Me About Evals

**Premise:** Turn the existing LLM-as-judge grader into an evals methodology
piece — how you calibrated it, where it disagreed with human judgment, the
quality/spam/PII score drift, and how you'd detect a miscalibrated judge.

**Why it lands:** "Contribute to evals that measure alignment progress." Shows you
can build *and* distrust an eval — the mark of someone who's done it for real.

**Bar:** Show at least one case where the judge was wrong and how you caught it.

---

## 4. The Intent Map (finish the staged piece)

**Premise:** Ship `mental-load-measured.md` once the pull clears the N≥300 / ≥8
intents bar. A ranked behavioral taxonomy of what people actually ask an agent to
do, from real production data.

**Why it lands:** Taxonomy + the rare discipline of *not* publishing under-powered
data. The restraint is itself a strong signal. Already 90% written.

**Bar:** The one already set — N≥300 classified, ≥8 intents.

---

## 5. Does the Model Change the User? *(longer horizon)*

**Premise:** Longitudinal look at whether swapping the underlying model shifts how
users phrase requests, trust the agent, or change usage — behavior measured on the
*human* side of the loop, not just the model's.

**Why it lands:** "Deeply understand user interaction patterns." Few people study
the feedback direction; it's a differentiated angle.

**Bar:** Needs a real model swap with before/after cohorts — park until there's
enough traffic.

---

## Notes

- 1–3 are near-term and reuse existing data/infra; 4 is gated on data volume; 5 is
  aspirational.
- Keep the house rules: methodology-first, honest about N, replication guide,
  "interesting patterns from one team," not "universal truth."
- All five double as application evidence for the Anthropic Model Behaviors role —
  publishing even one or two before applying would strengthen the narrative
  materially.
