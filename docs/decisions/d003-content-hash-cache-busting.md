# D3 — Content-hash cache busting

Taken on 2026-11-14 (recorded after the fact).

At build time, every CSS/JS reference in the HTML pages gets `?v=<first 8 characters of the file's git hash>`. The source files keep plain references.

**Why:** browsers then fetch a CSS or JS file again only when its content changed. The sources stay clean, and opening them locally still works.

**Accepted risks:** the replacement matches references in quotes by regular expression. A reference written another way (built in JavaScript, for example) is not versioned.

**Applied in:** `build.sh`, `CONTRIBUTING.md` (Page conventions).
