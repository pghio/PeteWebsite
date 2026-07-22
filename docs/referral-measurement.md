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

Anonymous traffic cannot be identified by name responsibly. A named person becomes attributable when they self-identify, such as by sending the prefilled email draft, or when a deliberately opened private link is joined to its intended recipient in the separate private crosswalk.

For pre-conversion, one-to-one link measurement, use the first-party `/r/<opaque-token>` route and the private crosswalk. The GET request renders a tag-free disclosure page. Only the deliberate POST from its Continue button writes `personal_link_engaged`, after which the route returns a 303 to a clean destination containing only aggregate UTMs. The raw token is never stored server-side; the runtime uses an HMAC digest, has no access to the person/company crosswalk, and retains raw engagement events for 90 days. Do not use a per-person UTM, GA custom dimension, cookie, or fingerprint. A private-link engagement still proves that the assigned link was used, not necessarily that the intended recipient clicked it, because links can be forwarded.

### Create, export, and revoke private links

Set the server-only values from `.env.example` in a local ignored environment file and in Vercel. Then run:

```text
npm run referral:create -- --person="Private crosswalk only" --company="Private crosswalk only" --source=linkedin --medium=direct_message --campaign=recruiter_outreach_2026q3 --placement=message_a --target=/resume --expires-days=90
```

The command writes only aggregate route metadata to the server store and prints one row for the private crosswalk. The `person` and `company` arguments remain local and never reach the deployed store. Copy the output into the private Google Sheet.

Export the 90-day click log for the Sheet’s `Clicks` tab:

```text
npm run referral:export -- --output=referral-clicks.csv
```

Revoke a route using its HMAC token ID, not the raw token:

```text
npm run referral:revoke -- --token-id=<private-token-id>
```

Use these confidence labels consistently:

- `self_identified`: the person contacted Pete or otherwise identified themselves.
- `personal_link_engaged`: the private link’s Continue button was deliberately used.
- `personal_link_accessed`: reserved for a future, explicitly disclosed raw-access signal; the current implementation does not emit it because scanners and previews would create misleading records.
- `channel_only`: ordinary aggregate referral traffic.

## Verification checklist

1. Open a canonical profile link in a fresh browser session.
2. Confirm no GA request occurs before consent.
3. Accept analytics and confirm `session_attribution` appears once in GA4 Realtime or DebugView.
4. Navigate to another page and confirm the original source context remains attached.
5. Click an email CTA and confirm `contact_intent` carries the source, campaign, placement, and landing page.
6. Confirm the email draft shows only aggregate referral context and contains no stored visitor identity.
7. Check Traffic acquisition after processing for the expected session source / medium and campaign.

Reports cover only visitors who allow analytics. Referrer stripping, tracking prevention, redirects, link forwarding, and later direct visits can all reduce attribution completeness; the dashboard should show unknown or direct traffic honestly rather than treating missing data as zero.
