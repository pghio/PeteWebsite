# LinkedIn Post — Ship Text (PRODUCTION-READY)

> Blog post is LIVE at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
> Video is LIVE at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
> Paste the contents between `=== POST ===` markers directly into the LinkedIn composer.
> LinkedIn strips markdown — text is plain.
> Char limit: 3,000. Current count: 2,012 (lean, scrollable).
>
> **Voice goal:** smart builder reflecting on craft. Not founder running a startup.
> "Personal project" + "nights and weekends" framing signals to current coworkers
> that this is hobbyist tinkering, not a job-change announcement.

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

Between 2017 and 2022 I helped build GiveTide, a charitable giving platform. Small team, five years, just over half a million to ship. It sold to an acquirer.

Last year I started Honeydew (gethoneydew.app) as a personal project. It's an AI agent that runs families' lives — calendar, lists, reminders, conflict detection. The mental load problem. I've been building it solo on nights and weekends. So far it's cost me about $2,500 out of pocket. Roughly 80% of that went to the AI coding tools.

The video above is what makes the math work. ChatGPT can describe a packing list. Only an agent with real tools can actually create one on your real family calendar.

What changed comes down to a few things.

AI coding tools used seriously. A twelve-field settings screen with validation went from a one-day junior-engineer task at GiveTide to thirty minutes in Cursor. Doesn't apply to gnarly bugs. Does apply to the long tail of CRUD that fills out most of a real product.

The infrastructure floor collapsed. $5K a month self-hosted is now $50 a month managed. And model APIs let me skip building entire systems by hand — categorization, transcription, OCR, embedding search are all an API call.

Working solo is also wildly underrated. No meetings, no alignment overhead, no design committee. A real share of my speed is just not coordinating with anyone.

What didn't change is the rest of the job. Product judgment, distribution, support. AI doesn't tell me which feature matters, the same tools that let me build for $2,500 let everyone build for $2,500, and "Dew is being weird" reports at 7 AM are exactly the problem they were in 2017.

Not claiming anyone can do this. A decade of operating experience and a real shipped product behind me shaped what I know about what's worth making.

But the price of admission to making real software dropped, and that part of the job is more enjoyable than it's ever been.

Full breakdown → https://peterghiorse.com/blog/ai-mom-and-pop-software-era

#BuildInPublic #AIAgents #SoftwareEngineering

=== END POST ===

---

## First comment (paste 60 seconds after posting)

This one ends with a question that invites replies — comment velocity is what tells the algorithm to push the post past your immediate network.

=== FIRST COMMENT ===

Quick add — the math collapse is really only on the engineering line item. Distribution, support, and product judgment are still 90% of the work.

The question I keep coming back to: what kind of thing is worth making that wasn't worth making before? Doesn't have to be a business. Genuinely curious — what would you start building if it cost you $2K instead of $200K?

=== END FIRST COMMENT ===

---

## Heads-up message for 2-3 friends (send 30 min before posting)

LinkedIn weights first-hour engagement heavily — the algorithm decides whether to push the post past your immediate network based on what happens in the first 90 minutes. Pinging 2-3 founder / engineer / PM friends right before posting nudges that math in your favor. Don't ask them to coordinate; just let them know it's coming.

=== FRIEND HEADS-UP ===

Hey — posting an essay on LinkedIn in ~30 min about what it cost me to build GiveTide back in the day vs. what it's costing to hack on Honeydew now (200× cheaper, mostly because of Cursor + Claude Code). If you happen to see it pop up in your feed and have a thought, dropping a like or comment in the first hour would help a ton — first-hour velocity is what tells the LinkedIn algo whether to push it. No pressure either way. Thanks 🙏

=== END FRIEND HEADS-UP ===

---

## Pre-ship checklist

- [x] Blog deep-dive live at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
- [x] Compiled video live at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4 (36s)
- [x] Cover poster (1920×1080, builder-coded copy)
- [x] All hero / stack / timeline / architecture SVGs serving in production
- [x] Builder voice throughout — no "startup," no "exit," explicit "personal project" + "nights and weekends"
- [x] Post body: 2,012 chars (was 2,875 — tighter, more scrollable)
- [x] First comment ends in a question (invites replies)
- [x] Friend heads-up template ready

Pete to verify before posting:
- [ ] Phone preview on iPhone — first 3 lines above the "see more" fold
- [ ] Watch the 36s video on muted autoplay — captions carry the story
- [ ] Custom thumbnail uploaded (not auto-picked frame from LinkedIn)
- [ ] Posting window: see "Timing" section below
- [ ] First comment in clipboard for the 60s drop
- [ ] Send heads-up DM to 2-3 friends ~30 min before posting
- [ ] On your phone for the first 90 minutes of replies

---

## Timing — pick your window from your own analytics, not the textbook

The textbook answer for founder/builder content is Tuesday 7–9 AM ET. The real answer is whenever your specific audience is on LinkedIn, which varies.

To find your actual best window:
1. Open LinkedIn → your profile → "Analytics" (top of profile)
2. Pull up your "Do LLMs Actually Cite Your Startup?" post from 1 month ago (the 3,812-impression one)
3. Click into it → "Performance" → the hourly impression curve
4. Note when impressions peaked — that's roughly when your audience was scrolling
5. Post the new one in that same window, ±30 minutes

Failing analytics: Tuesday or Wednesday 7–9 AM ET is the safe default for technical-founder content. Avoid Mondays (cluttered) and Fridays (low engagement). Mid-week morning is the sweet spot.

---

## Day-of monitoring

Check at 1h, 6h, 24h, 72h. Stop after 72h — diminishing returns.

| Metric | What "good" looks like |
|---|---|
| Impressions @ 24h | 10k+ solid; 50k+ a hit; prior post baseline 3,812 |
| Reaction rate | 2%+ of impressions |
| Comment rate | 0.5%+ of impressions |
| Click-throughs to blog | 1%+ of impressions |

If impressions cross 50k by hour 24, write a short follow-up on day 3 about what surprised you in the comments. Otherwise log learnings and move on. Don't repost.

---

## Why this framing works for coworker-safe personal brand

The post positions you as a builder reflecting on craft. Specific signals:

- "Personal project" + "nights and weekends" = explicit hobbyist framing
- "Same engineer" instead of "same founder"
- "Hacking on lately" instead of "started building"
- No "exit" or "venture" language
- First-comment qualifier: "in my spare time" / "Doesn't have to be a business"
- Closing line: craft-coded ("more enjoyable than it's ever been"), not commerce-coded
- Hashtags: #BuildInPublic + #AIAgents + #SoftwareEngineering — engineering-builder community, not founder-hustle community

You're still linking gethoneydew.app — having a personal project with a domain is normal for engineers. The framing is that you tinker on it, not run it.
