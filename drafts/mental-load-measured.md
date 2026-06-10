---
layout: ../../layouts/BlogLayout.astro
title: "The Mental Load, Measured: What Families Actually Ask an AI to Handle"
description: "Researchers have described the household mental load for decades through interviews. I run a product where families hand that load to an AI in plain words. Which means I can count it: a ranked map of invisible labor, from [N] real requests."
publishDate: "PENDING — set on publish day"
category: "Research"
ogImage: "/images/research/hero-mental-load.png"
faq:
  - q: "What is the mental load in a family?"
    a: "The cognitive work of running a household: not the doing, but the remembering, anticipating, scheduling, and tracking that mostly happens invisibly, and disproportionately in one partner's head. Researchers call it cognitive household labor."
  - q: "What do families use an AI assistant for most?"
    a: "PENDING_DATA — In our 30-day sample of [N] real-family requests, the top categories were [TOP_3]. The full ranked distribution of all 20 categories is in the article."
  - q: "How was this data collected?"
    a: "Every request to Honeydew's assistant is auto-classified into one of 20 fixed intent categories for product-health monitoring. This analysis uses aggregate counts only: no message contents, no names, no individual families. Filtered to real families (founder, test, and bot accounts excluded)."
  - q: "Is this a scientific study of household labor?"
    a: "No. It's a descriptive count from one product's real usage, with a self-selected population (families who chose an AI organizer). It quantifies one observable slice of the mental load; the qualitative research it builds on is cited in the article."
---

![The mental load, measured: a ranked map of what families ask an AI to handle](/images/research/hero-mental-load.svg)

<!-- ============================================================
PUBLISH GATE — DO NOT MOVE TO src/pages/blog/ UNTIL:
0. DATA VOLUME GATE (added 2026-06-09): the first real pull returned
   N=10 classified requests across 2 intents in 30 days — nowhere near
   publishable. Either Dew-chat volume is genuinely tiny among real
   users, or conversation logging / realUserSql is eating rows (a
   regression investigation is flagged in the app repo). HOLD until a
   pull returns ≥300 classified requests spread across ≥8 intents.
1. The prod data pull has replaced every [PENDING_DATA] token below
   (one curl — see drafts/README-mental-load-data.md)
2. scripts/gen-mental-load-assets.mjs has been run on the JSON
   (generates the hero chart + prints the results table)
3. The Discussion section branches have been resolved against the
   real numbers (delete the branches that didn't happen)
4. publishDate set, and the post added to src/pages/blog.astro
============================================================ -->

## TL;DR

1. **The mental load, the invisible cognitive work of running a household, has been documented for decades almost entirely through interviews and surveys.** It's real, it's unequally distributed, and it's famously hard to count.

2. **I run a product where families hand pieces of that load to an AI in plain language.** "Add soccer Tuesday at 5." "Remind me to thaw the chicken." "What's on this weekend?" Every request is auto-classified into one of 20 fixed categories.

3. **This post counts them.** [N] requests from real families over 30 days, aggregate counts only, ranked. As far as I know it's the first quantified map of the household mental load drawn from inside a live product rather than from recall in an interview.

4. **The headline finding: [PENDING_DATA — one sentence, written after the pull].**

5. **What this is not:** a representative study of all families. It's families who chose an AI organizer, counted honestly, with the founder's conflict of interest disclosed and the limitations listed before the conclusions.

---

## 1. The Thing Everyone Describes and Nobody Counts

There's a piece of household work that doesn't show up in any chore chart: knowing that the permission slip is due Thursday, that you're low on milk, that soccer moved to 5pm, that the dentist needs rebooking, and that if nobody thaws the chicken by 9pm tonight, Tuesday's dinner doesn't exist.

Sociologists have names for it: cognitive household labor, the mental load. Allison Daminger's work breaks it into anticipating, identifying, deciding, and monitoring; a 2022 research review by Dean, Churchill, and Ruppanner pulls together two decades of evidence that this labor is substantial, largely invisible, and disproportionately carried by one partner, most often the mother. The research method behind nearly all of it: ask people to remember and describe what they carry.

That's not a criticism. Until recently there was no other way in. You can't strap a sensor to "remembering."

Except, and I say this knowing how it sounds: I accidentally built the sensor.

## 2. Where This Data Comes From

Honeydew is an AI family organizer I build solo. Families talk to its assistant, Dew, in plain words, and it does the thing: builds the list, schedules the event, sets the reminder, assigns the chore. Which means every request is a tiny, time-stamped sample of exactly the labor the literature describes, captured at the moment someone decided to hand it off rather than reconstructed in an interview afterward.

For product-health monitoring, every one of those requests is automatically classified into one of 20 fixed categories (the taxonomy is below; it's load-bearing infrastructure, not built for this post). This analysis is nothing more than counting those categories and being honest about what the counts can and can't say.

**The privacy line, stated plainly:** this analysis uses aggregate counts only. No message contents, no names, no individual families. It sees *how often* the "add to calendar" category occurs across the population, never what any particular family put on their calendar. Founder, test, and bot accounts are excluded by the same real-user filter that guards all of Honeydew's metrics.

## 3. Methods

**Window:** the most recent 30 days of production usage as of [DATE_OF_PULL].

**Population:** real families only. The filter excludes my own accounts, test accounts, synthetic users, and the automated harness that exercises the product in CI. (This filter exists because I once discovered my own test account was silently poisoning a dashboard. A story for another post.)

**The taxonomy:** 20 fixed intents, stable across releases because per-intent success rates gate deploys:

| Intent (system name) | In human terms |
|---|---|
| `add_event` | Put it on the calendar |
| `add_items` | Add things to a list |
| `query_calendar` | What's on / when is…? |
| `create_reminder` | Remind me to… |
| `create_list` | Start a new list |
| `update_item` / `complete_item` / `delete_item` | Keep a list current |
| `search_lists` | Where did we put…? |
| `update_event` / `delete_event` | Reschedule / cancel |
| `assign_task` | Give someone a job |
| `query_assignees` | Whose job is it? |
| `invite_member` | Bring a family member in |
| `query_reminders` | What am I supposed to remember? |
| `plan_day` / `plan_week` | Map out the day / week |
| `meal_plan` | Plan the meals |
| `travel_plan` | Plan a trip |
| `conversational` | Just talking it through |

**Classification mechanics:** an hourly job labels each conversation turn using the agent's own intent analysis where present, the actions actually taken where not, and conservative keyword rules as a fallback. Ambiguous turns stay unclassified rather than being force-fitted, and they're reported below rather than hidden.

**One detail from the production system worth knowing,** because it shows how seriously the counts are policed: for deploy-gating purposes, a request only counts as *successful* if the response was non-empty, a tool actually resolved (or the intent was conversational), the user didn't retry the same intent within 60 seconds, and nobody left a thumbs-down within ten minutes. These aren't vanity counts. The same intent labels gate deploys, so when classification drifts, releases stop shipping. That's the incentive behind the numbers below.

**Groupings used in the analysis** (defined before looking at the results, so the data can't tempt me into a tidier story):

- **Capture** — getting things out of your head: `add_items`, `add_event`, `create_list`, `create_reminder`
- **Recall** — asking the system to remember for you: `query_calendar`, `query_reminders`, `search_lists`, `query_assignees`
- **Upkeep** — keeping the record true: `update_item`, `complete_item`, `delete_item`, `update_event`, `delete_event`
- **Planning** — composing the future: `plan_day`, `plan_week`, `meal_plan`, `travel_plan`
- **Delegation** — distributing the load: `assign_task`, `invite_member`
- **Thinking out loud** — `conversational`

## 4. Results

<!-- PENDING_DATA: run scripts/gen-mental-load-assets.mjs on the pulled JSON.
     It generates the hero chart and prints this table's rows ranked. -->

**Sample:** [N] classified requests from real families, [UNCLASSIFIED_PCT]% unclassified and reported as such.

**The ranked map:**

| Rank | What families asked | Share of all requests |
|---|---|---|
| 1 | [PENDING_DATA] | [%] |
| 2 | [PENDING_DATA] | [%] |
| 3 | [PENDING_DATA] | [%] |
| … | … | … |

**By grouping:** Capture [%], Recall [%], Upkeep [%], Planning [%], Delegation [%], Thinking out loud [%].

[PENDING_DATA — 2–3 paragraphs narrating what the distribution actually shows. Written only after the numbers exist.]

## 5. What I Think It Means

<!-- DISCUSSION BRANCHES — resolve against real data, delete the rest:

BRANCH A (capture+recall dominate planning):
The load, as measured here, is not the grand weekly plan. It's the hundred
small acts of remembering — the relay race of getting things out of one
head into a system before they're dropped. This echoes where Daminger
found the asymmetry concentrating: anticipation and monitoring, the
unglamorous ends of the cycle. It also suggests the products marketed as
"planners" are aimed at the smallest slice of the actual job.

BRANCH B (planning intents are unexpectedly heavy):
[inverse argument — families reach for an AI at composition moments,
not capture moments; capture may be staying in heads/other apps]

BRANCH C (conversational is unexpectedly large):
A meaningful share of what families bring isn't an instruction at all.
It's thinking out loud at something that answers back. Worth sitting
with: part of the mental load is apparently not wanting to carry the
thinking alone.

BRANCH D (delegation is tiny):
The sharing features exist; the asking-for-help behavior is rare. Reads
uncomfortably like the literature: redistributing the load is the part
families struggle with even when given the tool.
-->

## 6. Limitations — Read These Before Quoting Me

- **Self-selected population.** Families who installed an AI organizer are not all families. This measures what *adopters* hand to an AI, which is at best a lower-bound silhouette of the full mental load.
- **The instrument shapes the measurement.** Dew is good at lists, calendars, and reminders, so the requests skew toward what it's good at. A family's load includes plenty no app sees, emotional labor most of all.
- **Classification is automated and conservative.** The fallback rules under-classify rather than guess; [UNCLASSIFIED_PCT]% of turns stayed unclassified and are excluded from rankings.
- **30 days, one season.** September looks different from June. This is a snapshot; the longitudinal version is listed under future work.
- **Founder conflict of interest.** I make the product. You should know who's counting.

## 7. What I Want to Measure Next

- **When the load peaks** — the time-of-day and day-of-week shape (the Sunday-evening planning spike is folklore; I'd like to know if it's real).
- **Whether sharing changes the mix** — solo households versus two-plus-member families, the closest this dataset can get to watching the load redistribute.
- **The same chart, quarterly** — taxonomies hold still; seasons don't.

---

## Frequently Asked Questions

**What is the mental load in a family?**
The cognitive work of running a household: remembering, anticipating, scheduling, monitoring. Distinct from the visible chores themselves, and documented by researchers as falling disproportionately on one partner.

**What do families use an AI assistant for most?**
[PENDING_DATA — top three categories with shares, one sentence.]

**How was this data collected?**
Every request to Honeydew's assistant is auto-classified into one of 20 categories for product monitoring. This analysis is aggregate counts only: no contents, no names, no individual families. Filtered to real families.

**Is this a scientific study of household labor?**
No — a descriptive count from one product's real usage, self-selected population, limitations listed above. The qualitative research it leans on: Daminger (2019) on cognitive labor; Dean, Churchill & Ruppanner (2022) on the mental load.

---

*Pete Ghiorse is the founder of Honeydew, an AI family organizer, and works on ML model evaluation by day. The intent taxonomy, classification mechanics, and success definitions described here are production infrastructure, verified against the codebase on the day of publication. Aggregate counts only: this analysis never touched message contents, and no individual family's data appears in it. Financial interest disclosed accordingly.*
