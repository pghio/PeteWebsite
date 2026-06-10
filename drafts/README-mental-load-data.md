# Mental Load piece — data unblock (one command)

## STATUS 2026-06-09: ON HOLD — not enough data to publish honestly

The pull ran (saved at `drafts/intent-distribution.json`). Result:
**10 classified requests across 2 intents in 30 days** (add_event: 6,
create_list: 4; zero `unclassified` rows, so this is row volume, not a
classifier gap). A "ranked map of the mental load" needs hundreds of
requests minimum. Two possible explanations, flagged for investigation
in the app repo:
1. Real-user Dew-chat volume is genuinely this small (piece waits months)
2. A logging or filter regression (ConversationTracker/SessionManager were
   modified recently; realUserSql has over-excluded before — the
   176-families-collapsed-to-3 incident)

Re-run the pull after the investigation; publish only when a pull returns
≥300 classified requests across ≥8 intents.

## The pull (one command, rerun anytime)

The article in `drafts/mental-load-measured.md` is fully written except the
results:

```bash
cd ~/Documents/GitHub/honeydew_June.nosync
KEY=$(grep '^ADMIN_MIGRATIONS_KEY=' .env.local | cut -d= -f2-)
curl -s -H "x-admin-key: $KEY" \
  "https://app.gethoneydew.app/api/admin/metrics/dew/intent-success?days=30" \
  > ~/PeteWebsite/drafts/intent-distribution.json
```

Then generate the chart + the filled-in results table:

```bash
cd ~/PeteWebsite
node scripts/gen-mental-load-assets.mjs drafts/intent-distribution.json
```

That emits `public/images/research/hero-mental-load.svg`, prints the ranked
markdown table, the grouping shares, and suggested headline stats to paste
into the article's `[PENDING_DATA]` slots.

Finish checklist (also embedded at the top of the article):
1. Replace every `[PENDING_DATA]` token; set `publishDate`
2. Resolve the Discussion branches against the real numbers (delete the rest)
3. `mv drafts/mental-load-measured.md src/pages/blog/`
4. Add the entry to `src/pages/blog.astro` (top of the `articles` array)
5. Render the PNG og image (`node scripts/render-post-images.mjs` does all SVGs)
6. Build + push

Alternative to the manual curl: re-run Claude with permission to query the
prod admin endpoint and it will do all six steps.
