# Demo Recording Script — "$500K vs $5K" LinkedIn Post

> Two demos, one architecture overlay, one 30–45s compiled video.
> Production standard: every frame defensible. No music. No filler. Captions carry the story.

---

## 0. Pre-flight (10 min, do this once)

**Device & environment**
- [ ] MacBook plugged in, brightness fixed at ~75%
- [ ] Quit Slack, Mail, Messages, Calendar notifications
- [ ] Enable Do Not Disturb (Focus → Do Not Disturb until tomorrow)
- [ ] Hide menu bar clutter (Bartender / hide spotlight icons)
- [ ] Close every browser tab except the demo target
- [ ] Set Chrome / Safari window to a fixed size: **1440×900** (matches recording crop)
- [ ] System font scaling at default; zero browser zoom
- [ ] Disable browser extensions that paint anything on screen (Grammarly, Honey, etc.)
- [ ] Plug in headphones (silences notification beeps)

**Demo data (Honeydew family account)**
- [ ] Sign in to a clean demo family. **Recommended:** create a fresh `demo-recording@gethoneydew.app` family so production data isn't on camera
- [ ] Family must contain at least: 2 adults, 2 kids with **distinct first names** (Demo 2 needs ambiguity — use `Tommy` and `Tommy J.` if you want maximum punch, or just any kid whose name resolves cleanly)
- [ ] A `Grocery` list exists, empty
- [ ] A calendar exists, current week visible
- [ ] No pending Dew conversations from earlier sessions

**Recorder**
- [ ] **Screen Studio** (preferred — auto-zoom, cursor highlight, smooth scrolls)
- [ ] Recording resolution: **1920×1080 @ 60fps**
- [ ] Cursor highlight: on, subtle
- [ ] Click effects: on, minimal
- [ ] Auto-zoom: on (Screen Studio will follow the action)
- [ ] Background blur: off (we want the real chrome)

---

## 1. Demo 1 — Natural language → action (target: 10–14s)

**What this proves:** Interpret → Plan → Execute stages firing cleanly. The easy 80%.

**Setup state on screen:**
- Honeydew web app at `/lists/grocery`
- List is empty
- Dew chat composer visible, focused

**Action sequence (rehearse 3× before recording):**
1. *(0:00)* Cursor lands in Dew composer
2. *(0:01)* Type — fast but readable — *"add eggs, milk, and bread to the grocery list"*
3. *(0:04)* Press Enter
4. *(0:05)* Dew's thinking indicator pulses briefly (~1s)
5. *(0:06–0:10)* Three items animate into the list: **eggs**, **milk**, **bread**
6. *(0:11)* Dew's confirmation reply appears beneath the input ("Added three items to Grocery")
7. *(0:13)* Cursor settles. Hold for 1 beat. END.

**Caption strip (lower-third, brand-colored, fade in/out):**
- 0:00–0:04: *"Type a sentence."*
- 0:05–0:10: *"Dew parses intent, picks tools, writes to the family graph."*
- 0:11–0:14: *"Three items, one round-trip, ~700ms."*

**Common mistakes to avoid:**
- Don't pre-type then paste — viewers must SEE you type so the action feels real
- Don't pause mid-sentence ("add eggs… milk… and bread")
- Don't cursor-wander after the items land — settle and cut

**Source flow reference:** `client/src/components/Agent/VoiceControls.tsx`, `client/src/components/Agent/DewIntentPreviews.tsx`

---

## 2. Demo 2 — Clarification under ambiguity (target: 15–20s)

**What this proves:** Interpret → Plan → (clarify) → Execute, with the family graph providing the disambiguation surface. The hard 20%. This is the demo that earns the "more sophisticated than GiveTide" claim.

**Setup state on screen:**
- Honeydew web app at `/calendar` (current week visible)
- Family has at least one kid whose name appears in 2+ overlapping contexts (e.g., two upcoming events involving Tommy this month, OR two kids named similarly)
- Dew chat composer visible

**Action sequence (rehearse 3× before recording):**
1. *(0:00)* Cursor lands in Dew composer
2. *(0:01)* Type — *"schedule a dentist for Tommy next week"*
3. *(0:04)* Press Enter
4. *(0:05)* Dew thinking indicator
5. *(0:06–0:09)* Dew responds with a clarifying question: *"Which Tommy — your son Tommy or Tommy J.? And do you have a preferred time of day?"* (or similar — the exact text depends on what Dew actually says; rehearse to see)
6. *(0:10)* You reply: *"My son, Tuesday morning"*
7. *(0:13–0:16)* Dew confirms, calendar shows the event landing on Tuesday morning with the dentist label
8. *(0:18)* Hold for 1 beat. END.

**Caption strip:**
- 0:00–0:04: *"Now an ambiguous one."*
- 0:05–0:09: *"Dew checks the family graph. Two Tommys. It asks."*
- 0:10–0:13: *"Quick reply."*
- 0:14–0:18: *"Event lands. The hard 20% — handled."*

**Fallback if the live system doesn't ask clarification:** record a flow where Dew at least confirms intent before mutating ("Schedule a dentist for Tommy next Tuesday at 10 AM?" → yes). The story still works — you're showing **verify before mutate**, which is what the "Idempotent · clarifies under doubt" microcopy on the diagram refers to.

**Source flow reference:** anywhere clarification UI surfaces in the agent components — `client/src/components/Agent/` directory.

---

## 3. Recording standards (apply to both demos)

| Standard | Setting |
|---|---|
| Resolution (source) | 1920×1080 @ 60fps |
| Cursor highlight | On, subtle |
| Auto-zoom | On (Screen Studio follows the action) |
| Click effects | On, minimal |
| Notifications | Off (Do Not Disturb) |
| Browser chrome | Full (address bar visible — proves it's real software) |
| Window size | 1440×900 |
| System cursor | Default macOS, no custom skins |
| Take limit | 3 takes max. Take 2 is usually the winner. |

**No music. No transitions. No branded stings.** LinkedIn auto-plays muted. Captions are the only voice.

---

## 4. Compile the final video (the LinkedIn upload)

This is the piece that goes on LinkedIn. **30–45 seconds total.**

### Layout
```
┌──────────────────────────────┬─────────────────────────┐
│                              │                         │
│                              │   ARCHITECTURE          │
│   DEMO VIDEO                 │   DIAGRAM               │
│   (70% width)                │   (30% width)           │
│                              │                         │
│   1920×1080 source           │   honeydew-             │
│   cropped/positioned         │   architecture-         │
│   inside left 70%            │   2026.svg              │
│                              │                         │
│                              │                         │
└──────────────────────────────┴─────────────────────────┘
```

**Master output canvas:** 1920×1080 (16:9).
- Left 70% (1344px wide) = demo footage
- Right 30% (576px wide) = architecture diagram, scaled to fit

**Vertical export (LinkedIn native upload):** 1080×1920 (9:16). For vertical, stack instead of side-by-side:
```
┌──────────────────────────┐
│   ARCHITECTURE DIAGRAM   │  ← top 35%
├──────────────────────────┤
│                          │
│   DEMO VIDEO             │  ← middle 55%
│                          │
├──────────────────────────┤
│   CAPTION STRIP          │  ← bottom 10%
└──────────────────────────┘
```

### Sequence (per the timeline)
| Time | Visual | Architecture diagram state |
|---|---|---|
| 0:00–0:02 | Hero card: "$500K → $5K" (use existing cost-comparison SVG) | full diagram, neutral |
| 0:02–0:16 | Demo 1 plays | highlight INTERPRET → PLAN → EXECUTE boxes in sequence (subtle red glow on the active box) |
| 0:16–0:18 | Brief beat / transition | full diagram, neutral |
| 0:18–0:38 | Demo 2 plays | same highlight pattern + briefly highlight FAMILY GRAPH during clarification |
| 0:38–0:42 | End card: "gethoneydew.app · built solo · under $5K" | diagram full, then fade |

### Editing software
- **Screen Studio's built-in editor** can do the side-by-side composition if you import the SVG as a static layer. Quickest path.
- **CapCut** (free) or **DaVinci Resolve** (free) if you want more control over the box-highlight animations.
- **Avoid Final Cut Pro / Premiere** for this — overkill for a 40-second clip.

### Highlight animation spec
For the architecture box highlights as each stage fires:
- Stroke color shifts from `#1A1A1A` (black) to `#A8301B` (accent red)
- Stroke width: 2px → 4px
- Subtle scale: 1.0 → 1.03
- Duration: 200ms ease-in, hold for the stage duration, 200ms ease-out
- No glow, no particle effects, no shake

---

## 5. Export specs

| File | Resolution | Aspect | Codec | Bitrate | Purpose |
|---|---|---|---|---|---|
| `demo-1-list-add.mp4` | 1920×1080 | 16:9 | H.264 | 12 Mbps | Raw demo 1 (archived) |
| `demo-2-clarification.mp4` | 1920×1080 | 16:9 | H.264 | 12 Mbps | Raw demo 2 (archived) |
| `compiled-with-architecture.mp4` | 1080×1920 | 9:16 | H.264 | 10 Mbps | **LinkedIn native upload** |
| `compiled-horizontal.mp4` | 1920×1080 | 16:9 | H.264 | 10 Mbps | Blog embed |
| `compiled-with-architecture-poster.jpg` | 1080×1920 | 9:16 | JPEG (q90) | — | Video poster frame |

Output paths (all under `public/videos/posts/momnpop/`).

**Poster frame:** pick a frame from 0:00–0:02 where both the architecture diagram is visible AND a punchy moment of demo 1 is on screen. The poster is what stops the scroll on LinkedIn's mute autoplay.

---

## 6. QA checklist (before the video is "done")

- [ ] **Muted playback:** play with sound completely off. Can a stranger follow the story from captions + visuals alone? If no, re-caption.
- [ ] **Thumbnail check:** scrub to 0:01. Is this frame stop-the-scroll worthy at 200×200 pixel size? If not, change the poster frame.
- [ ] **No leaked PII:** scan every frame for real family member names, photos, addresses, school names. Replace with demo data if anything slipped through.
- [ ] **Cursor not lost:** at no point does the cursor go off-screen or wander without purpose.
- [ ] **Architecture box highlights sync to the action:** when INTERPRET should be lit, INTERPRET is lit. Not lagging, not anticipating.
- [ ] **End frame:** clean. Logo + URL + nothing else. No "thanks for watching." No music tail.
- [ ] **File size:** under 150 MB (LinkedIn's hard cap is 5 GB but smaller = faster upload + better mobile decode).
- [ ] **Duration:** total 35–45 seconds. Under 30s feels rushed; over 45s loses retention.

---

## 7. Shot-list quick reference (print this)

```
DEMO 1 (12s)
  Type:   "add eggs, milk, and bread to the grocery list"
  Watch:  thinking indicator → 3 items animate in → confirm
  Caption: Type / Parse / 3 items, ~700ms
  Diagram highlights: INTERPRET → PLAN → EXECUTE

DEMO 2 (18s)
  Type:   "schedule a dentist for Tommy next week"
  Watch:  Dew clarifies → reply "my son, Tuesday morning" → event lands
  Caption: Ambiguous / Dew asks / Quick reply / Lands
  Diagram highlights: INTERPRET → FAMILY GRAPH (pulse) → PLAN → EXECUTE
```

That's the whole job.
