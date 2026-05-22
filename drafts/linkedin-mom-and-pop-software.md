# I Spent $500K on My Last Startup. The New One Cost $5K.
*LinkedIn version — concise. Suggested hero: native video (compiled demos + architecture overlay). Fallback hero: `/images/research/momnpop-hero-cost-comparison.svg`*

---

I spent over **$500,000** building my last startup.

I've spent under **$5,000** building the next one.

Same founder. Same engineering instincts. Five years between them.

Between 2017 and 2022 I co-founded **GiveTide**, a charitable giving platform. Five years in, we sold to an acquirer. In 2025 I started **Honeydew** (gethoneydew.app) — an AI agent that runs families' lives. By software complexity it's *harder* than GiveTide was: an LLM agent in the loop, voice, tool orchestration across a multi-tenant family graph, realtime sync. Roughly **100× cost differential**.

▼ Demo and stack diagram in the video above. Here's what actually changed — and what didn't.

---

**What changed:**

→ **AI coding tools, used seriously.** A settings screen with twelve fields and validation used to be a one-to-two-day task for a junior engineer. With Cursor and Claude Code, it's thirty minutes.

→ **The infra floor dropped.** What was $5K/month in self-hosted infrastructure now runs on Vercel + a managed database for under $50.

→ **Model APIs let me skip entire systems.** GiveTide spent weeks on natural-language transaction categorization. Honeydew gets that for a fraction of a cent per call.

→ **The cost of being wrong dropped.** I ship rough things, learn from the families using them, then either delete or polish. I'm wrong cheaply more often, which means I learn faster.

→ **No team means no coordination tax.** Eliminating meetings, alignment overhead, and hiring is itself a major cost reduction. People underrate this one.

---

**What didn't change:**

→ **Product judgment is still the hard thing.** AI doesn't tell you which feature matters. The hours I spend talking to users look identical to the ones I spent at GiveTide.

→ **Distribution didn't get cheaper.** The same tools that let me build for $5K let everyone else build for $5K. The market is louder, not quieter.

→ **Support is still support.** AI products are arguably *harder* to support — failure modes are stochastic and users can't always articulate what went wrong.

→ **Operational discipline still wins.** The temptation, with cost dropping 100×, is to ship 100× more stuff. The right move is the opposite.

The cost collapse compresses *one specific axis* — the cost of materializing a working software system. The other axes stay the same shape. They're often the binding constraint.

---

**What I'm not claiming:**

This isn't "anyone can do it." I had a decade of operating experience and a successful exit before I started Honeydew. 2017-me wouldn't have shipped Honeydew even with 2026 tools, because I didn't know what to build.

This isn't "VC is dead." It's that the *threshold* for needing VC moved. Some businesses still need capital. A much wider range that previously did, now don't.

This isn't stable forever. A meaningful share of my $5K depends on AI-tool pricing that's still VC-subsidized. If those subsidies normalize, my number climbs — maybe to $15-25K. The thesis survives. The headline tightens.

---

For me, personally: I am building the kind of business I couldn't have built before. Honeydew (gethoneydew.app) doesn't need to be a unicorn to be a great life. It needs to serve a few thousand families well, charge a fair price, and be the thing I work on.

That is a viable plan now in a way it wasn't in 2017, when "viable plan" had to be "raise $2M and aim for $50M ARR or die trying."

I'm not going to make the same mistake I made in 2017. I'm not building for the exit. I'm building for the work.

---

*Full breakdown with charts and sources →* `[link to peterghiorse.com/blog/ai-mom-and-pop-software-era]`

---

## Notes for posting

- **Headline (locked):** "I Spent $500K on My Last Startup. The New One Cost $5K." *(used as the post's opening line — LinkedIn doesn't have a title field for native posts; the first lines do the work)*
- **Hashtags:** `#BuildInPublic #IndieHackers #AI` — three only. Restraint signals seriousness.
- **First-comment hook** (LinkedIn rewards a strong follow-up comment): *"The honest part: the 100× collapse is on the engineering line. Distribution, support, and product judgment didn't get any cheaper. Those are still 90% of the work."*
- **Hero asset:** native video — compiled 30–45s clip stitching two Honeydew demos with a persistent architecture-diagram strip showing which stage of the pipeline is firing. See `public/videos/posts/momnpop/compiled-with-architecture.mp4`.
- **Fallback hero** (if video doesn't render or for the LinkedIn article rehash): `/images/research/momnpop-hero-cost-comparison.svg`.
- **Pre-fold hook check:** first three lines must be readable before LinkedIn's "see more" — currently ~163 characters across three short paragraphs. Verified mobile-readable.
- **Publish order:** push the blog deep-dive live at `peterghiorse.com/blog/ai-mom-and-pop-software-era` first, then post on LinkedIn. The CTA must resolve.
- **Post time:** Tuesday 7–9 AM ET. Founder/builder content peaks then.
- **Word count:** ~530 words after tightening. Cuttable: drop "What I'm not claiming" if you want it under 400 — leaves the post sharper but less defensible against "this is hype" replies.
- **Why this works:** the GiveTide → Honeydew comparison is something only you can write. Generic AI commentary gets scrolled. Practitioner data with skin in the game, with proof on screen, gets shared.
