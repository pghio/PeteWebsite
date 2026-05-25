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

I've spent around $2,500 building the next one.

Same founder, five years apart. Here's what happened.

Between 2017 and 2022 I co-founded GiveTide, a charitable giving platform. Small team, five years of work, a little over half a million dollars to ship. We sold to an acquirer.

Last year I started Honeydew (gethoneydew.app). It's an AI agent that runs families' lives. Calendar, lists, reminders, conflict detection. The mental load problem. I built it solo. By software complexity it's harder than GiveTide ever was. So far it's cost me about $2,500 out of pocket. Roughly 80% of that went to the AI coding tools alone.

The video above is what makes that math possible. ChatGPT can describe a packing list. Only an agent with real tools can actually create one on your real family calendar.

The biggest shift is AI coding tools used seriously. A twelve-field settings screen with validation used to be a one or two day task for a junior engineer. With Cursor and Claude Code it's thirty minutes. Doesn't apply to gnarly bugs. Does apply to the long tail of CRUD that fills out most of a real product.

The infrastructure floor collapsed too. What used to be $5K a month self-hosted now runs on Vercel plus managed Postgres for about $50. Inference is the only meaningful line item, and that's cheap at solo volume.

Model APIs let me skip entire systems. GiveTide spent weeks on NL transaction categorization. Honeydew gets it for a fraction of a cent per call. Same for transcription, OCR, embedding search.

Being wrong got cheaper. In 2017 I polished every screen before anyone saw it because iteration was expensive. Now I ship rough, learn from real families, then delete or polish. Wrong cheaply, faster. That's the actual unlock.

And not having a team is wildly underrated. No meetings, no hiring, no alignment overhead. A real share of my speed is just not coordinating with anyone.

Now the honest part. The cost collapse is on one line item, materializing a working system. Everything else is the same.

Product judgment didn't get cheaper. AI doesn't tell you which feature matters. The hours I spend watching users use Honeydew look identical to GiveTide.

Distribution didn't get cheaper either. Same tools let everyone build for $2,500. The market is louder, not quieter.

Support didn't get cheaper. Replying to "Dew is being weird" reports at 7 AM is the same problem it was in 2017.

Not claiming anyone can do this. I had a decade of operating experience and an exit before Honeydew.

Not building this one for the exit. Just for the work.

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
- [x] Cover poster (1920×1080, $500K vs $2,500)
- [x] Hero, stack, timeline, architecture SVGs all serving in production

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
