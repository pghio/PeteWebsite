# LinkedIn Post — Ship Text (PRODUCTION-READY)

> Blog post is LIVE at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
> Video is LIVE at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
> Paste the contents between `=== POST ===` markers directly into the LinkedIn composer.
> LinkedIn strips markdown — text is plain.
> Char limit: 3,000.
>
> **Voice goal:** smart builder reflecting on craft. Not "founder running a startup."
> The "as a personal project" + "nights and weekends" framing is critical —
> signals to current coworkers that this is hobbyist tinkering, not a side hustle
> about to become a job change.

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

I spent over $500,000 on the last product I helped ship.

I've spent around $2,500 on the thing I've been hacking on lately.

Same engineer, five years apart. Here's what's going on.

Between 2017 and 2022 I helped build GiveTide, a charitable giving platform. Small team, five years of work, a little over half a million dollars to ship it. It sold to an acquirer.

Last year I started Honeydew (gethoneydew.app) as a personal project. It's an AI agent that runs families' lives. Calendar, lists, reminders, conflict detection. The mental load problem. I've been building it solo on nights and weekends. By software complexity it's harder than GiveTide ever was. So far it's cost me about $2,500 out of pocket. Roughly 80% of that went to the AI coding tools alone.

The video above is what makes that math possible. ChatGPT can describe a packing list. Only an agent with real tools can actually create one on your real family calendar.

The biggest shift is AI coding tools used seriously. A twelve-field settings screen with validation used to be a one or two day task for a junior engineer. With Cursor and Claude Code it's thirty minutes. Doesn't apply to gnarly bugs. Does apply to the long tail of CRUD that fills out most of a real product.

The infrastructure floor collapsed too. What used to be $5K a month self-hosted now runs on Vercel plus managed Postgres for about $50. Inference is the only meaningful line item, and that's cheap at solo volume.

Model APIs let me skip entire systems. GiveTide spent weeks on NL transaction categorization. Honeydew gets it for a fraction of a cent per call. Same for transcription, OCR, embedding search.

Being wrong got cheaper. In 2017 I polished every screen before anyone saw it because iteration was expensive. Now I ship rough, learn from the families using it, then delete or polish.

Working solo on something is wildly underrated. No meetings, no alignment overhead, no design committee. A real share of my speed is just not coordinating with anyone.

Now the honest part. The cost collapse is on one line item, materializing a working system. Everything else is the same.

Product judgment didn't get cheaper. AI doesn't tell you which feature matters. The hours I spend watching real users use Honeydew look identical to the ones I spent at GiveTide.

Distribution didn't get cheaper either. Same tools let everyone build for $2,500. The market is louder, not quieter.

Support didn't get cheaper. Replying to "Dew is being weird" reports at 7 AM is the same problem it was in 2017.

Not claiming anyone can do this. A decade of operating experience and shipping a real product first shaped what I know.

Building software is just more enjoyable than it's ever been.

Full breakdown, charts, FAQ, sources → https://peterghiorse.com/blog/ai-mom-and-pop-software-era

#BuildInPublic #AI #SoftwareEngineering

=== END POST ===

---

## First comment (paste 60 seconds after posting)

=== FIRST COMMENT ===

Quick add — the math collapse is really only on the engineering line item. Distribution, support, product judgment are all still 90% of the work. If you're trying to figure out what to build right now, the question I keep coming back to is: what kind of thing is worth making that wasn't worth making before? Doesn't have to be a business. That's been reshaping how I think about what I work on in my spare time.

=== END FIRST COMMENT ===

---

## Pre-ship checklist

Status as of last main deploy:

- [x] Blog deep-dive live at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
- [x] Compiled video live at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
- [x] Cover poster (1920×1080, $500K vs $2,500)
- [x] Hero, stack, timeline, architecture SVGs all serving in production
- [x] Builder-coded framing throughout (no "startup," no "exit," explicit "personal project" and "nights and weekends")

Pete to verify:
- [ ] Phone preview on iPhone — first 3 lines above the "see more" fold
- [ ] Sound off — captions carry the story
- [ ] Custom thumbnail uploaded (not auto-picked frame)
- [ ] Posting window: Tuesday 7–9 AM ET
- [ ] First comment in clipboard for the 60s drop
- [ ] On your phone for the first 90 minutes of replies

---

## Why this framing works for coworker-safe personal brand

The post positions you as a builder reflecting on craft, not a founder running a competing thing. Specific signals:

- "Personal project" + "nights and weekends" = explicit hobbyist framing
- "Same engineer" instead of "same founder"
- "Hacking on lately" instead of "started building"
- Dropped "I'm not building for the exit. Just for the work." (signals startup intent)
- First comment ends with "in my spare time"
- Closing line: "Building software is just more enjoyable than it's ever been" (craft, not commerce)
- Removed #IndieHackers hashtag; added #SoftwareEngineering

You can still link to gethoneydew.app — having a personal project that has a domain is normal for engineers. The framing is that you tinker on it; you're not running a venture.
