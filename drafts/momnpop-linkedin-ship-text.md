# LinkedIn Post — Ship Text

> Paste the contents between the `=== POST ===` markers directly into the LinkedIn composer.
> LinkedIn strips markdown — text below is plain, with → arrows and ALL CAPS as the only emphasis.
> Char limit: 3,000. Current count: 2,887 (113 chars of headroom).

---

## Asset attachment order

1. **Native video:** `public/videos/posts/momnpop/compiled-with-architecture.mp4` (1080×1920 vertical, 30–45s)
2. **Poster frame:** `public/videos/posts/momnpop/compiled-with-architecture-poster.jpg` (uploaded as the video thumbnail)

If video isn't ready and you need to ship the cost-comparison angle alone, fall back to: `public/images/research/momnpop-hero-cost-comparison.svg` as a single image.

---

=== POST ===

I spent over $500,000 building my last startup.

I've spent under $5,000 building the next one.

Same founder. Same engineering instincts. Five years between them.

Between 2017 and 2022 I co-founded GiveTide, a charitable giving platform. Five years in, we sold to an acquirer. In 2025 I started Honeydew (gethoneydew.app) — an AI agent that runs families' lives. By software complexity it's harder than GiveTide was: an LLM agent in the loop, voice, tool orchestration across a multi-tenant family graph, realtime sync. Roughly 100× cost differential.

▼ Demo and stack diagram in the video above. Here's what actually changed — and what didn't.

WHAT CHANGED

→ AI coding tools, used seriously. A settings screen with twelve fields and validation used to be a one-to-two-day task for a junior engineer. With Cursor and Claude Code, it's thirty minutes.

→ The infra floor dropped. What was $5K/month in self-hosted infrastructure now runs on Vercel + a managed database for under $50.

→ Model APIs let me skip entire systems. GiveTide spent weeks on natural-language transaction categorization. Honeydew gets that for a fraction of a cent per call.

→ The cost of being wrong dropped. I ship rough things, learn from the families using them, then either delete or polish. I'm wrong cheaply more often, which means I learn faster.

→ No team means no coordination tax. Eliminating meetings, alignment overhead, and hiring is itself a major cost reduction. People underrate this one.

WHAT DIDN'T CHANGE

→ Product judgment is still the hard thing. AI doesn't tell you which feature matters. The hours I spend talking to users look identical to the ones I spent at GiveTide.

→ Distribution didn't get cheaper. The same tools that let me build for $5K let everyone else build for $5K. The market is louder, not quieter.

→ Support is still support. AI products are arguably harder to support — failure modes are stochastic and users can't always articulate what went wrong.

→ Operational discipline still wins. The temptation, with cost dropping 100×, is to ship 100× more stuff. The right move is the opposite.

The cost collapse compresses one specific axis — the cost of materializing a working software system. The other axes stay the same shape. They're often the binding constraint.

WHAT I'M NOT CLAIMING

This isn't "anyone can do it." I had a decade of operating experience and a successful exit before I started Honeydew.

This isn't "VC is dead." It's that the threshold for needing VC moved.

This isn't stable forever. A meaningful share of my $5K depends on AI-tool pricing that's still VC-subsidized. If those subsidies normalize, my number climbs.

I'm not building for the exit. I'm building for the work.

Full breakdown with charts and sources → peterghiorse.com/blog/ai-mom-and-pop-software-era

#BuildInPublic #IndieHackers #AI

=== END POST ===

---

## First comment (post immediately after the main post lands)

LinkedIn weights the first comment from the author heavily. Post this within 60 seconds of the main post.

=== FIRST COMMENT ===

The honest part: the 100× collapse is on the engineering line. Distribution, support, and product judgment didn't get any cheaper. Those are still 90% of the work.

If you're building right now, the question worth sitting with isn't "can I build it for less?" It's "what kind of business is now worth building that wasn't worth building before?"

=== END FIRST COMMENT ===

---

## Pre-ship checklist (run through in order)

1. [ ] Blog deep-dive is live at `peterghiorse.com/blog/ai-mom-and-pop-software-era` and renders correctly on mobile + desktop
2. [ ] Compiled video file is finalized and under 150 MB
3. [ ] Poster frame is set and stops the scroll at 200×200 thumbnail
4. [ ] Captions are readable with sound off (LinkedIn auto-plays muted)
5. [ ] Ship text has been re-read on a phone — first 3 lines visible above the "see more" fold
6. [ ] Hashtags are exactly 3, lowercase consistent (`#BuildInPublic #IndieHackers #AI`)
7. [ ] Tagged accounts (if any): none recommended — this post stands on its own
8. [ ] Posting window: Tuesday 7–9 AM ET
9. [ ] First comment text is in clipboard, ready to paste 60s after main post
10. [ ] Phone notifications on — engage with replies within the first 90 minutes

---

## Day-of monitoring (light-touch)

Check at 1h, 6h, 24h, 72h. Stop checking after 72h.

| Metric | What "good" looks like |
|---|---|
| Impressions @ 24h | 10k+ is solid for technical founder content; 50k+ is a hit |
| Reaction rate | 2%+ of impressions |
| Comment rate | 0.5%+ of impressions |
| Repost rate | 0.1%+ of impressions |
| Click-throughs to blog | 1%+ of impressions |
| Dwell time (in LinkedIn analytics) | Higher than your prior post baseline |

If impressions cross 50k by hour 24, write a short follow-up post on day 3 about what surprised you in the comments. If not, log learnings privately and move on. Do not re-post the same content.
