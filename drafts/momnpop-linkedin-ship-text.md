# LinkedIn Post — Ship Text (PRODUCTION-READY)

> Blog post is LIVE at https://peterghiorse.com/blog/ai-mom-and-pop-software-era
> Video is LIVE at https://peterghiorse.com/videos/posts/momnpop/compiled-with-architecture.mp4
> Paste the contents between `=== POST ===` markers directly into the LinkedIn composer.
> LinkedIn strips markdown — text is plain. The `→` arrows paste fine and read as scannable bullets.
> Char limit: 3,000. Current count: 1,564 (tight + scannable — leads with the hook, two scan-friendly lists in the middle).
>
> **Link goes in the FIRST COMMENT, not the body.** LinkedIn suppresses reach on posts with
> outbound links in the body. The post ends with "...in the comments" and the blog link sits in
> the first comment (drop it within ~60s of posting). If you'd rather put it in the body, swap the
> last line for "Full breakdown → https://peterghiorse.com/blog/ai-mom-and-pop-software-era".
>
> **Voice goal:** founder reflecting on craft. Pete founded Honeydew — the post now says
> "I founded Honeydew" rather than hiding it. Keeps the hands-on "I build it solo, nights and
> weekends" detail (true, and it's the point of the cost story) without downplaying the role.

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

I spent over $500,000 building the last product I shipped.

I've spent about $2,500 on the one I'm building now.

Same founder. Five years apart. The math broke by 200×.

From 2017 to 2022 I cofounded GiveTide, a charitable giving platform, and ran it as CEO. Small team, five years, half a million dollars to ship. We sold to an acquirer.

Last year I founded Honeydew (gethoneydew.app) — an AI agent that runs families' lives. Calendar, lists, reminders, the whole mental-load problem. I build it solo, nights and weekends, and it's already more technically sophisticated than GiveTide ever was. About $2,500 out of pocket so far.

The video is why it's not just a chatbot. ChatGPT can describe a packing list. Dew actually builds it, checks your real family calendar for conflicts, and sets the reminders — in seconds.

What got cheap:
→ AI coding tools turned a one-day settings screen into 30 minutes
→ Infrastructure went from $5K/month to $50
→ Model APIs replaced whole systems (categorization, transcription, OCR) with a single call
→ Going solo killed the coordination tax

What didn't:
→ Product judgment. Distribution. Support. AI doesn't tell me what to build, and "Dew is being weird" at 7 AM is still mine to fix.

I'm not claiming anyone can do this — a decade of operating experience shaped what I know is worth making. But the price of admission to real software collapsed, and that part of the job is more fun than it's ever been.

Full breakdown — the cost math, the stack, what I'd tell 2017-me — in the comments.

#BuildInPublic #AIAgents #SoftwareEngineering

=== END POST ===

---

## First comment (paste 60 seconds after posting)

This one ends with a question that invites replies — comment velocity is what tells the algorithm to push the post past your immediate network.

=== FIRST COMMENT ===

Full write-up here (cost breakdown + architecture + what I'd tell 2017-me): https://peterghiorse.com/blog/ai-mom-and-pop-software-era

The honest caveat: that 200× collapse is only on the engineering line. Distribution, support, and product judgment are still 90% of the work — and none of it got cheaper.

Genuinely curious: what would you build if it cost you $2K instead of $200K?

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
- [x] Founder voice — "cofounded GiveTide and ran it as CEO," "founded Honeydew," kept the honest "I build it solo, nights and weekends"
- [x] Post body: 2,224 chars (was 2,875 — tighter, more scrollable)
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

## Why this framing works

Founder reflecting on craft — owns the role without the hustle-culture posturing. Specific signals:

- "Same founder. Five years apart." — ties both ventures to your real role
- "Cofounded GiveTide and ran it as CEO" → "founded Honeydew" — the arc is CEO-of-a-funded-startup to solo-founder-builder, which is the whole point of the cost story
- "I build it solo, nights and weekends" — kept, because it's true and it's what makes $2,500 believable
- Closing stays craft-forward ("more fun than it's ever been"), not a growth-metrics flex
- Hashtags: #BuildInPublic + #AIAgents + #SoftwareEngineering — builder community, where this story lands best

The contrast that carries the post: the same person who raised money and ran a team to ship one product is now shipping a more sophisticated one alone, for 0.5% of the cost.
