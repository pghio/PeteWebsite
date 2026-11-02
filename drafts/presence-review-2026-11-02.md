# Presence review for recruiter inbound — 2026-11-02

Scope: live peterghiorse.com, repo, GitHub, Substack, search engines, and the 2026-10-14 presence strategy (`drafts/presence-strategy-2026-10-14.md`) plus its distribution queue. LinkedIn read from the 10/14 signed-in snapshot only.

## What changed since the October plan
- Shipped: hero thesis, `/research` series index, citation blocks, Monsters figures, research line linked from footer/about/work (commits 10/14–10/25).
- Not shipped: everything in `drafts/distribution-queue.md` (Show HN, LessWrong linkpost, five direct shares). No LinkedIn post since July. No new piece since 2026-07-22 (102 days). GA4 still ships G-0JQ5NNRQM2 and was receiving no data on 10/14; unverified since.
- Net: the site got better; the distribution layer that the plan said was "nearly absent" is still absent.

## New findings (not in the October doc)
1. **Bing has zero pages from peterghiorse.com** (`site:` query returns unrelated results; "Pete Ghiorse" returns nothing). Google indexes all 16 URLs. Bing feeds Copilot, DuckDuckGo, ChatGPT browsing, and a share of sourcing tools. For someone who publishes on LLM discoverability, this is an own goal. Fix: Bing Webmaster Tools (import from Search Console), submit sitemap, add IndexNow key (Astro has `@astrojs/sitemap`; IndexNow is one static key file + a ping on deploy).
2. **Recruiter inbound is keyed to the Capital One line, not the research line** (10/14 evidence: fintech/credit subjects, PM-to-VP spread centered at senior/staff). The site cannot change that; LinkedIn headline + Featured can.
3. **No level or availability signal anywhere on the site.** A recruiter cannot tell from the homepage whether you are open, what scope you want, or where. "Start a conversation" is the only cue. The 10/14 "ask for the résumé, private link" approach was never shipped.
4. **Cadence collapse is visible**: last post July 22, 3 commit-days since Aug 1. Recruiters and sourcing tools weight recency.
5. **GitHub**: 5 repos, 0 stars, 0 followers, `hireable: true`. Research READMEs lead with method, not the finding (10/14 note still true).

## Prioritized actions (recruiter-inbound specific, highest leverage first)
### Week 1 — zero-cost signal fixes
1. **LinkedIn headline** (recruiters search titles + keywords, not thesis statements): `Group Product Manager, AI/ML @ Capital One · Staff/Lead PM: AI platforms, agents, evals · Founder (exit) · NYC`. Keep the research thesis in About, not the headline. The 10/14 proposed headline is lab-optimized; this one is recruiter-optimized. Pick per goal; you said recruiter inbound.
2. **LinkedIn Featured**: Perplexity-grade proof, in this order: restraint study, 8-model benchmark, Honeydew. Add the `/research` page.
3. **Open to Work**: already ON (recruiters only). Add titles: Staff Product Manager, Principal Product Manager, Group Product Manager, Head of Product, Product Lead. Add "AI" variants. Location NYC + Remote.
4. **Site homepage**: one line under the hero: "Open to Staff+/Head of Product roles in AI platforms and agents, NYC or remote. Résumé on request." Links to /contact. Ship the private-résumé-link branch or just make `/contact` say "ask for the résumé".
5. **Bing**: Webmaster Tools + sitemap + IndexNow. 30 minutes.
6. **Contact page**: show the email as visible text; add a Calendly/"15-minute intro" link. Recruiters book, they don't draft.
7. **Third-party titles**: theorg.com says "Technical Product Manager", ZoomInfo "Senior Product Manager". Claim/correct both; recruiters' tools pull from them.

### Weeks 2–4 — distribution (the plan that exists, executed)
8. Post the three unposted pieces on LinkedIn using the ship-text pattern (48–51 reactions vs 9 for link-only). One per week. Carousel for Monsters.
9. Run the distribution queue: Show HN for `agent-restraint-evals`, LessWrong linkpost, five direct shares. All text is already written.
10. Comment 3x/week on posts from people at target companies (Perplexity, Anthropic, Stripe, Datadog, Scale PMs and eval researchers). Comments are the cheapest way into recruiter "viewers also viewed" clusters outside Capital One.
11. GitHub: pin repos, put the finding + hero figure at the top of each README, add CITATION.cff, fix the private-contributions toggle so the activity graph isn't empty.

### Month 2 — one research piece
12. Publish the model-swap piece (Section 5 of the 10/14 plan; data already in Honeydew `reports/closeout-2026-10/`). Ends the 100-day gap with research, not an essay, and gives the checklist its first full run.

### Measurement
13. Fix GA4 (stream ID mismatch) or add Plausible; start the one-tab inbound log (date, company, level, trigger). Review weekly.

## What NOT to do
- Don't add "open to work" green frame publicly while at Capital One; recruiters-only is right.
- Don't put the résumé PDF back on the site; private link on request keeps the employer-safe stance.
- Don't write another essay before the research piece; the last four pieces were essays and they pull the identity toward "AI/labor commentator".

## Implemented 2026-11-02 (by Claude, per Pete: no headline change, no hero availability line)
- Contact page: email shown as visible text; "Book 30 minutes" card → calendly.com/pmghiorse/30min (only event type that exists; a 15-min "intro" type would need you to create it).
- IndexNow: key file at `public/06985515f425e316293debfc9ba8654f.txt`, ping script `scripts/indexnow-ping.mjs` (run after each deploy).
- Inbound log started: `~/job-engine/tracker/inbound_log.csv` (Datadog + LangChain seeded).
- GitHub already done since October: READMEs lead with the headline result, CITATION.cff in all three repos, four repos pinned. Nothing to change.

## Pete-only to-do (needs your logins; ~45 minutes total)
1. **Bing Webmaster Tools** (bing.com/webmasters): sign in, "Import from Google Search Console", confirm sitemap https://peterghiorse.com/sitemap-index.xml. Then run `node scripts/indexnow-ping.mjs`.
2. **LinkedIn → Open to Work** (recruiters only, already on): add job titles Staff Product Manager, Principal Product Manager, Group Product Manager, Head of Product, Product Lead; locations New York + Remote. This is private to recruiters, not a public signal.
3. **LinkedIn → Featured**: restraint study, 8-model benchmark, peterghiorse.com/research. Remove anything stale.
4. **LinkedIn → Experience**: confirm Honeydew entry link no longer carries the retired `recruiter_visibility` utm tag.
5. **GitHub → Settings → Profile**: enable "Include private contributions on my profile" so the activity graph isn't empty signed-out.
6. **theorg.com / ZoomInfo**: claim or request correction of the "Technical PM" / "Senior PM" titles to Group Product Manager.
7. **GA4**: Admin → Data Streams → compare the stream's Measurement ID to G-0JQ5NNRQM2 on the live site; fix whichever side is wrong.
8. **Substack About**: remove the "résumé" mention; add a photo.
9. **Post, in this order, one per week**: Falls the Shadow (ship text exists), Monsters of the Mind (carousel), data-center essay; then Show HN + LessWrong + five shares from `drafts/distribution-queue.md`.
