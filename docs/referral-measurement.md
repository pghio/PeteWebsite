# Referral measurement playbook

Last reviewed: 2026-07-22

This site uses the GA4 property `PeteWebsite` (`G-0JQ5NNRQM2`) for consented, channel-level measurement. The goal is to answer:

1. Which channel, campaign, and link placement started a visit?
2. Which landing page and content did that visitor use?
3. Did the visit lead to an email click, newsletter click, or other high-intent action?

GA4 is not a people database. Never place a name, email address, company, LinkedIn handle, hashed identifier, or person-specific code in a UTM value, event parameter, custom dimension, page URL, or referrer sent to GA4.

## Canonical profile links

Use these exact links on the corresponding public profiles:

| Placement | URL |
| --- | --- |
| LinkedIn website | `https://peterghiorse.com/?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=profile_website` |
| LinkedIn Featured resume | `https://peterghiorse.com/resume?utm_source=linkedin&utm_medium=social&utm_campaign=recruiter_visibility&utm_content=featured_resume` |
| Substack profile | `https://peterghiorse.com/?utm_source=substack&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=profile_website` |
| GitHub README | `https://peterghiorse.com/?utm_source=github&utm_medium=referral&utm_campaign=recruiter_visibility&utm_content=readme_badge` |

For LinkedIn posts, use:

```text
https://peterghiorse.com/<article-path>?utm_source=linkedin&utm_medium=social&utm_campaign=content_distribution&utm_content=<stable_post_slug>
```

For Substack issues, use:

```text
https://peterghiorse.com/<article-path>?utm_source=substack&utm_medium=email&utm_campaign=content_distribution&utm_content=<stable_issue_slug>
```

Keep every value lowercase. Use `utm_source` for the platform, `utm_medium` for the delivery mechanism, `utm_campaign` for the shared objective, and `utm_content` for a stable placement or creative variant.

## What the site records

Before consent, the browser keeps only this allow-listed first-touch context in session storage:

- `source_channel`
- `source_name`
- `source_medium`
- `campaign_name`
- `link_placement`
- `landing_path`
- `referrer_host`

The full referrer URL and its query string are never stored. Nothing is sent to GA4 until the visitor opts in. After consent, one `session_attribution` event is sent per browser session and the same source context is attached to allow-listed engagement events.

The dedicated `contact_intent` event fires for an email CTA. Its `contact_method`, `placement`, and source context make it the primary recruiter-funnel conversion. An email draft also includes the aggregate source context in visible, editable text; this connects a self-identified sender to the channel without sending their identity to GA4.

## GA4 reporting setup

Use the built-in reports first:

- **Reports → Acquisition → Traffic acquisition:** Session source / medium, Session campaign, landing page, and key events.
- **Reports → Acquisition → User acquisition:** First user source / medium and First user campaign.

Create event-scoped custom dimensions for these low-cardinality custom parameters:

- `source_channel`
- `link_placement`
- `contact_method`
- `placement`
- `cta_type`

Mark `contact_intent` as a key event. Keep `newsletter_cta_click` as a separate content-distribution conversion.

Create an Exploration with rows for Session source / medium, Session campaign, and Landing page; columns for event count, users, `contact_intent`, and `newsletter_cta_click`; and optional breakdowns for `source_channel` and `link_placement`.

## Named-person boundary

Anonymous traffic cannot be identified by name responsibly. A named person becomes attributable only when they self-identify, such as by sending the prefilled email draft.

If pre-conversion, one-to-one link measurement is ever necessary, build a first-party, tag-free redirect with a high-entropy opaque token and a private access-controlled crosswalk. The redirect must remove the token before the visitor reaches the GA-tagged site and add only aggregate UTMs. Do not use a per-person UTM or GA custom dimension. A clicked private link still proves that the link was used, not necessarily that the intended recipient clicked it, because links can be forwarded.

## Verification checklist

1. Open a canonical profile link in a fresh browser session.
2. Confirm no GA request occurs before consent.
3. Accept analytics and confirm `session_attribution` appears once in GA4 Realtime or DebugView.
4. Navigate to another page and confirm the original source context remains attached.
5. Click an email CTA and confirm `contact_intent` carries the source, campaign, placement, and landing page.
6. Confirm the email draft shows only aggregate referral context and contains no stored visitor identity.
7. Check Traffic acquisition after processing for the expected session source / medium and campaign.

Reports cover only visitors who allow analytics. Referrer stripping, tracking prevention, redirects, link forwarding, and later direct visits can all reduce attribution completeness; the dashboard should show unknown or direct traffic honestly rather than treating missing data as zero.
