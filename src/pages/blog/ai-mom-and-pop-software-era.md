---
layout: ../../layouts/BlogLayout.astro
title: "$500,000 vs. $2,500: I Built Two Things Five Years Apart"
description: "The last product I helped ship cost half a million dollars to build. The thing I'm hacking on now has cost around $2,500. Same engineer, five years apart. Here's what actually changed."
publishDate: "2026-05-03"
category: "Essay"
ogImage: "/images/research/momnpop-hero-cost-comparison.svg"
---

![$500,000 vs. $2,500 — what it cost to build the last product I shipped, and what it's cost to build the one I'm working on now](/images/research/momnpop-hero-cost-comparison.svg)

Between 2017 and 2022 I helped build **GiveTide**, a charitable giving platform. The team spent over **$500,000** shipping it. It sold to an acquirer five years in.

Since last year I've been building **[Honeydew](https://gethoneydew.app)** on nights and weekends. It's an AI agent that runs families' lives. So far it's cost me around **$2,500** out of pocket — to build something more technically sophisticated than GiveTide ever was.

Same engineer. Same instincts. Five years apart. The math broke by about **200×**. Here's why, from the inside.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1400px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/research/momnpop-cost-timeline.svg" alt="Cumulative spend, both projects — GiveTide rose to $500K+ over five years; Honeydew sits at roughly $2,500" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

---

## What $500K bought in 2017

**The price of admission to a real product used to be six figures. That's the whole story.**

GiveTide was a fintech CRUD app underneath — payments, dashboards, auth, a mobile app, some compliance tooling. Nothing exotic.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1200px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/research/momnpop-stack-comparison.svg" alt="Where the money went — GiveTide vs Honeydew, by category" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

The half-million went mostly to engineers — contractors and full-time hires over five years. The rest went to design, infrastructure, and the cost of being wrong: every pivot meant rebuilding screens and re-shipping, so we tried to be wrong less, which meant we shipped slowly.

That number wasn't extravagant. It was lean for 2017. And it's why we had to raise — the only way to get six figures was equity from people who had it.

**That last part is the thing that's no longer true.** Everything below is the consequence.

---

## What $2,500 has bought so far

**Honeydew is harder to build than GiveTide was. It runs on half a percent of the budget.**

[Honeydew](https://gethoneydew.app)'s agent has a name (Dew), a 60+ tool catalog, and a substantial system prompt. He adds eggs to your grocery list, schedules dentist appointments, notices when your kid's soccer game collides with dinner, and handles being asked things by tired parents at 9 PM.

Under the hood there's an LLM agent loop, voice, tool orchestration across a multi-tenant family graph with real permissioning, and realtime sync — none of which existed at GiveTide.

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

**Where the $2,500 actually went:** about 80% to AI coding tools (Cursor and Claude Code), maybe 15% to model APIs for what Dew runs on, and a rounding error to hosting and domains. The team is one person, me, on nights and weekends.

That's the out-of-pocket cost to get from "idea" to "shipped product with real users" — the same milestone GiveTide spent six figures to reach.

---

## What actually changed

**Five things, in order of how much they mattered.**

**AI coding tools, used seriously.** At GiveTide, a twelve-field settings screen with validation was a one-to-two-day task for a junior engineer. With Cursor and Claude Code it's thirty minutes. That 50× doesn't hold for gnarly distributed-systems bugs, but on the long tail of CRUD that fills out a real product, it's closer to 100×.

**The infrastructure floor collapsed.** What used to cost $5K a month self-hosted now runs on Vercel plus a managed database for under $50. Inference is the only line item that still registers.

**Model APIs replaced whole systems.** GiveTide spent weeks building natural-language transaction categorization. Honeydew gets it from a fraction-of-a-cent LLM call. Transcription, OCR, embedding search — all things I'd have built from scratch in 2017, now an API call.

**Being wrong got cheap.** In 2017 every screen had to be polished before anyone saw it, because iterating was expensive. Now I ship rough things, learn from the families using them, and delete or polish from there. Being wrong cheaply is the actual game.

**No coordination tax.** The meetings, alignment, documentation, and hiring overhead of a real team is large. Solo, I've eliminated all of it. A meaningful share of my speed is just not coordinating with anyone.

For what it's worth, this isn't just me. A controlled GitHub Copilot trial showed developers finishing tasks ~56% faster; McKinsey put gains at 110%+ at high-adoption companies; Stripe's 2025 Atlas data shows new startups charging customers far sooner than they did in 2020. My GiveTide-to-Honeydew ratio lands right on that slope.

---

## What didn't change

**The bottleneck moved from engineering to taste. Taste is the slow thing.**

**Product judgment is still the hard part.** Knowing what to build, for whom, in what order — none of it got cheaper. AI doesn't tell you which feature matters. The hours I spend watching people actually use Honeydew look identical to the ones I spent at GiveTide.

**Distribution got harder, not easier.** The same tools that let me build for $2,500 let everyone build for $2,500. The market is louder now. Getting to the first hundred users is still a slog, and no AI tool does it for me.

**Support is exactly what it always was.** When a family's grocery list vanishes at 7 AM, an LLM doesn't fix it — I do. AI products are arguably harder to support, because the failure modes are stochastic and users can't always say what went wrong.

**Discipline still wins.** The temptation, with cost down 200×, is to ship 200× more. The right move is the opposite: ship the smallest thing well, and resist spending the savings on scope.

---

## What I'm not claiming

**It's not "anyone can do this."** The collapse is on the engineering line item. Taste, judgment, distribution, and support didn't compress, and they're usually the binding constraint. 2017-me wouldn't have shipped Honeydew even with 2026 tools, because I didn't yet know what to build.

**It's not "VC is dead."** The threshold for *needing* VC moved. Capital-intensive, network-effects, and regulated products still need it. A much wider range of things that used to need funding just don't anymore.

**It's not stable forever.** A good chunk of my $2,500 rides on AI-tool pricing that's still VC-subsidized. If inference prices climb 3-5×, the number becomes maybe $8-12K. The thesis survives; the headline tightens.

---

## What I think this means

**The kind of thing worth making changed.** [Honeydew](https://gethoneydew.app) doesn't need to be a unicorn, or even a company, to be worth building. It can serve a few thousand families well, get better every week, and be the thing I tinker on at night. That wasn't a viable path in 2017, when the only way to put a real product in front of real users was to raise money and aim for a $50M outcome.

A lot of people who like building things are about to figure this out. Small, focused, owner-operated projects — not because they're chasing a trend, but because the math finally works.

That's the real story of AI in software, to me. Not the agents or the unicorns or the 10× engineer mythology. The price of admission to making real software dropped, and the kind of thing worth making changed with it.

Building software is more fun than it's ever been. That's most of what this post is.

---

## Sources

- [Stripe Atlas Startups in 2025: Year in Review](https://stripe.com/blog/stripe-atlas-startups-in-2025-year-in-review)
- [The AI Revolution in Software Development — McKinsey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-ai-revolution-in-software-development)
- [The Impact of AI on Developer Productivity: Evidence from GitHub Copilot (arXiv)](https://arxiv.org/abs/2302.06590)
