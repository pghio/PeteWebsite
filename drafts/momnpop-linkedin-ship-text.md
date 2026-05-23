# LinkedIn Post — Ship Text (PRODUCTION-READY)

> Blog post is LIVE at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
> Video is LIVE at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
> Paste the contents between `=== POST ===` markers directly into the LinkedIn composer.
> LinkedIn strips markdown — text is plain.
> Char limit: 3,000.

---

## Asset attachment order

1. **Native video upload:** the 36s `compiled-with-architecture.mp4`. Download from production:
   ```
   curl -O https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
   ```
2. **Custom thumbnail:** when LinkedIn asks "select thumbnail," choose **Upload custom thumbnail** and pick the poster JPG. Don't let LinkedIn auto-pick a frame.
   ```
   curl -O https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture-poster.jpg
   ```

---

=== POST ===

I spent over $500,000 building my last startup.

I've spent under $5,000 building the next one.

Same founder, five years apart. Here's what happened.

Between 2017 and 2022 I co-founded GiveTide, a charitable giving platform. Small team, five years of work, a little over half a million dollars to ship. We sold to an acquirer.

Last year I started Honeydew (gethoneydew.app). It's an AI agent that runs families' lives. Calendar, lists, reminders, conflict detection. The mental load problem. I built it solo. By software complexity it's harder than GiveTide ever was. So far it's cost me under $5K out of pocket.

The video above is what makes that math possible. ChatGPT can describe a packing list. Only an agent with real tools can actually create one on your real family calendar.

Here's what's different now.

The biggest shift is AI coding tools, used seriously. A twelve-field settings screen with validation used to be a one or two day task for a junior engineer. With Cursor and Claude Code it's thirty minutes. Doesn't apply to gnarly bugs. Does apply to the long tail of CRUD work that fills out most of a real product.

The infrastructure floor collapsed. What used to be $5K/month self-hosted now runs on Vercel plus managed Postgres for about $50. Inference is the only line item that's still meaningful, and that's cheap at solo volume.

Model APIs let me skip entire systems. GiveTide spent weeks on NL categorization. Honeydew gets it for a fraction of a cent per call. Same for transcription, OCR, embedding search. What used to take real engineering is now an API call.

Being wrong got cheaper. In 2017 I polished every screen before anyone saw it because iteration was expensive. Now I ship rough things, learn from the families using them, then delete or polish. Wrong cheaply, faster. That's the actual unlock.

Not having a team is wildly underrated. No meetings, no hiring, no alignment overhead. A real share of my speed at Honeydew is just not coordinating with anyone.

Now the honest part. The cost collapse is on one line item — materializing a working system. Everything else is the same.

Product judgment didn't get cheaper. AI doesn't tell you which feature matters. The hours I spend watching users use Honeydew look identical to GiveTide.

Distribution didn't get cheaper either. Same tools that let me build for $5K let everyone build for $5K. The market is louder, not quieter.

Support didn't get cheaper. Replying to "Dew is being weird" reports at 7 AM is the same problem it was in 2017 — arguably harder now because the failure modes are stochastic.

Not claiming anyone can do this. I had a decade of operating experience and an exit before Honeydew. 2017-me wouldn't have shipped this with 2026 tools. I didn't yet know what to build.

I'm not building this one for the exit. Just for the work.

Full breakdown, charts, FAQ, sources → https://peterghiorse.com/blog/ai-mom-and-pop-software-era

#BuildInPublic #IndieHackers #AI

=== END POST ===

---

## First comment (paste 60 seconds after posting)

=== FIRST COMMENT ===

Quick add — the math collapse is really only on the engineering line item. Distribution, support, product judgment are all still 90% of the work. If you're trying to figure out what to build right now, the question I keep coming back to is: what kind of business is worth starting that wasn't worth starting before? Different question than "how cheap can I build it." That's been reshaping what I work on.

=== END FIRST COMMENT ===

---

## Pre-ship checklist

Status as of last main deploy:

- [x] Blog deep-dive live at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
- [x] Compiled video live at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
- [x] Cover poster (1920×1080, correct aspect)
- [x] All hero/stack/architecture SVGs serving in production

Pete to verify:
- [ ] Phone preview on iPhone — first 3 lines above the "see more" fold
- [ ] Sound off — captions carry the story
- [ ] Custom thumbnail uploaded (not auto-picked frame)
- [ ] Posting window: Tuesday 7–9 AM ET
- [ ] First comment in clipboard for the 60s drop
- [ ] On your phone for the first 90 minutes of replies

---

## Day-of monitoring

Check at 1h, 6h, 24h, 72h. Stop after 72h.

| Metric | What "good" looks like |
|---|---|
| Impressions @ 24h | 10k+ solid; 50k+ a hit; prior post baseline 3,812 |
| Reaction rate | 2%+ of impressions |
| Comment rate | 0.5%+ of impressions |
| Click-throughs to blog | 1%+ of impressions |

If impressions cross 50k by hour 24, write a short follow-up on day 3 about what surprised you in the comments. Otherwise log learnings and move on.

---

## Amplification (day 2+)

- **X (day 2):** lead with the 3-line hook + the compiled video. Truncate body to fit.
- **HN / Indie Hackers:** rewrite per platform. Don't paste the same text.
- **Email newsletter:** the blog post is the email; LinkedIn is the teaser.
