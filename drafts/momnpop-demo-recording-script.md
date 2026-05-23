# Demo Recording — How These Were Made

> **Status:** the demo videos for this campaign were generated automatically by a Playwright pipeline, not recorded by hand. This doc captures *how* so the next campaign can reuse the approach.

---

## What lives where

| Asset | Path |
|---|---|
| Compiled final video | `public/videos/posts/momnpop/compiled-with-architecture.mp4` (36s) |
| Demo 1 standalone | `public/videos/posts/momnpop/demo-1-list-add.mp4` |
| Demo 2 standalone | `public/videos/posts/momnpop/demo-2-clarification.mp4` |
| Cover poster | `public/videos/posts/momnpop/compiled-with-architecture-poster.jpg` |
| Cover poster SVG source | `public/videos/posts/momnpop/compiled-with-architecture-poster.svg` |
| Architecture diagram | `public/images/posts/honeydew-architecture-2026.svg` |
| Playwright record script | `scripts/record-demo.js` |

---

## Pipeline

1. **Record (Playwright, headless):**
   ```bash
   node scripts/record-demo.js demo1
   node scripts/record-demo.js demo2
   ```
   Headless Chromium signs in as `harness-user-a@test.gethoneydew.app`, navigates to the production Honeydew web app at iPhone 14 Pro viewport (390×844 with `isMobile: true`), opens Dew, types the demo prompt, waits for `Actions completed`, holds the final state. Records natively to webm via `recordVideo`.

2. **Compose (ffmpeg):**
   Each demo segment is composed onto a 1920×1080 canvas:
   - Green gradient + hearts background (matches Honeydew onboarding identity)
   - Phone-window recording on the left at native resolution, subtle white outline
   - Architecture diagram on the right at 0.8× scale (1280×720)
   - Stage highlights (lime green `#8FE16C`) pulse around the active pipeline box as Dew works
   - Lower-third caption strips (dark green, switches to red `#9B2C1A` for the conflict-detected beat)

3. **Concat:** intro card → demo 1 → demo 2 → outro card → MP4 with `-movflags +faststart`. Total ~36s.

---

## Demos that ship

| Demo | Prompt | What it shows |
|---|---|---|
| 1 | *"Add eggs, milk, and bread to my Groceries list."* | Natural language → real list mutation. Dew reaches into the family graph, picks the right list, adds 3 items, suggests follow-ups. |
| 2 | *"Schedule taco night every Tuesday at 6 PM. Add a recurring reminder for Mondays at 9 PM to thaw the meat."* | Recurring event + recurring reminder + **conflict detection** ("4 date(s) conflict with existing events") + alternative suggestions. The big "ChatGPT can't do this" beat. |

---

## Prompts that *didn't* work

For future reference — these consistently hit Dew's internal complexity timeout and returned the "This request is taking longer than expected" fallback:

- *"Plan a beach trip Saturday from 9 AM to 4 PM. Create a packing list with sunscreen, snacks, and towels. Remind me to load the cooler Friday at 8 PM."* — too complex (4 distinct actions including auto-categorized list sections)
- *"Add a dentist appointment for next Tuesday at 10 AM, create a list of questions to ask the dentist, and remind me to leave 30 minutes early."* — same issue

If you want to flex multi-tool orchestration on a future campaign, either split into two sequential prompts or simplify to 2 actions max.

---

## Cover poster rasterization gotcha

`qlmanage -t -s 1920` rasterizes an SVG to a **square** canvas at the max dimension. For a 1920×1080 viewBox, the output PNG is **1920×1920 with the SVG content letterboxed top-and-bottom**.

If you then do `ffmpeg -vf scale=1920:1080`, you force-stretch the square down, squashing typography and turning circles into ovals. **Crop, don't scale:**

```bash
ffmpeg -i poster.svg.png -vf "crop=1920:1080:0:420" -q:v 2 poster.jpg
```

The `:0:420` cuts the top letterbox (y-offset = (1920−1080)/2 = 420) and keeps the true 1080px content area.
