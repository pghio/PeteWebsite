# LinkedIn Post — Ship Text (PRODUCTION-READY)

> Blog post is LIVE at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
> Video is LIVE at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
> Paste the contents between `=== POST ===` markers directly into the LinkedIn composer.
> LinkedIn strips markdown — text is plain, with → arrows / numbered lists / ALL CAPS as the only emphasis.
> Char limit: 3,000. Current count: ~2,720 (280 char headroom).

---

## Asset attachment order

1. **Native video upload:** the 36s `compiled-with-architecture.mp4` file. Download from production:
   ```
   curl -O https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
   ```
2. **Custom thumbnail:** when LinkedIn asks "select thumbnail," choose **Upload custom thumbnail** and pick the poster JPG. Don't let LinkedIn auto-pick a frame — you'll lose the designed $500K vs $5K cover.
   ```
   curl -O https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture-poster.jpg
   ```

If video uploads have issues, fall back to the static hero SVG:
   `https://peterghiorse.com/images/research/momnpop-hero-cost-comparison.svg`

---

=== POST ===

I spent over $500,000 building my last startup.

I've spent under $5,000 building the next one.

Same founder. Same engineering instincts. Five years between them.

Six years ago I co-founded GiveTide, a charitable giving platform. It took a small team, five years, and over half a million dollars to ship. We sold to an acquirer in 2022.

Last year I started Honeydew (gethoneydew.app) — an AI agent that actually runs families' lives. Solo. By software complexity, Honeydew is harder than GiveTide ever was: an LLM agent in the loop, voice, tool orchestration across a multi-tenant family graph, realtime sync, conflict detection.

Total out-of-pocket: under $5K.

▼ The video above shows the agent on a real family calendar. ChatGPT can write the plan. Only an agent with real tools can execute it.

What actually changed:

1) AI coding tools, used seriously. A twelve-field settings screen with validation was a one-to-two-day task for a junior engineer at GiveTide. With Cursor + Claude Code, it's thirty minutes.

2) The infrastructure floor collapsed. What was $5K/month self-hosted is now $50/month on Vercel + managed Postgres.

3) Model APIs replaced entire systems. GiveTide spent weeks on NL transaction categorization. Honeydew gets that for a fraction of a cent per call. Same for transcription, OCR, and embedding search.

4) The cost of being wrong dropped. I ship rough things, learn from real families, then delete or polish. Wrong cheaply, faster.

5) No team means no coordination tax. Underrated. Eliminating meetings, hiring, and alignment is itself a major savings — and a major velocity gain.

What didn't change:

→ Product judgment. AI doesn't tell you which feature matters.

→ Distribution. The same tools let everyone else build for $5K. The market is louder, not quieter.

→ Support. AI products are arguably harder to support — failure modes are stochastic.

→ Operational discipline. The temptation, with cost down 100×, is to ship 100× more stuff. The right move is the opposite.

The cost collapse compresses one specific axis — materializing a working system. The other axes stay the same shape. They're often the binding constraint.

What I'm not claiming: that anyone can do this. I had a decade of operating experience and an exit before I started Honeydew. 2017-me wouldn't have shipped this with 2026 tools, because I didn't yet know what to build.

I'm not building for the exit. I'm building for the work.

Full breakdown, charts, FAQ, and sources → https://peterghiorse.com/blog/ai-mom-and-pop-software-era

#BuildInPublic #IndieHackers #AI

=== END POST ===

---

## First comment (paste 60 seconds after posting)

LinkedIn weights early author comments heavily. Have this in clipboard, paste immediately after the post lands.

=== FIRST COMMENT ===

The honest part: the 100× collapse is on the engineering line only. Distribution, support, and product judgment didn't get any cheaper. Those are still 90% of the work.

If you're building right now, the question worth sitting with isn't "can I build it for less?" It's "what kind of business is now worth building that wasn't worth building before?"

=== END FIRST COMMENT ===

---

## Pre-ship checklist

Status as of last main deploy:

- [x] Blog deep-dive is live at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
- [x] Compiled video live at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4 (36s, 1.05 MB)
- [x] Cover poster live at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture-poster.jpg (1920×1080, correct aspect)
- [x] Honeydew-themed hero, stack, and architecture SVGs all rendering in production
- [x] Char count under 3,000

Pete to verify:
- [ ] Phone preview: open the LinkedIn composer on iPhone, paste, confirm the first 3 lines sit above the "see more" fold
- [ ] Sound off: play the video in LinkedIn's previewer with sound muted — captions should carry the story
- [ ] Thumbnail: upload the custom poster JPG instead of letting LinkedIn auto-pick a frame
- [ ] Posting window: Tuesday 7–9 AM ET (peak founder-content engagement)
- [ ] First comment in clipboard, ready to paste 60s after main post
- [ ] Phone notifications on — reply to comments within the first 90 minutes (this is where the algorithm decides who else sees it)

---

## Day-of monitoring (light-touch)

Check at 1h, 6h, 24h, 72h. Stop checking after 72h.

| Metric | What "good" looks like |
|---|---|
| Impressions @ 24h | 10k+ is solid for technical founder content; 50k+ is a hit; prior post baseline was 3,812 |
| Reaction rate | 2%+ of impressions |
| Comment rate | 0.5%+ of impressions |
| Repost rate | 0.1%+ of impressions |
| Click-throughs to blog | 1%+ of impressions |
| Dwell time | Higher than the LLM-citation post baseline |

If impressions cross 50k by hour 24, write a short follow-up on day 3 about what surprised you in the comments. If not, log learnings privately and move on. Do not re-post.

---

## Notes for amplification (day 2+)

- **X/Twitter cross-post (24h later):** lead with the 3-line hook + the compiled video. Truncate the body to fit. Link to the blog as the punchline.
- **Hacker News / Indie Hackers:** rewrite for each platform — HN wants the technical "how" up front, IH wants the founder journey. Don't paste the same text.
- **Email newsletter (if you have one):** the blog post is the email; the LinkedIn post is the teaser.

Don't auto-cross-post the same text. Each platform punishes content optimized for elsewhere.
