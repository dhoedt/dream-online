# D3 — Content-hash cache busting

Taken on 2026-11-14 (recorded after the fact).

Pages reference CSS and JS through the `asset_url` filter. At build time, it appends `?v=<first 10 hex characters of the file's SHA-256>` to the path.

**Why:** browsers then fetch a CSS or JS file again only when its content changed. The filter also fails the build when a referenced file is missing.

**Accepted risks:** a reference that does not go through the filter (one built in JavaScript, for example) is not versioned.

**Applied in:** `config/asset-url.js`, `eleventy.config.js`, `site/_includes/layouts/base.njk`, every page that loads a script, `CONTRIBUTING.md` (Page conventions).
