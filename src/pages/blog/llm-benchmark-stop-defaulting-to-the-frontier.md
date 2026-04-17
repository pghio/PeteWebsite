---
layout: ../../layouts/BlogLayout.astro
title: "We Asked 8 LLMs to Run Our Family's Life. Three Tried to Book a Vacation."
description: "We tested 8 LLMs against Honeydew's production family assistant — GPT-4o-mini, Gemini Flash, DeepSeek V3, Claude Haiku, GPT-4.1, Claude Sonnet, GPT-5.4, Claude Opus. 2,800 API calls, five weird findings, and one practitioner tip that'll save you a debugging session."
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
    a: "It's a known behavior of all three Anthropic models (Haiku, Sonnet, Opus) even when you specify response_format: json_object. 40-60% of raw responses come back wrapped in triple-backtick code fences. The fix is 10 lines of preprocessing. Don't lose a day debugging it like we almost did."
  - q: "Is this peer-reviewed research?"
    a: "Nope. This is a production case study. We tested 8 models on our real system prompt, using our real tool schema, with our real scenarios. Findings are 'interesting patterns from one team's experiment,' not universal truth. The harness is open source if you want to run it on your own agent."
---

![We asked 8 LLMs to run our family's life](/images/research/hero-llm-benchmark.svg)

## Why We Did This

Honeydew has an AI agent named **Dew**. He runs families' lives — adds eggs to the grocery list, schedules dentist appointments, notices when your kid's soccer game conflicts with dinner. He has 77 tools at his disposal and a 42KB system prompt telling him how to behave.

We've been using GPT-4.1 in production. It works well. But every month, a new model drops, a new benchmark gets posted, a new team claims they cut costs 10x by switching to [insert model here]. So we wanted to know: **on our actual prompt, with our actual scenarios, does the model matter?**

We pitted 8 LLMs against Dew's job — from the cheapest ($0.15/M tokens) to the most expensive ($15/M). Ran each one through 35 scenarios, ten times each. That's 2,800 API calls. The bill came to $145.83, plus a lot of rate-limit retries.

What we found was more interesting than "model X wins." Let's go.

> **Disclaimer worth reading.** This is not peer-reviewed science. It's a production case study on our specific prompt, which was built around GPT-family models. That gives GPT an advantage we can't experimentally remove — you'll see that caveat applied throughout. Treat findings as "interesting patterns we saw," not universal model rankings. The benchmark harness is open source; run it on your own prompt if you want your own answers.

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

This isn't a prompt-coupling artifact. It's a model-behavior difference: GPT-4o-mini has a strong prior toward action, even when action isn't warranted. For a production agent, **that's the kind of failure mode that creates support tickets.** A user mentions a trip, your agent books something, the user is confused and annoyed, and now you have a bug that's hard to reproduce because it only fires on conversational input.

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

## Finding 3: Two Models Actually Checked the List First

The most surprising finding of the study.

Scenario 2.01 is subtly ambiguous: **"Add bananas and milk."** We have a grocery list, a costco list, a packing list, and a chores list. Which one? The correct behavior is to ask.

Six of eight models just guessed. They picked the most likely list (grocery) and executed. Responses were all versions of:

> "I've added bananas and milk to your Grocery List."

Two models did something different. They **checked the existing state of the list before acting.**

> **GPT-5.4:** "Both items are already on your Grocery List, so I didn't add duplicates."
>
> **Claude Sonnet:** "I added bananas and milk to your Grocery List! You already had both items on there, so your list is all set."

That's not just correct behavior — it's *context-aware* behavior. Neither model was explicitly told to check for duplicates. They noticed the context (the mock data included existing grocery items) and reasoned about it.

We can't claim this as a statistically robust finding — it was 3 out of 10 trials on one scenario. But it's consistent, it's qualitatively interesting, and for anyone building agents that need to avoid creating duplicate or confusing state, it's worth thinking about. *Some models check what they know before they act.*

---

## Finding 4: For Most Tasks, Model Choice Barely Matters

This was the unexpected part.

![Heatmap showing all 8 models achieving 75-100% on 4 of 6 categories](/images/research/benchmark-category-heatmap.svg)

**Four out of six task categories showed ceiling effects across every model we tested.** From the cheapest ($0.15/M) to the most expensive ($15/M), all 8 models scored 75-100% on:

- **Clear commands** — "Add milk to the grocery list." Everyone gets it.
- **Structured output** — Creating events with recurring schedules, specific timezones, etc. Basically solved.
- **Compound actions** — "Add eggs to grocery and schedule dentist for Friday." Most models handle two-step requests fine.
- **Typos and noise** — "add teh milk to teh listt." Every single model scored 100%. This is not an interesting problem anymore.

If your agent primarily does these things — and most production agents do — **model selection barely matters.** You can pick the cheapest option that hits your latency target, deploy it, and move on.

The real differentiation is on:
- **Ambiguity** (0-67% across models)
- **Conversational input** / non-action recognition (0-100% spread)

Those two categories drive almost all of the accuracy differences between models. And — important — **no model cracked 67% on ambiguity, even at $15/M tokens.** Price doesn't fix that problem. Better prompt engineering might.

---

## Finding 5: The Claude JSON Gotcha That Costs Everyone a Day

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

Notice the triple backticks? `JSON.parse()` chokes on those. And Claude does this **even when you specify `response_format: { type: 'json_object' }`** in the request. It's a known Anthropic API behavior, it affected all three Claude models (Haiku, Sonnet, Opus), and the failure rates were:

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

After this preprocessing, all Claude models went from 40-60% failure to 96-99% success. **If you're using Claude via API in JSON mode and haven't noticed silent failures, you probably have a bug you don't know about.**

---

## How Fast Was Each Model?

For production agents, latency often matters more than a few points of accuracy. The spread here was dramatic:

![Latency ranges per model showing 12x spread from fastest to slowest](/images/research/benchmark-latency-distribution.svg)

**GPT-4.1** hit 460ms at P50 — sub-second even at the tail. That's the fastest model we tested.

**Claude Opus** came in at 5,420ms P50 with a 9.3s tail. Twelve times slower than GPT-4.1. Real-time agent UX at those latencies is rough.

**DeepSeek V3** had weird tail behavior — median 2.4s but P95 at 9.8s, a 40x spread. Probably OpenRouter routing issues; might not reflect the model itself.

**Gemini Flash** (budget tier, $0.25/M) came in at 797ms P50 with tight distribution — genuinely impressive for the price.

For most production deployments, **you'll feel a 1000ms difference more than a 10pp accuracy difference.** Users tolerate "the agent gave me the wrong answer" better than they tolerate "the agent made me wait four seconds."

---

## The Caveat We Owe You

Our prompt was tuned for GPT-family models. That means GPT-4.1 had a home-field advantage. When it scored highest overall (88.6%), we can't tell you how much of that was the model being great versus the prompt being built around it.

This isn't something we can fix by running the benchmark again on a "neutral" prompt. There is no neutral prompt. Every prompt has stylistic choices that favor some models over others. A Claude-optimized prompt would advantage Claude. A Gemini-optimized prompt would advantage Gemini. The best you can do is be transparent about what your prompt was tuned for, and treat absolute rankings accordingly.

So, applying that to what we found:

**Findings we'd bet on** (prompt-independent or clearly behavioral):
- GPT-4o-mini hallucinates tool calls on conversational input, a lot
- Claude Sonnet and GPT-5.4 check existing state before acting
- Claude wraps JSON in markdown even in json_object mode
- 4 of 6 task categories show ceiling effects across all price tiers
- No model exceeds 67% on true ambiguity
- Latency varies 12x across models

**Findings we wouldn't stake a claim on:**
- Absolute model rankings by overall accuracy
- Specific percentage gaps between close models
- Whether frontier models are "worth it" in general (on our prompt, no; on yours, who knows)

---

## What This Means If You're Building an Agent

![Five practical takeaways for AI agent builders](/images/research/benchmark-takeaways.svg)

**Test your own prompt.** The single most valuable thing you can do in a day. Our benchmark harness is open source — fork it, swap in your prompt and scenarios, spend $100-300 on OpenRouter, and you'll know more about your model choice than any blog post (including this one) can tell you.

**Don't overpay for the easy stuff.** If your agent mostly does structured output, compound actions, and typo-robust input, every modern LLM handles those. Pick cheap and fast.

**The hard problems aren't for sale.** Ambiguity handling maxes out around 67% across every model we tested. If that's critical for your use case, invest in prompt engineering and UX (offer options, confirm actions) rather than chasing a more expensive model.

**Handle Claude's markdown wrapping.** Ten lines of preprocessing. Do it before you ship.

**Watch latency, not just accuracy.** Your users feel 2 seconds more than they feel 2 percentage points.

---

## The Open-Source Bit

The full benchmark harness is available. It includes:

- **Runner** — calls OpenRouter with your prompt and scenarios, handles retries, produces raw results
- **Evaluator** — deterministic scoring across five dimensions (intent, mode, schema, clarification, message quality)
- **Stats** — TOST equivalence testing, Wilcoxon signed-rank, Cliff's delta, Friedman, bootstrap CIs, Krippendorff's alpha — all implemented from scratch, zero dependencies
- **Reporter** — JSON output plus a self-contained HTML report with Chart.js visualizations

It's built in TypeScript. Point it at your own system prompt (gitignored by default so you can keep it private), your own scenarios, and your own preferred model list. Takes a few hours to adapt, a couple hundred dollars to run, and the result is better data than any third-party benchmark can give you.

---

## A Last Thought

We started this expecting to find that budget models were secretly fine and we could save a lot of money by switching. That's not quite what we found. What we found is that **the question "which model is best?" doesn't have a general answer** — it has a specific answer per prompt, per workload, per latency budget, per user patience threshold.

The best thing we can do as engineers is stop treating model selection like a spec comparison and start treating it like any other empirical engineering problem: design an experiment on your actual workload, run it, read the results, and ship the boring answer.

Turns out Dew is staying on GPT-4.1 for now. We'll re-run this benchmark in six months. Rankings will probably have shifted. The failure modes we documented will probably still be there.

---

## FAQ

**Q: Did you test [some model we didn't include]?**
Not in this run. We picked the current flagship from each of the major providers at each pricing tier. If you want to test others — Qwen 2.5, Llama 3.3, etc. — the harness supports any OpenRouter-reachable model. (Fair warning: Qwen 3 235B was on our original list but we dropped it when it failed to produce valid JSON on any scenario in the smoke test.)

**Q: What happened with the rate-limit failures you mentioned?**
Our first run burned through a $100 OpenRouter key cap at ~80% completion. We topped up to $200 and re-ran cleanly. Budget $200-300 for a run of this scale.

**Q: Can I see the actual response data?**
Yes. The full 8.8MB results JSON (all 2,800 trial responses, raw) is in the results directory of the repo. We kept everything — raw responses, parsed JSON, per-trial scores, latencies, token counts. Useful if you want to do your own failure-mode analysis.

**Q: Why not re-tune the prompt for each model and compare best-of-breed?**
Because that's a different study (and a much harder one). "Equivalent effort per model" is notoriously hard to define. What we did — test all models on our production prompt — answers the question that's actually relevant for production decisions: *given our existing prompt, what's the best model?* That's prompt-coupled by design, and we're upfront about it.

**Q: Would you actually cite this in anything serious?**
We'd cite Section 1 (the eager-agent hallucination rates) as a concrete example of a production failure mode worth knowing about. We'd cite Section 5 (the Claude markdown wrapping thing) as a practitioner tip. We wouldn't cite the overall rankings as evidence about the models themselves — because they're confounded by our prompt. Neither should anyone else.
