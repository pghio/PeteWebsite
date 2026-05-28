---
layout: ../../layouts/BlogLayout.astro
title: "$500,000 vs. $2,500: I Built Two Things Five Years Apart"
description: "The last product I helped ship cost half a million dollars to build. The thing I'm hacking on now has cost around $2,500. Same engineer, five years apart. Here's what actually changed."
publishDate: "2026-05-03"
category: "Essay"
ogImage: "/images/research/momnpop-hero-cost-comparison.svg"
faq:
  - q: "Is the 200× cost reduction real, or marketing?"
    a: "It's real, for me, on this comparison. GiveTide was a charitable giving platform built between 2017 and 2022 with a small team and over $500K of all-in spend. Honeydew (gethoneydew.app) is a family AI agent I've been hacking on as a personal project since 2025, for around $2,500 out of pocket. Honeydew is more technically sophisticated than GiveTide was. The 200× number is what changed at the engineering line item. It doesn't mean every engineer gets the same result, and it doesn't include the value of my own time."
  - q: "What actually changed between 2017 and 2026?"
    a: "Five things, roughly in the order they mattered. AI coding tools (Cursor and Claude Code) compressed CRUD work by 50 to 100×. The infrastructure floor dropped from about $5K a month to under $50. Model APIs let me skip building entire systems like NL categorization, transcription, embedding search. The cost of being wrong fell, so I iterate cheaply instead of polishing. And working solo means no coordination tax. Roughly 80% of my $2,500 went to the coding tools alone."
  - q: "What didn't change?"
    a: "Product judgment. Distribution. Support. Operational discipline. Knowing what to build, getting people to use it, and answering them when it breaks at 7 AM are the same hard problems they were in 2017. The AI didn't compress those, and they're often the binding constraint."
  - q: "Could anyone build a serious software product now?"
    a: "Not anyone. The cost collapse is on one axis: materializing a working software system. The other axes (taste, judgment, distribution, sales, support) didn't compress. I had a decade of operating experience and a successful product behind me before I started Honeydew. 2017-me wouldn't have shipped Honeydew even with 2026 tools, because I didn't know what to build."
  - q: "Will the $2,500 number stay this low?"
    a: "Probably not exactly. A meaningful share of that floor depends on AI tool pricing that's still VC-subsidized. Cursor and the model providers are all burning capital on inference. If subsidies normalize and effective prices climb 3 to 5×, my number goes to maybe $8 to $12K. The thesis survives. The headline tightens."
---

![$500,000 vs. $2,500 — what it cost to build the last product I shipped, and what it's cost to build the one I'm working on now](/images/research/momnpop-hero-cost-comparison.svg)

Between 2017 and 2022 I helped build **GiveTide**, a charitable giving platform. The team spent over **$500,000** shipping it. It sold to an acquirer five years in.

Since last year I've been working on **[Honeydew](https://gethoneydew.app)** in the evenings and weekends. It's an AI agent that runs families' lives. So far I've spent around **$2,500** out of pocket to build something more technically sophisticated than GiveTide ever was. About 80% of that went to the AI coding tools alone.

Same engineer, same instincts, five years apart. The math broke by about 200×. This post is me trying to explain why, from inside.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1400px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/research/momnpop-cost-timeline.svg" alt="Cumulative spend, both projects — GiveTide rose to $500K+ over five years; Honeydew sits at roughly $2,500" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

---

## What $500K bought in 2017

GiveTide was a fintech CRUD app under the hood. Payments, dashboards, auth, a mobile app, some compliance tooling. Nothing exotic.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1200px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/research/momnpop-stack-comparison.svg" alt="Where the money went — GiveTide vs Honeydew, by category" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

The half-million went to roughly four buckets. The biggest was engineers — a small team of contractors and full-time hires. Even at modest 2017 rates, two people working for six months is six figures, and we had more than two people across the five years. Then design and product work (Figma, brand, the slow polish of every screen). Then infrastructure (AWS, third-party APIs, payment-rail vendor fees, compliance and security spend). And then iteration cost. Every pivot meant rebuilding screens, redoing flows, re-shipping. The cost of being wrong was high, so we tried to be wrong less, which meant we shipped slowly.

Half a million wasn't extravagant for 2017. It was actually pretty lean for what we built. Most fintech startups in our cohort spent more.

The math worked because we raised. The reason we *had* to raise was that the math couldn't work any other way. The price of admission to "we have a real product" was six figures, minimum, and the only way to get six figures was equity from people who had it.

That last sentence is the one that's no longer true. Everything else in this post is the consequence.

---

## What $2,500 has bought so far

[Honeydew](https://gethoneydew.app) is a family AI agent I've been working on as a personal project. The agent has a name (Dew), a wide tool catalog, and a substantial system prompt. He adds eggs to your grocery list, schedules dentist appointments, notices when your kid's soccer game conflicts with dinner, and handles the conversational quirks of being asked things by tired parents at 9 PM.

By software complexity, Honeydew is harder than GiveTide was. There's an LLM agent in the loop, voice, tool orchestration across a multi-tenant family graph with a non-trivial permissioning model, and realtime sync requirements I never had at GiveTide. None of that existed at the older project. All of it works in Honeydew on roughly half a percent of the budget.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1600px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/posts/honeydew-architecture-2026.svg" alt="Honeydew's Dew agent pipeline — input parses through an LLM interpretation layer, hits a tool catalog, executes against the family graph, and writes back into per-family memory" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1600px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <video controls playsinline preload="metadata" poster="/videos/posts/momnpop/compiled-with-architecture-poster.jpg" style="width: 100%; height: auto; border-radius: 12px; display: block;">
    <source src="/videos/posts/momnpop/compiled-with-architecture.mp4" type="video/mp4">
    Your browser does not support embedded video. <a href="/videos/posts/momnpop/compiled-with-architecture.mp4">Download the demo</a>.
  </video>
  <p style="text-align: center; font-style: italic; color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.75rem;">Two demos against the pipeline above. First: from three hints and "add anything else we'd need," Dew builds a 23-item beach-trip packing list across 5 inferred sections. Second: a recurring event with a dependent reminder chain — the hard 20% of agent work.</p>
</div>

To date, my actual spend is around $2,500. The bucket breakdown is heavily lopsided. The AI coding tools (Cursor and Claude Code subscriptions, plus some occasional pay-as-you-go on top) are roughly 80% of total spend. Model API costs to OpenAI and Anthropic for what Dew actually runs on are maybe 15%. Infra (Vercel, the database, observability) is essentially nothing at this volume. Domains and other services are rounding error.

The team is one person. Me. Nights and weekends. I write product, I write code, I do support.

I'm not claiming any of this is sustainable forever or that I'll never need help. I'm describing what it cost to get from "idea" to "shipped product with real users." That's the same milestone GiveTide spent six figures to reach.

---

## What actually changed

The single biggest shift is AI coding tools used seriously. The magnitude is hard to convey unless you've lived through it. At GiveTide, building a settings screen with twelve fields, validation, and persistence was a one-to-two-day task for a junior engineer. With Cursor and Claude Code it's thirty minutes. That 50× compression doesn't apply to gnarly distributed-system bugs, but on the long tail of CRUD work that fills out a real product, it's closer to 100×. McKinsey's enterprise-cohort research puts the productivity gain at "over 110%" at high-adoption companies. At the solo-builder edge, with no coordination tax, the gain is higher.

The infrastructure floor also collapsed. What used to cost $5K a month in self-hosted infrastructure now runs on Vercel plus a managed database for under $50. Inference is the one line item that's still meaningful, but the rest of the stack is essentially free at solo-builder volume.

Model APIs let me skip building entire systems. GiveTide spent weeks on natural-language transaction categorization. Honeydew gets it for free from a fraction-of-a-cent LLM call. Whisper transcribes voice for cents per hour. Embedding APIs replace search systems I'd have built from scratch in 2017. The "build vs. buy" question used to take weeks of analysis. Now I just buy, and the bill barely registers.

Being wrong got cheaper too. In 2017 every screen had to be polished before anyone saw it because iteration was expensive. In 2026 I ship rough things, learn from the families actually using them, and then either delete or polish. I'm wrong cheaply more often, which means I learn faster, which is the actual game.

And there's the team thing, which sounds like a downside but isn't. The coordination tax of a real team (meetings, alignment, documentation, hiring) is large, and I've eliminated all of it. I move faster than I did at GiveTide, and a meaningful share of that is just not having to coordinate with anyone.

---

## What didn't change

The honest part. This is where the practitioner voice diverges from the hype.

Product judgment is still the hard thing. Knowing what to build, for whom, in what order — none of it got any cheaper. AI doesn't tell you which feature matters. The hours I spend talking to users, watching them actually use Honeydew, deciding what to fix next — those hours look identical to the ones I spent at GiveTide. The bottleneck moved from engineering to taste, and taste is the slow thing.

Distribution didn't get cheaper either. If anything it got harder. The same tools that let me build for $2,500 let everyone else build for $2,500. The market is louder, not quieter. Getting to the first hundred users is still a slog, and there's no AI tool that does it for me.

Support is also exactly what support always was. When a family's grocery list disappears at 7 AM on a Tuesday, an LLM doesn't fix it. I do. Reading every weird edge case, replying to every "Dew is being weird" report, debugging every non-deterministic failure. The AI didn't change any of that. If anything AI products are harder to support because the failure modes are stochastic and the user often can't articulate what went wrong.

And operational discipline still wins. The temptation, with cost dropping 200×, is to ship 200× more stuff. The right move is the opposite: ship the smallest possible thing well, and resist the urge to use the savings to add scope. I'm not always good at this. The cost collapse is real but it doesn't redistribute capability uniformly. It compresses one specific axis, the cost of materializing a working software system. The other axes stay the same shape they always were.

---

## A sanity check against the macro

I'd be writing this post even if my numbers were anomalous, but they're not.

Stripe's 2025 Atlas data (Atlas is their incorporation product, which now creates one in five Delaware C-corps) found that 20% of new startups charged a customer within 30 days of incorporation, up from 8% in 2020. The same cohort hit $100K in revenue 56% more often than the year before. Some of that's selection (Atlas markets to faster-moving founders), but even discounting for it, the underlying acceleration is real and meaningful.

A controlled GitHub Copilot trial showed developers completing tasks 55.8% faster than the control group. McKinsey's 2024 study put gains at 110%+ at companies with high developer adoption.

My GiveTide-to-Honeydew ratio is one practitioner data point, but it lands cleanly on the slope of those broader trends. I'm not the outlier. I'm the data showing up where the curve says it should be.

---

## What I'm not claiming

A few things this post is not arguing.

It's not "anyone can do it." The cost collapse is on the engineering line item. The other lines (taste, judgment, distribution, sales, support) didn't compress, and they're often the binding constraint. I had a decade of operating experience and a successful product behind me before I started Honeydew. 2017-me wouldn't have shipped this even with 2026 tools because I didn't yet know what to build.

It's not "VC is dead." It's that the threshold for needing VC moved. Some products still genuinely require capital. Capital-intensive ones, network-effects ones, regulated ones. But a much wider range of things that previously needed funding to ship now just don't. That's a different and narrower claim.

It's not stable forever. A meaningful share of my $2,500 depends on AI-tool pricing that's still VC-subsidized. If subsidies normalize and effective inference prices climb 3 to 5×, my number tightens. Maybe $8 to $12K instead of $2,500. The thesis survives. The headline tightens.

---

## What I think this means

For me personally, I'm building the kind of thing I couldn't have built before. [Honeydew](https://gethoneydew.app) doesn't need to be a unicorn or even a company to be a great thing to work on. It can serve a few thousand families well, get better every week, and be the thing I tinker on at night. That's a viable thing to do now in a way it wouldn't have been in 2017, when the only way to put a real product in front of real users was to raise money and aim for a $50M ARR outcome.

For the broader picture, I think a lot of people who like building things are about to figure this out. Some of them will start projects that look like Honeydew. Small, focused, owner-operated, sometimes profitable, sometimes just for fun. Not because they're chasing a trend, but because the math finally works.

That's the actual story of AI in software, in my opinion. Not the agents, not the unicorns, not the 10× engineer mythology. The price of admission to making real software dropped, and the kind of thing worth making changed with it.

Building software is more enjoyable than it's ever been. That's most of what this post is.

---

## Sources

- [Stripe Atlas Startups in 2025: Year in Review](https://stripe.com/blog/stripe-atlas-startups-in-2025-year-in-review)
- [The AI Revolution in Software Development — McKinsey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-ai-revolution-in-software-development)
- [Unleashing Developer Productivity with Generative AI — McKinsey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/unleashing-developer-productivity-with-generative-ai)
- [The Impact of AI on Developer Productivity: Evidence from GitHub Copilot (arXiv)](https://arxiv.org/abs/2302.06590)
- [I shipped a SaaS in 30 days as a solo dev — Indie Hackers](https://www.indiehackers.com/post/i-shipped-a-productivity-saas-in-30-days-as-a-solo-dev-heres-what-ai-actually-changed-and-what-it-didn-t-15c8876106)

---

## FAQ

**Q: Are you including the value of your own time in that $5K?**
No, and that's the biggest asterisk on the number. I've put in a lot of nights and weekends. If you valued my time at a senior PM rate, the all-in cost climbs by an order of magnitude. The $2,500 is *out-of-pocket cash* to materialize a working product. Same metric I'd use for GiveTide's $500K, which also wasn't counting people-hours. The comparison is apples to apples; it's just not the only number worth knowing.

**Q: Did you reuse code or IP from GiveTide?**
None. GiveTide was a charitable-giving fintech with payments rails and compliance tooling. Honeydew is a family AI agent. Zero overlap at the code or product layer. The reusable part was operational: knowing how to talk to users, how to triage bugs, how to ship without polishing forever. That part doesn't show up in the cost column but it absolutely shows up in the speed column.

**Q: What's the actual tech stack?**
React + TypeScript on the frontend, Node on the backend, a managed Postgres, Vercel for hosting, OpenAI and Anthropic for inference, Whisper for voice. The agent layer is custom — 27 tools wired into a single LLM-driven orchestration loop with per-family memory. Nothing exotic, which is part of the point. The cost compression doesn't come from clever architecture; it comes from not having to build the unsexy 80% by hand.

**Q: Has Honeydew made money yet?**
That's not what this post is about, and it's the right question to ask. Cheap to *build* and *worth keeping alive* are different problems. Honeydew has a few paying users and the unit economics work at small scale. It's a side project for me right now; whether it stays that way is a different question, and the honest answer is "I don't know yet."

**Q: If everyone can build this kind of thing now, doesn't it just commoditize software?**
Partly, yes. The supply curve of "decent software products" is going to shift right, and the average price of admission for users will drop. The things that survive won't be the ones shipped cheapest. They'll be the ones with the clearest taste, the best distribution, and the most patience. That's roughly what wins in every other commoditized creative market (writing, music, podcasts). Software is becoming one of those.
