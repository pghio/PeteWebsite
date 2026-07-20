---
layout: ../../layouts/BlogLayout.astro
title: "$500,000 vs. $2,500: I Built Two Things Five Years Apart"
description: "GiveTide spent more than $500,000 from 2017 through 2022. Honeydew's cash spend from its 2025 start through this post's May 2026 snapshot was about $2,500, excluding unpaid founder labor. The comparison is imperfect; the change in what one person can build is still real."
publishDate: "2026-05-03"
category: "Essay"
ogImage: "/images/research/momnpop-hero-cost-comparison.svg"
---

![$500,000 vs. $2,500 — what it cost to build the last product I shipped, and what it's cost to build the one I'm working on now](/images/research/momnpop-hero-cost-comparison.svg)

Between 2017 and 2022 I cofounded **GiveTide**, a charitable giving platform, and ran it as CEO. Over those five years, the company spent more than **$500,000** on payroll and contractors, design, infrastructure, compliance, and operations. It sold to an acquirer five years in.

Since 2025 I've been building **[Honeydew](https://gethoneydew.app)** on nights and weekends. It is a family-coordination assistant with an LLM agent, voice and photo input, calendar and list tools, permissions, and realtime sync. From the first line of code through this post's May 2026 snapshot, I spent around **$2,500** in cash to reach a working product in real families' hands.

Those are not equivalent accounting periods. GiveTide's number covers five years of running a company through acquisition. Honeydew's covers cash expenses through an early working-product milestone. It excludes my unpaid labor, and it says nothing about comparable revenue, user scale, compliance burden, or longevity. The headline ratio is therefore a roughly **200× difference in recorded cash**, not a controlled productivity measurement.

I am also not the same input five years later. I brought more product judgment, more technical fluency, and a long inventory of mistakes into Honeydew. The useful comparison is narrower: what did it cost me, in each era, to put a real software product into users' hands, and which parts of that cost changed?

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1400px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/research/momnpop-cost-timeline.svg" alt="Cumulative spend, both projects — GiveTide rose to $500K+ over five years; Honeydew sits at roughly $2,500" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

---

## GiveTide's cost structure

For the fintech product and team we chose to build, the price of admission was six figures. GiveTide was a CRUD app underneath — payments, dashboards, auth, a mobile app, and compliance tooling — but none of those parts was optional.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1200px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/research/momnpop-stack-comparison.svg" alt="Where the money went — GiveTide vs Honeydew, by category" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

The half-million went mostly to engineers — contractors and full-time hires over five years. The rest went to design, infrastructure, and the cost of being wrong: every pivot meant rebuilding screens and re-shipping, so we tried to be wrong less, which meant we shipped slowly.

The spend did not feel extravagant inside our company; it felt lean for the scope we had chosen. We could not fund it from our own cash or early revenue, so we raised equity.

Honeydew did not require me to make that financing decision before I could learn whether the product was useful.

---

## Honeydew's cash bill so far

[Honeydew](https://gethoneydew.app)'s agent has a name (Dew), a 60+ tool catalog, and a substantial system prompt. He adds eggs to your grocery list, schedules dentist appointments, notices when your kid's soccer game collides with dinner, and handles being asked things by tired parents at 9 PM.

Under the hood there is an LLM agent loop, voice input, tool orchestration across a multi-tenant family graph with real permissioning, and realtime sync — none of which existed at GiveTide. That gives Honeydew more unfamiliar moving parts than my earlier product had. It does not make it categorically harder: GiveTide carried payments, compliance, a larger organization, and five years of operating history that Honeydew has not yet earned.

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1600px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <img src="/images/posts/honeydew-architecture-2026.svg" alt="Honeydew's Dew agent pipeline — input parses through an LLM interpretation layer, hits a tool catalog, executes against the family graph, and writes back into per-family memory" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
</div>

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1400px; margin-top: 2.5rem; margin-bottom: 0.5rem;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
    <img src="/images/posts/honeydew-dew-voice-to-calendar.webp" alt="Dew turns a spoken request into a calendar event and catches the scheduling conflict before it lands, using the Realtime API" loading="lazy" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
    <img src="/images/posts/honeydew-dew-photo-to-list.webp" alt="Dew reads a photo into a structured list, interpreting it semantically instead of as flat OCR text" loading="lazy" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
    <img src="/images/posts/honeydew-dew-semantic-cache.webp" alt="A semantic cache recognizes when a request matches one Dew already handled and skips the model, cutting repeat LLM calls" loading="lazy" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
  </div>
</div>
<p style="text-align: center; font-style: italic; color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.75rem; margin-bottom: 1rem;">Three of Dew's moves up close: voice to calendar, photo to list, and a semantic cache that skips repeat work to keep inference cheap.</p>

<div style="position: relative; left: 50%; right: 50%; margin-left: -47vw; margin-right: -47vw; width: 94vw; max-width: 1600px; margin-top: 2.5rem; margin-bottom: 1rem;">
  <video controls playsinline preload="metadata" poster="/videos/posts/momnpop/compiled-with-architecture-poster.jpg" style="width: 100%; height: auto; border-radius: 12px; display: block;">
    <source src="/videos/posts/momnpop/compiled-with-architecture.mp4" type="video/mp4">
    Your browser does not support embedded video. <a href="/videos/posts/momnpop/compiled-with-architecture.mp4">Download the demo</a>.
  </video>
  <p style="text-align: center; font-style: italic; color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.75rem;">Two demos against the pipeline above. First: one plain-language message — plan the party, order the cake, build a prep list, share it with a co-parent, remind me to send invites — fans out into two calendar events, a six-item shared list, and a reminder in a single pass. Second: a recurring taco night with a dependent thaw-the-meat reminder, the weekly recurrence expanded into a real event series — the hard 20% of agent work.</p>
</div>

About 80% of the $2,500 went to AI coding tools (Cursor and Claude Code), maybe 15% to model APIs for what Dew runs on, and a rounding error to hosting and domains. The team is one person, me, on nights and weekends. Those nights and weekends are a real cost; they are simply not a cash expense in the headline.

The closest comparable milestone is "working product in real users' hands." Even there, the comparison is directional: the products reached that point with different requirements, different founder experience, and different expectations of polish and scale.

---

## Five changes behind the gap

**AI coding tools, used seriously.** At GiveTide, a twelve-field settings screen with validation was a one-to-two-day task for a junior engineer. With Cursor and Claude Code, a comparable first pass can take me about thirty minutes. Using eight-hour workdays, that narrow task is roughly **16–32× faster**. It is an anecdote, not a general benchmark, and the ratio collapses on distributed-systems bugs or ambiguous product work.

**The infrastructure floor collapsed for my current scale.** GiveTide's early architecture carried a monthly infrastructure budget around $5,000. Honeydew's current, much smaller workload runs on Vercel and a managed database for under $50 before meaningful inference spend. That is not a like-for-like traffic or compliance comparison; it is the bill I faced at each product's early working stage.

**Model APIs replaced separate implementation projects.** GiveTide spent weeks building natural-language transaction categorization. Honeydew can get similar interpretation from a fraction-of-a-cent LLM call. Transcription, OCR, and embedding search would each have required custom work or a dedicated vendor in 2017; now they arrive behind APIs.

**Being wrong got cheaper.** At GiveTide, we treated every screen as something that needed substantial polish before anyone saw it because rebuilding and reshipping were expensive. Now I can put a rough workflow in front of a few families, learn, and delete or polish it from there.

**No coordination tax.** The meetings, alignment, documentation, and hiring overhead of a real team is large. Solo, I've eliminated all of it. A meaningful share of my speed is just not coordinating with anyone.

The broader evidence supports the direction, not my 200× headline. A controlled GitHub Copilot trial found participants completed one JavaScript HTTP-server task **55.8% faster**. McKinsey reports that the top-performing companies in its sample achieved **16–30% improvements** in productivity, time to market, and customer experience, plus **31–45% gains** in software quality. Stripe reports that **20%** of its 2025 Atlas cohort charged a first customer within 30 days, up from **8%** in 2020. None of those findings validates my cash ratio; they show that software work and startup time-to-revenue are compressing in other settings too.

---

## The costs that did not compress

**Product judgment remains my hard part.** Knowing what to build, for whom, and in what order did not get cheaper. AI does not settle which feature matters. The hours I spend watching people actually use Honeydew look identical to the ones I spent at GiveTide.

**Distribution has felt harder, not easier.** The same tools that lowered my build cost lowered it for other founders too, and the market is louder. Getting to the first hundred users is still a slog, and no AI tool does it for me.

**Support remains stubbornly manual.** When a family's grocery list vanishes at 7 AM, an LLM does not fix it — I do. AI products can be harder to support because the failure modes are stochastic and users cannot always say what went wrong.

**Discipline still matters.** Cheap iteration makes it easy for me to spend the savings on scope. I try to use it instead to ship the smallest useful thing, watch what happens, and remove what does not earn its place.

---

## Limits of the comparison

**This is not a productivity study.** It is a comparison of two founder-visible cash ledgers at different stages. It excludes my unpaid Honeydew labor and does not control for product scope, traffic, regulation, team experience, revenue, or years in market.

**It is not "anyone can do this."** The largest compression I experienced was in engineering cash cost. Taste, judgment, distribution, and support did not compress nearly as much. My earlier self would not have shipped Honeydew even with today's tools because I had years less experience learning what to build and how to cut scope.

**It is not "VC is dead."** The threshold for *needing* VC moved for products like mine. Capital-intensive, network-effects, and regulated products still need it; some smaller software products can now reach users before making that financing decision.

**It is not stable forever.** Most of my $2,500 rides on AI coding and model-tool pricing that may be subsidized or temporary. If that combined tool bill rose 3–5× without any offsetting price declines, the cash total would move to about $7,000–$12,000. The direction of the comparison would survive; the headline would tighten.

---

## Why cheaper software changes what is worth building

For me, [Honeydew](https://gethoneydew.app) does not need to be a unicorn to justify the work. It can serve a few thousand families well, improve steadily, and remain something I tinker on at night. I did not see that as a viable path for GiveTide: our cost structure pushed us toward outside capital and the outcome that capital required.

I expect more builders to choose small, focused, owner-operated projects because lower upfront cash requirements make that path available to them.

To me, the important AI story in software is not the mythology about agents, unicorns, or 10× engineers. My cash cost of putting real software in front of users fell dramatically, and that changed which projects I could rationally choose to make.

Building software is more fun than it's ever been. That's most of what this post is.

---

## Sources

- [Stripe Atlas Startups in 2025: Year in Review](https://stripe.com/blog/stripe-atlas-startups-in-2025-year-in-review)
- [The AI Revolution in Software Development — McKinsey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-ai-revolution-in-software-development)
- [The Impact of AI on Developer Productivity: Evidence from GitHub Copilot (arXiv)](https://arxiv.org/abs/2302.06590)
