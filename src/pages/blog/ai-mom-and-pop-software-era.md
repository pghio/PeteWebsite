---
layout: ../../layouts/BlogLayout.astro
title: "$500,000 vs. $5,000: I Built Two Startups Five Years Apart"
description: "GiveTide cost over half a million dollars to build. Honeydew has cost under five thousand. Same founder, different era. Here's what actually changed — and what didn't."
publishDate: "2026-05-03"
category: "Essay"
ogImage: "/images/research/momnpop-hero-cost-comparison.svg"
faq:
  - q: "Is this 100× cost reduction real, or marketing?"
    a: "It's real, for me, on this comparison. GiveTide was a charitable giving platform built between 2017 and 2022 with a small team and over $500K of all-in spend. Honeydew (gethoneydew.app) is a family AI agent I've been building since 2025 for under $5K out of pocket. Honeydew is technically more sophisticated than GiveTide was. The 100× number is a clean expression of what changed at the engineering layer — it does not mean every solo builder gets the same result, and it does not include the value of my own time."
  - q: "What actually changed between 2017 and 2026?"
    a: "Five things, in roughly the order they mattered: (1) AI coding tools — Cursor and Claude Code compress CRUD work by 50–100×; (2) the infra floor dropped — what was $5K/month is now $50; (3) model APIs let me skip building entire systems (categorization, transcription, search); (4) the cost of being wrong fell, so I iterate cheaply instead of polishing; (5) no team means no coordination tax."
  - q: "What didn't change?"
    a: "Product judgment. Distribution. Support. Operational discipline. Knowing what to build, getting people to use it, and answering them when it breaks at 7 AM are the same hard problems they were in 2017. The AI didn't compress those, and they're often the binding constraint."
  - q: "Does this mean anyone can build a software business now?"
    a: "No. The 100× cost collapse is one specific axis — materializing a working software system. The other axes (taste, judgment, distribution, sales, support) didn't compress. I had a decade of operating experience, including five years and a successful exit at GiveTide, before I started Honeydew. I don't think 2017-me would have shipped Honeydew even with 2026 tools, because I didn't know what to build."
  - q: "Will the $5K number stay this low?"
    a: "Probably not exactly. A meaningful share of today's cost floor depends on AI tool pricing that's still VC-subsidized. Cursor, Lovable, and the model providers are all burning capital on inference. If subsidies normalize and effective prices climb 3-5×, my number goes up — call it $15-25K instead of $5K. The thesis survives. The headline tightens."
---

![$500,000 vs. $5,000 — what I spent on my last startup, and what I've spent on the next one](/images/research/momnpop-hero-cost-comparison.svg)

Between 2017 and 2022, I co-founded **GiveTide**, a charitable giving platform. We spent over **$500,000** building it. Five years later it sold to an acquirer.

In 2025 I started building **[Honeydew](https://gethoneydew.app)**, an AI agent that runs families' lives. So far I've spent **under $5,000** to ship something more technically sophisticated than what GiveTide ever was.

Same founder. Same engineering instincts. Roughly **100× cost differential**.

This post is what changed, what didn't, and what I think it actually means — not the hyped version, the practitioner version.

---

## What $500K Bought in 2017

GiveTide was a charitable giving platform. By software complexity, it was straightforward: CRUD, payments, dashboards, auth, a mobile app, some compliance tooling. Nothing exotic.

The half-million-plus went to roughly:

![Where the money went — GiveTide vs Honeydew, by category](/images/research/momnpop-stack-comparison.svg)

- **Engineers** — a small team of contractors and full-time hires. Even at modest 2017 rates, two people working for six months is six figures, and we had more than two people across the five years.
- **Design and product work** — Figma, brand, UX iterations, the slow polish of every screen.
- **Infrastructure** — AWS, third-party APIs, payment-rail vendor fees, compliance and security spend.
- **Iteration cost** — every pivot meant rebuilding screens, re-doing flows, re-shipping. The cost of being wrong was high, so we tried to be wrong less, which meant we shipped slowly.

Half a million plus wasn't extravagant for 2017. It was actually pretty lean for what we built. Most fintech startups in our cohort spent more.

The math worked because we raised. The reason we *had* to raise was that the math couldn't work any other way. The price of admission to "you have a product worth selling" was six figures, minimum, and the only way to get six figures was to give equity to people who had it.

That sentence is the one that's no longer true. Everything else in this post is the consequence.

---

## What $5K Has Bought So Far

[Honeydew](https://gethoneydew.app) is a family AI agent. He has a name (Dew), a wide tool catalog, and a substantial system prompt. He adds eggs to your grocery list, schedules dentist appointments, notices when your kid's soccer game conflicts with dinner, and handles the conversational quirks of being asked things by tired parents at 9 PM.

By software complexity, this is **harder than GiveTide was**. There's an LLM-driven agent in the loop. There's voice. There's tool orchestration. There's a multi-tenant family graph with a non-trivial permissioning model. There are realtime sync requirements I never had at GiveTide.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1600px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/posts/honeydew-architecture-2026.svg" alt="Honeydew's Dew agent pipeline — input parses through an LLM interpretation layer, hits a tool catalog, executes against the family graph, and writes back into per-family memory" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1600px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <video controls playsinline preload="metadata" poster="/videos/posts/momnpop/compiled-with-architecture-poster.jpg" style="width: 100%; height: auto; border-radius: 12px; display: block;">
    <source src="/videos/posts/momnpop/compiled-with-architecture.mp4" type="video/mp4">
    Your browser does not support embedded video. <a href="/videos/posts/momnpop/compiled-with-architecture.mp4">Download the demo</a>.
  </video>
  <p style="text-align: center; font-style: italic; color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.75rem;">Two demos, each mapped to a stage of the pipeline above. First: a list mutation. Second: recurring + conflict detection — the hard 20% of agent work.</p>
</div>

To date, my actual spend is under $5,000. Roughly:

- **AI coding tools** (Cursor + Claude Code subscriptions): the largest line item by a small margin
- **Model API costs** (OpenAI, Anthropic): comparable to the coding tools
- **Infra** (Vercel, database, observability): essentially nothing at this volume
- **Domains, services, misc**: rounding error

The team is one person. Me. I write product, I write code, I run support.

I'm not claiming this is sustainable forever, or that I'll never need to hire. I'm describing what it cost to get from "idea" to "shipped product with users" — the same milestone GiveTide spent six figures to reach.

---

## What Actually Changed

A few specific things, in roughly the order they mattered:

**1. AI coding tools, used seriously.** This is the obvious one but the magnitude is hard to convey unless you've lived it. At GiveTide, "build a settings screen with twelve fields, validation, and persistence" was a one-to-two-day task for a junior engineer. With Cursor and Claude Code, it's thirty minutes. The 50× compression doesn't apply to every task — gnarly distributed-system bugs are still gnarly — but on the long tail of CRUD work that fills out a real product, it's closer to 100×. McKinsey's enterprise-cohort research puts the productivity gain at "over 110%" at high-adoption companies; at the solo-builder edge, with no coordination tax, the gain is higher.

**2. The infrastructure floor dropped.** What used to cost $5K/month in self-hosted infrastructure now runs on Vercel plus a managed database for under $50. Inference is the one line item that's still meaningful, but the rest of the stack is essentially free at solo-builder volume.

**3. Model APIs let me skip entire systems.** GiveTide spent weeks on natural-language transaction categorization. Honeydew gets that for free from a fraction-of-a-cent LLM call. Whisper transcribes voice at scale for cents per hour. Embedding APIs replace search systems I'd have built from scratch in 2017. The "build vs. buy" question used to take weeks of analysis. Now I just buy, and the bill barely registers.

**4. The cost of being wrong dropped.** In 2017, every screen had to be polished before anyone saw it because iteration was expensive. In 2026, I ship rough things, learn from the families using them, then either delete or polish. I am wrong cheaply more often, which means I learn faster, which is the actual game.

**5. I do not have a team.** This sounds like a downside. It's a major reason the cost is low, and not just because I'm not paying salaries. The coordination tax of a team — meetings, alignment, documentation, hiring — is real, and I've eliminated it. I move faster than I did at GiveTide, and a meaningful share of that is *not* having to coordinate.

---

## What Didn't Change

The honest part. This is where the practitioner voice diverges from the hype.

**Product judgment is still the hard thing.** Knowing what to build, for whom, in what order — none of that got cheaper. AI does not tell you which feature matters. The hours I spend talking to users, watching them use Honeydew, deciding what to fix next — those hours look identical to the ones I spent at GiveTide. The bottleneck moved from engineering to taste, and taste is the slow thing.

**Distribution didn't get cheaper.** If anything, it got harder. The same AI tools that let me build for $5K let everyone else build for $5K. The market is louder. Getting to the first hundred users is still a slog, and there's no AI tool that does it for me.

**Support is still support.** When a family's grocery list disappears at 7 AM on a Tuesday, an LLM doesn't fix that. I do. Reading every weird edge case, replying to every "Dew is being weird" report, debugging every non-deterministic failure — the AI didn't change that. If anything, AI products are *harder* to support, because the failure modes are stochastic and the user can't always articulate what went wrong.

**Operational discipline still wins.** The temptation, with cost dropping 100×, is to ship 100× more stuff. The right move is the opposite: ship the smallest possible thing well, and resist the urge to use the savings to add scope. I am not always good at this. The cost collapse is real, but it doesn't redistribute capability uniformly. It compresses *one specific axis* — the cost of materializing a working software system. The other axes stay the same shape.

---

## Sanity-Check Against the Macro Data

I'd be writing this even if my numbers were anomalous. They're not.

Stripe's 2025 Atlas data — Atlas is their incorporation product, which now creates one in five Delaware C-corps — found that **20% of new startups charged a customer within 30 days of incorporation, up from 8% in 2020**. The same cohort hit $100K in revenue 56% more often than the year before. Some of that's selection (Atlas markets to faster-moving founders), but even discounting for it, the underlying acceleration is meaningful.

A controlled GitHub Copilot trial showed developers completing tasks **55.8% faster** than the control group. McKinsey's 2024 study put gains at **110%+** at companies with high developer adoption.

My GiveTide-to-Honeydew ratio is one practitioner data point. It happens to land cleanly on the slope of those broader trends. I'm not the outlier; I'm the data showing up where the curve says it should be.

---

## What I Don't Want to Claim

A few things this post is **not** arguing:

- **It's not "anyone can do it."** The 100× cost collapse is the engineering line item. The other lines — taste, judgment, distribution, sales, support — didn't compress, and they're often the binding constraint. I had a decade of operating experience and a successful exit before I started Honeydew. I do not think 2017-me would have shipped Honeydew even with 2026 tools, because I didn't yet know what to build.

- **It's not "VC is dead."** It's that the *threshold* for needing VC moved. Some businesses still genuinely require capital — capital-intensive ones, network-effects ones, regulated ones. But a much wider range of products that previously needed VC funding to ship now don't. That's a different and narrower claim.

- **It's not stable forever.** A meaningful share of my $5K depends on AI-tool pricing that's still VC-subsidized. If subsidies normalize and effective inference prices climb 3-5×, my number tightens — maybe to $15-25K. The thesis survives, the headline doesn't.

---

## What I Think This Means

For me, personally: I am building the kind of business I couldn't have built before. [Honeydew](https://gethoneydew.app) doesn't need to be a unicorn to be a great life. It needs to serve a few thousand families well, charge a fair price, and be the thing I work on. That is a viable plan now in a way it would not have been in 2017, when "viable plan" had to be "raise $2M and aim for $50M ARR or die trying."

For the broader market: I think a lot of operators are about to make the same realization I have. Some of them will start companies that look like Honeydew — small, focused, owner-operated, profitable from year one. Not because they're following a trend, but because the math finally works.

That is the real story of AI in software, in my opinion. Not the agents, not the unicorns, not the 10× engineer mythology. Just: the price of admission dropped, and the kind of business worth building changed.

I am not going to make the same mistake I made in 2017. I am not building for the exit. I am building for the work.

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
No, and that's the biggest asterisk on the number. I've put in a lot of nights and weekends. If you valued my time at a senior PM rate, the all-in cost climbs by an order of magnitude. The $5K is *out-of-pocket cash* to materialize a working product — same metric I'd use for GiveTide's $500K, which also wasn't counting founder time. The comparison is apples to apples; it's just not the only number worth knowing.

**Q: Did you reuse code or IP from GiveTide?**
None. GiveTide was a charitable-giving fintech with payments rails and compliance tooling. Honeydew is a family AI agent. Zero overlap at the code or product layer. The reusable part was operational: knowing how to talk to users, how to triage bugs, how to ship without polishing forever. That part doesn't show up in the cost column but it absolutely shows up in the speed column.

**Q: What's the actual tech stack?**
React + TypeScript on the frontend, Node on the backend, a managed Postgres, Vercel for hosting, OpenAI and Anthropic for inference, Whisper for voice. The agent layer is custom — 27 tools wired into a single LLM-driven orchestration loop with per-family memory. Nothing exotic, which is part of the point. The cost compression doesn't come from clever architecture; it comes from not having to build the unsexy 80% by hand.

**Q: Has Honeydew made money yet?**
That's not what this post is about, and it's the right question to ask. Cheap to *build* and *sustainable as a business* are different problems. Honeydew has paying users and the unit economics work at small scale. Whether it grows into something that pays my mortgage is a different essay — and the honest answer is "I don't know yet, ask me in a year."

**Q: If everyone can do this now, doesn't it just commoditize software businesses?**
Partly, yes. The supply curve of "decent software products" is going to shift right, and the average price of admission for users will drop. The winners won't be the ones who shipped cheapest — they'll be the ones with the clearest taste, the best distribution, and the most patience. That's roughly what wins in every other commoditized creative market (writing, music, podcasts). Software is becoming one of those.
