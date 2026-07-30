# Aggregate referral measurement

Last reviewed: 2026-07-22

The site uses the GA4 property `PeteWebsite` (`G-0JQ5NNRQM2`) for consented, channel-level measurement. This system answers which channel, campaign, placement, and landing page brought a visit and whether that visit led to a high-intent action. It does not identify anonymous visitors by name.

## Privacy boundary

Never send a name, email address, company, LinkedIn handle, user ID, hashed identifier, unique person code, full referrer URL, or arbitrary query string to GA4. A person becomes attributable only when they intentionally self-identify, such as by sending an email, or when a deliberately used private link is joined to its intended recipient in the separate private crosswalk. The public analytics lane stays aggregate-only; the optional private-link lane has no access to the crosswalk and uses no fingerprint.

## Canonical inbound links

Use these exact URLs:

| Placement | URL |
| --- | --- |
| LinkedIn website | `https://peterghiorse.com/?utm_source=linkedin&utm_medium=social&utm_campaign=profile_visibility&utm_content=profile_website` |
| LinkedIn Featured résumé PDF | `https://peterghiorse.com/resume.pdf?utm_source=linkedin&utm_medium=social&utm_campaign=profile_visibility&utm_content=featured_resume` |
| Substack profile | `https://peterghiorse.com/?utm_source=substack&utm_medium=referral&utm_campaign=profile_visibility&utm_content=profile_website` |
| GitHub README | `https://peterghiorse.com/?utm_source=github&utm_medium=referral&utm_campaign=profile_visibility&utm_content=readme_badge` |

Controlled content links:

```text
https://peterghiorse.com/<article-path>?utm_source=linkedin&utm_medium=social&utm_campaign=content_distribution&utm_content=<stable_post_slug>
https://peterghiorse.com/<article-path>?utm_source=substack&utm_medium=email&utm_campaign=content_distribution&utm_content=<stable_issue_slug>
```

Keep values lowercase. `utm_source` names the platform, `utm_medium` names the delivery mechanism, `utm_campaign` names the shared objective, and `utm_content` names a stable placement or creative—not a person.

## First-touch session record

The browser may retain only this allow-listed aggregate record in session storage:

- `source_channel`
- `source_name`
- `source_medium`
- `campaign_name`
- `link_placement`
- `landing_path`
- `referrer_host`

`src/lib/attribution.mjs` is the shared contract. It strips query strings from paths, stores only an external referrer hostname, normalizes controlled tokens to lowercase, and rejects event or parameter names outside the registry. A valid first-touch record wins for the rest of the browser session.

Nothing is sent to GA4 before consent. Once consent is accepted:

1. Configure GA with a clean page location containing only the allow-listed aggregate UTMs.
2. Send one `session_attribution` event per browser session.
3. Attach the same aggregate source context to allow-listed engagement events.
4. Send `contact_intent` for an email CTA and treat it as the contact-funnel key event.
5. Keep `newsletter_cta_click` separate as a distribution conversion.

Declining consent clears the in-memory event queue, disables GA, and removes GA cookies. Reports therefore cover only consenting visitors. Referrer stripping, tracking prevention, later direct visits, and link forwarding reduce completeness; unknown traffic must remain visible rather than being treated as zero.

## Allowed events and parameters

The canonical allow lists live in `src/data/profile.json` and are exported through `ATTRIBUTION`. Current high-intent events are:

- `session_attribution`
- `profile_cta_click`
- `contact_intent`
- `newsletter_cta_click`

Register event-scoped GA4 custom dimensions for:

- `source_channel`
- `link_placement`
- `contact_method`
- `placement`
- `cta_type`

Mark `contact_intent` as a key event. Use built-in Session source / medium and Session campaign dimensions before adding custom dimensions.

## Named-person boundary

Anonymous traffic cannot be identified by name responsibly. A named person becomes attributable when they self-identify, such as by sending the prefilled email draft, or when a deliberately opened private link is joined to its intended recipient in the separate private crosswalk.

For pre-conversion, one-to-one link measurement, use the first-party `/r/<opaque-token>` route and the private crosswalk. The GET request renders a tag-free disclosure page. Only the deliberate POST from its Continue button writes `personal_link_engaged`, after which the route returns a 303 to a clean destination containing only aggregate UTMs. The raw token is never stored server-side; the runtime uses an HMAC digest, has no access to the person/company crosswalk, and retains raw engagement events for 90 days. Do not use a per-person UTM, GA custom dimension, cookie, or fingerprint. A private-link engagement still proves that the assigned link was used, not necessarily that the intended recipient clicked it, because links can be forwarded.

### Create, export, and revoke private links

Set the server-only values from `.env.example` in a local ignored environment file and in Vercel. Then run:

```text
npm run referral:create -- --person="Private crosswalk only" --company="Private crosswalk only" --source=linkedin --medium=direct_message --campaign=direct_outreach_2026q3 --placement=message_a --target=/projects --expires-days=90
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

## Verification

1. Run `npm run check`, including the person-referral fail-closed checks.
2. Open a canonical profile link in a fresh session and confirm no GA request occurs before consent.
3. Accept analytics and verify one `session_attribution` event in Realtime or DebugView.
4. Navigate to another page and confirm the original first-touch context remains attached.
5. Trigger an email CTA and verify `contact_intent` contains only aggregate fields.
6. Confirm page paths and referrers contain no query string or personal value.
7. Open a test `/r/<opaque-token>` link and confirm GET writes nothing, contains no analytics, and exposes no aggregate destination.
8. Choose Continue and confirm a single `personal_link_engaged` event, a 303 to clean aggregate UTMs, and no token or identity in GA4.
9. Revoke the token, confirm a 410 response, and verify the raw event expires within 90 days.
10. Review Traffic acquisition after processing using Session source / medium, campaign, landing page, and key events.

Reports cover only visitors who allow analytics. Referrer stripping, tracking prevention, redirects, link forwarding, and later direct visits can all reduce attribution completeness; the dashboard should show unknown or direct traffic honestly rather than treating missing data as zero.
