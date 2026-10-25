# CSH Study Companion

A WordPress assistant for [CSH Consultancy](https://cshconsultancy.com), supporting study-abroad enquiries, consultation requests and general client support.

## Status

Version 0.1.2 was installed on cshconsultancy.com on 25 October 2026. The assistant recognizes the site's existing OpenAI connection under WordPress Connectors, and **CSH Study Companion → OpenAI** access has been approved. A live request reached OpenAI and returned HTTP 429 because the prepaid API credit balance was exhausted. Add credits to the API account, then verify a successful reply before enabling public chat. Preview mode is off; the public floating button remains off.

This repository contains the plugin's source code. WordPress settings, API keys, student information and the site's database are not stored here. Updating this repository does not automatically update the installed plugin.

## Features

- Guidance based on an editable snapshot of CSH's public services.
- Separate visitor, consultation and existing-client paths.
- Consultation requests prepared as email drafts for the visitor to review and send. CSH confirms availability manually.
- WhatsApp and enquiry-form handoff for private application updates.
- A page shortcode and optional floating chat button.
- Server-side OpenAI Responses API integration with validation and request limits.
- Clearly labelled sample responses when preview mode is enabled.

The assistant cannot access a calendar or private student records, book appointments, submit applications or send messages itself.

## Requirements

- WordPress 6.5 or newer, PHP 8.1 or newer.
- An OpenAI API project with billing and access to the model selected in settings for live AI. The starter model is `gpt-6-luna`.
- Node.js 22 or newer for the optional local preview, JavaScript tests and packaging.

## Local preview and checks

```sh
node preview.mjs
node --test tests/flows.test.mjs
php tests/backend.php
```

The local preview opens at http://127.0.0.1:4173 and uses scripted sample replies. It does not call OpenAI. The PHP checks simulate WordPress and provider responses; they do not replace testing on a WordPress staging site.

## Build an installable plugin

```sh
npm install
npm run check
npm test
npm run package
```

The archive is created at `dist/csh-study-companion.zip`. Only the plugin's runtime files are included; tests, dependencies and local files are excluded. The build script never reads WordPress credentials.

## Install or update on Hostinger

1. Open the site's WordPress dashboard.
2. Go to **Plugins → Add New Plugin → Upload Plugin** and select the archive.
3. Install and activate. For an update, review WordPress's replacement prompt for this plugin.
4. Open **Settings → CSH Study Companion** and review the approved knowledge.
5. Connect OpenAI under **Settings → Connectors** (WordPress 7+) or configure the key privately under **Settings → CSH Study Companion**. The assistant automatically uses the shared OpenAI connector when its own key field is blank. A `CSH_OPENAI_API_KEY` constant overrides both. Never commit a real key.
   If WordPress blocks the first request for connector approval, review **Tools → Connector Approvals** and allow only **CSH Study Companion → OpenAI**. The assistant does not bypass these permissions.
6. Ensure the site's privacy notice explains AI processing, then disable preview mode when ready to test live AI.
7. Add `[csh_assistant]` in a Shortcode block or enable the floating button. Retain the existing enquiry form.

## Data and limits

The plugin does not save chat transcripts or consultation form details. Live chat text is sent to OpenAI with `store: false`; provider and hosting retention policies still apply. Keys saved through the administrator form are stored in the WordPress database and must be protected in backups.

The assistant reads shared connector credentials only on the server, following the connector's environment-variable, constant and database precedence. It does not copy them into its own settings. The administrator page shows the connection source and a timestamped, allowlisted diagnostic for the last provider request. Diagnostics contain no key, conversation text or raw provider response. Configuration requests tell LiteSpeed not to cache them; the live site's assistant REST paths are also excluded from LiteSpeed caching.

Limits default to 200 API attempts per UTC day site-wide and 12 per minute per server-observed IP address. Counters persist in a WordPress table and use salted IP hashes. These are request limits, not a currency budget. Proxy settings may cause multiple visitors to share an IP limit. Expired counters are periodically pruned.

## Knowledge and verification

`knowledge.txt` is a manually maintained starter drawn from CSH's [homepage](https://cshconsultancy.com/) and [services page](https://cshconsultancy.com/services/) on 25 October 2026. The administrator can edit the active knowledge in WordPress settings. Website changes are not automatically synchronized.

Validation for version 0.1.2 includes five JavaScript flow tests and thirty-two PHP checks in PHP 8.3 with mocked dependencies, covering connector precedence, private diagnostics and public responses without credentials. Desktop and 390-pixel widget layouts were checked previously. After explicit approval, a live request reached OpenAI and returned `credit_balance_exhausted`; successful reply testing remains pending API funding. Consultation emails are prepared for visitors to send and require manual confirmation by CSH.

## Project layout

- `csh-assistant.php`: WordPress settings, REST routes, rate limits and AI requests.
- `public/`: assistant interface and floating widget.
- `knowledge.txt`: initial public knowledge.
- `preview.mjs`: local demonstration server.
- `tests/`: frontend behavior and simulated backend checks.
- `scripts/package.mjs`: reproducible plugin archive builder.

## References

- [Hostinger plugin installation](https://www.hostinger.com/tutorials/how-to-install-wordpress-plugins/)
- [OpenAI API quickstart](https://developers.openai.com/api/docs/quickstart)
- [WordPress REST routes](https://developer.wordpress.org/reference/functions/register_rest_route/)
- [WordPress connector metadata](https://developer.wordpress.org/reference/functions/wp_get_connector/)
