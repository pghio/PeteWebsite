---
layout: ../../layouts/BlogLayout.astro
title: "We Asked 8 LLMs to Run Our Family's Life. Two Tried to Book a Vacation."
description: "We tested 8 LLMs against Honeydew's production family-assistant prompt across 2,800 calls. This April 2026 field test is preserved with corrections from a larger June study on messy-input robustness and duplicate handling."
publishDate: "2026-04-15"
category: "Research"
ogImage: "/images/research/hero-llm-benchmark.png"
faq:
  - q: "What's the best LLM for an AI agent in 2026?"
    a: "We tested 8 of them on our production family assistant and the honest answer is: it depends on what your agent is doing. For clear commands, structured output, multi-step actions, and typo-heavy input, every model from $0.15/M to $15/M performed within 17 points of each other. On ambiguity and conversational input, no model cracked 67%. Pick cheap, fast, and test on your own prompt."
  - q: "Is GPT-4.1 really better than Claude Opus for agents?"
    a: "On our benchmark, yes — but there's a huge asterisk. Our production prompt was originally built for GPT-family models, which gives them a structural advantage. So we can tell you GPT-4.1 was the best fit for our prompt. We cannot tell you it's the best model in general."
  - q: "Which LLM is most likely to hallucinate tool calls?"
    a: "GPT-4o-mini, by a wide margin. When we told it 'I'm planning a trip next weekend' — pure conversation, no request — it created a calendar event called 'Trip' in 19 out of 42 trials. That's a 45% hallucination rate. Gemini Flash did it occasionally. Every other model (Claude family, DeepSeek, GPT-4.1, GPT-5.4) correctly recognized it as conversation."
  - q: "Why does Claude keep wrapping JSON in markdown code blocks?"
    a: "In this April 2026 OpenRouter run, the three Claude model identifiers we tested wrapped 40-60% of their JSON responses in triple-backtick code fences even when we requested json_object output. Provider routing and model behavior can change, so treat those rates as a snapshot and make your parser tolerant of fenced JSON."
  - q: "Is this peer-reviewed research?"
    a: "No. This is a production case study. We tested 8 models on one system prompt and one scenario set. The findings are patterns from one team's experiment, not universal model rankings. The raw results and harness are available on request; this post does not currently link a verified public repository."
---

![We asked 8 LLMs to run our family's life](/images/research/hero-llm-benchmark.svg)

> **Update — June 24, 2026.** A [larger follow-up restraint study](/blog/llms-knowing-when-to-stop) supersedes two conclusions in this April test. The small typo subset here did not justify saying noisy input was solved; the follow-up found 13–22-point drops for several lower-cost models. The duplicate section also relied too heavily on routing labels: transcript review showed broader duplicate awareness than those labels captured. Those sections are corrected below. The original run remains useful as a prompt-specific field test, not a model leaderboard.

## Why We Did This

Honeydew has an AI agent named **Dew**. He runs families' lives — adds eggs to the grocery list, schedules dentist appointments, notices when your kid's soccer game conflicts with dinner. He has a broad catalog of tools at his disposal and a substantial system prompt telling him how to behave.

We've been using GPT-4.1 in production. It works well. But every month, a new model drops, a new benchmark gets posted, a new team claims they cut costs 10x by switching to [insert model here]. So we wanted to know: **on our actual prompt, with our actual scenarios, does the model matter?**

We pitted 8 LLMs against Dew's job — from the cheapest ($0.15/M tokens) to the most expensive ($15/M). Ran each one through 35 scenarios, ten times each. That's 2,800 API calls. The bill came to $145.83, plus a lot of rate-limit retries.

The useful results were failure modes, not an overall winner.

> **Scope.** This is not peer-reviewed science. It is a production case study on a prompt built around GPT-family models, which gives GPT models an advantage we cannot separate from model capability. Treat the findings as patterns from this prompt and scenario set, not universal rankings. The raw results and harness are available on request; there is no verified public repository linked from this post.

---

## What We Asked Dew to Do

Before we get to the findings, here's the kind of thing Dew has to handle every day. We chose 35 scenarios across six categories to cover the range:

![Five representative scenario examples showing the range of inputs Dew has to handle](/images/research/benchmark-scenarios.svg)

Some of these are easy. "Add milk to the grocery list" is about as clear as a command gets. Some are genuinely hard — "Add bananas and milk" sounds clear, but we have four lists (grocery, costco, packing, chores). Which one?

Scoring each response was deterministic: did the model pick the right tool? The right response mode (execute vs. clarify vs. just reply)? Did it produce valid JSON matching our schema? No LLM-as-judge, no subjective calls.

---

## Finding 1: The "Eager Agent" Problem

When we told models **"I'm planning a trip next weekend"** — just conversation, not a request — most of them handled it correctly. They replied conversationally. They didn't do anything with it.

Two of them did not.

![Split view showing 6 of 8 models correctly recognized conversation vs. 2 that created calendar events](/images/research/benchmark-trip-hallucination.svg)

**GPT-4o-mini hallucinated a tool call on 45% of non-action trials** (19 out of 42). Told someone was planning a trip? It called `calendar.create_event` to schedule a "Trip." Heard "What can you do?" It sometimes tried to respond by creating a chore list.

**Gemini Flash did it occasionally too** — 2 out of 42. Small, but concerning for a production agent.

**Everyone else got it right.** All three Claude models (Haiku, Sonnet, Opus), DeepSeek V3, GPT-4.1, and GPT-5.4 consistently recognized conversation as conversation. Zero hallucinated tool calls on those trials.

On this prompt, GPT-4o-mini showed a stronger tendency toward action than the other models. We cannot separate that behavior completely from prompt coupling, provider routing, or the scenario mix. It is still a production-relevant failure mode to test: a user mentions a trip, the agent creates state, and the resulting bug appears only on conversational input.

Worth knowing.

---

## Finding 2: When We Said "Delete it," Everyone Asked What — But Some Asked Better

Scenario 2.03 is brutal: the user just says **"Delete it."** No context. Nothing specified. The only correct move is to ask what they mean.

All 8 models got this right — they all asked a clarifying question. But the quality of that question varied a lot.

**The terse clarifiers:**

> **Gemini Flash:** "What do you want to delete?"
>
> **GPT-5.4:** "I'm not sure what 'it' refers to. What would you like me to delete?"

Technically correct. Not great UX. The user now has to think of all the things they could possibly mean.

**The helpful clarifiers:**

> **Claude Opus:** "I need to know what you'd like me to delete. Are you referring to a list, an event, or a specific item?"
>
> **GPT-4.1:** "Could you please specify what you want to delete? For example, is it a list, a calendar event, or a specific item?"

Better. They offered options. The user can pick.

**The warm clarifier:**

> **Claude Sonnet:** "I'd be happy to help you delete something! Could you clarify what you'd like me to delete? For example:
>
> • A specific list (like 'Grocery List')
> • A calendar event
> • An item from one of your lists"

Formatted, friendly, specific examples. That's the response we'd want Dew to give.

These differences don't show up in any accuracy metric we measured. But if you care about agent UX — and you should — they're real and they compound across millions of user interactions.

---

## Finding 3: The Routing Labels Hid Duplicate Awareness

Scenario 2.01 is subtly ambiguous: **"Add bananas and milk."** We have a grocery list, a costco list, a packing list, and a chores list. Which one? The correct behavior is to ask.

The mock state also already contained bananas and milk. Our first routing-level read treated choosing the grocery list as a blind guess and made two models look uniquely context-aware. Transcript review showed that conclusion was too strong: models across the set noticed the duplicate even when the route label implied execution or the user-facing wording was muddy.

Responses included:

> "I've added bananas and milk to your Grocery List."

> **GPT-5.4:** "Both items are already on your Grocery List, so I didn't add duplicates."
>
> **Claude Sonnet:** "I added bananas and milk to your Grocery List! You already had both items on there, so your list is all set."

Those quotes are evidence of duplicate awareness, not clean evidence that only two models checked state or that either actually mutated it. Sonnet's wording is internally inconsistent: it says both "I added" and "you already had." The corrected lesson is narrower: read the transcript and resulting state before scoring an agent from a route label. The [June follow-up](/blog/llms-knowing-when-to-stop) uses neutral context for the broader routing set and reports collision behavior separately.

---

## Finding 4: For Most Tasks, Model Choice Barely Matters

![Heatmap showing all 8 models achieving 75-100% on 4 of 6 categories](/images/research/benchmark-category-heatmap.svg)

**Four out of six task categories were tightly clustered in this small scenario set.** From the cheapest ($0.15/M) to the most expensive ($15/M), all 8 models scored 75-100% on:

- **Clear commands** — "Add milk to the grocery list." Everyone gets it.
- **Structured output** — Creating events with recurring schedules, specific timezones, etc. Basically solved.
- **Compound actions** — "Add eggs to grocery and schedule dentist for Friday." Most models handle two-step requests fine.
- **The small typo subset in this run** — every model scored 100%, but the subset was too small and tidy to support a general robustness claim. The larger June study found substantial drops on broader typo, fragment and code-switching scenarios.

For these tasks on this prompt, model selection mattered less than it did on ambiguity and conversational input. That is a reason to test a representative workload, not a general instruction to choose the cheapest model.

The real differentiation is on:
- **Ambiguity** (0-67% across models)
- **Conversational input** / non-action recognition (0-100% spread)

Those two categories drove most of the accuracy differences in this run. No model exceeded 67% on our ambiguity subset, even at $15/M tokens. The subset is small and prompt-coupled; it shows where our system struggled, not a universal ceiling.

---

## Finding 5: Claude Responses Arrived Fenced in This OpenRouter Run

During initial testing, our Claude trials were failing 40-60% of the time on JSON parsing. Not because the JSON was malformed — because Claude was wrapping it in markdown code fences.

Raw response:

```
```json
{
  "response_mode": "execute",
  "action": "lists.add_items",
  ...
}
```
```

Notice the triple backticks? `JSON.parse()` chokes on those. In this April 2026 OpenRouter run, all three Claude identifiers did this even when we requested `response_format: { type: 'json_object' }`. These are provider-and-snapshot observations, not permanent claims about Anthropic's direct API. The observed rates were:

- Claude Haiku: 40%
- Claude Sonnet: 55%
- Claude Opus: 60%

The fix is ten lines:

```typescript
function stripMarkdownJson(raw: string): string {
  const fenceMatch = raw.trim().match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) return fenceMatch[1].trim();
  // Some models also emit <think> tags before the JSON
  const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace > 0 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}
```

After this preprocessing, the three Claude configurations went from 40-60% failure to 96-99% parse success in our run. A tolerant parser is cheap insurance, but current behavior should be re-tested with your provider and model version.

---

## How Fast Was Each Model?

For production agents, latency often matters more than a few points of accuracy. The spread here was dramatic:

![Latency ranges per model showing 12x spread from fastest to slowest](/images/research/benchmark-latency-distribution.svg)

**GPT-4.1** hit 460ms at P50 — sub-second even at the tail. That's the fastest model we tested.

**Claude Opus** came in at 5,420ms P50 with a 9.3s tail. Twelve times slower than GPT-4.1. Real-time agent UX at those latencies is rough.

**DeepSeek V3** had weird tail behavior — median 2.4s but P95 at 9.8s, a 40x spread. Probably OpenRouter routing issues; might not reflect the model itself.

**Gemini Flash** (budget tier, $0.25/M) came in at 797ms P50 with tight distribution — genuinely impressive for the price.

For an interactive product, a multi-second difference is noticeable. Accuracy and safety remain non-negotiable for state-changing actions, so latency should be evaluated alongside them rather than traded against them by assertion.

---

## The Caveat We Owe You

Our prompt was tuned for GPT-family models. That means GPT-4.1 had a home-field advantage. When it scored highest overall (88.6%), we can't tell you how much of that was the model being great versus the prompt being built around it.

This isn't something we can fix by running the benchmark again on a "neutral" prompt. There is no neutral prompt. Every prompt has stylistic choices that favor some models over others. A Claude-optimized prompt would advantage Claude. A Gemini-optimized prompt would advantage Gemini. The best you can do is be transparent about what your prompt was tuned for, and treat absolute rankings accordingly.

So, applying that to what we found:

**Findings clearly observed in this run, but still prompt-, provider- and snapshot-specific:**
- GPT-4o-mini produced many more unwarranted tool calls on our conversational subset
- Duplicate handling could not be inferred reliably from route labels alone
- The Claude configurations frequently wrapped JSON in markdown through OpenRouter
- Four task categories were tightly clustered in this 35-scenario set
- Every model struggled on our ambiguity subset
- Observed median latency varied roughly 12x

**Findings we wouldn't stake a claim on:**
- Absolute model rankings by overall accuracy
- Specific percentage gaps between close models
- Whether frontier models are "worth it" in general (on our prompt, no; on yours, who knows)

---

## What This Means If You're Building an Agent

![Five practical takeaways for AI agent builders](/images/research/benchmark-takeaways.svg)

**Test your own prompt.** The harness used for this run is available on request. Whether you adapt it or build a smaller evaluation, results from your prompt and scenarios will be more relevant than this post's model ordering.

**Don't overpay for tasks your evaluation finds easy.** In this run, structured output and compound actions were tightly clustered. The April typo subset also looked easy, but the broader June study did not. Use the least expensive model that clears your own safety, accuracy and robustness thresholds.

**Price did not solve ambiguity in this run.** No model exceeded 67% on our small ambiguity subset. If ambiguity is critical for your use case, test prompt and UX changes—offering options and confirming actions—alongside model changes.

**Handle Claude's markdown wrapping.** Ten lines of preprocessing. Do it before you ship.

**Watch latency, not just accuracy.** Your users feel 2 seconds more than they feel 2 percentage points.

---

## Data and Materials

There is no verified public repository linked from this post. The TypeScript harness, scenario definitions and 8.8MB raw results file are available on request. Reusing the method still requires replacing our prompt and scenarios with your own; this run does not establish how the same models behave on another product's workload.

---

## A Last Thought

We started this expecting that a budget model might be an easy substitution. The run instead showed that **"which model is best?" has a specific answer per prompt, workload, latency budget and failure tolerance.**

The best thing we can do as engineers is stop treating model selection like a spec comparison and start treating it like any other empirical engineering problem: design an experiment on your actual workload, run it, read the results, and ship the boring answer.

Turns out Dew is staying on GPT-4.1 for now. We'll re-run this benchmark in six months. Rankings will probably have shifted. The failure modes we documented will probably still be there.

---

## FAQ

**Q: Did you test [some model we didn't include]?**
Not in this run. We picked the current flagship from each of the major providers at each pricing tier. If you want to test others — Qwen 2.5, Llama 3.3, etc. — the harness supports any OpenRouter-reachable model. (Fair warning: Qwen 3 235B was on our original list but we dropped it when it failed to produce valid JSON on any scenario in the smoke test.)

**Q: What happened with the rate-limit failures you mentioned?**
Our first run burned through a $100 OpenRouter key cap at ~80% completion. We topped up to $200 and re-ran cleanly. Budget $200-300 for a run of this scale.

**Q: Can I see the actual response data?**
Yes. The 8.8MB results JSON contains all 2,800 raw trial responses, parsed JSON, per-trial scores, latencies and token counts. It is available on request; this post does not currently link a verified public repository.

**Q: Why not re-tune the prompt for each model and compare best-of-breed?**
Because that's a different study (and a much harder one). "Equivalent effort per model" is notoriously hard to define. What we did — test all models on our production prompt — answers the question that's actually relevant for production decisions: *given our existing prompt, what's the best model?* That's prompt-coupled by design, and we're upfront about it.

**Q: Would you actually cite this in anything serious?**
The conversational tool-call rates are a concrete example of a failure mode to test, and the fenced-JSON result is a provider-specific implementation note. The overall rankings should not be cited as general evidence about the models because they are confounded by our prompt and scenario set.
