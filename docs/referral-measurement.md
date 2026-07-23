# Aggregate referral measurement

Last reviewed: 2026-07-22

The site uses the GA4 property `PeteWebsite` (`G-0JQ5NNRQM2`) for consented, channel-level measurement. This system answers which channel, campaign, placement, and landing page brought a visit and whether that visit led to a high-intent action. It does not identify anonymous visitors by name.

## Privacy boundary

Never send a name, email address, company, LinkedIn handle, user ID, hashed identifier, unique person code, full referrer URL, or arbitrary query string to GA4. A person becomes attributable only when they intentionally self-identify, such as by sending an email. This lane includes aggregate attribution only; it contains no private-link activation, token route, secret, crosswalk, or fingerprint.

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

## Verification

1. Run `npm run test:attribution` and `npm run check:attribution`.
2. Open a canonical profile link in a fresh session.
3. Confirm no GA request occurs before consent.
4. Accept analytics and verify one `session_attribution` event in Realtime or DebugView.
5. Navigate to another page and confirm the original first-touch context remains attached.
6. Trigger an email CTA and verify `contact_intent` contains only aggregate fields.
7. Confirm page paths and referrers contain no query string or personal value.
8. Review Traffic acquisition after processing using Session source / medium, campaign, landing page, and key events.
