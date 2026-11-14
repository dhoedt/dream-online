# D1 — Plain static site

Taken on 2026-11-14 (recorded after the fact).

The site is plain HTML, CSS and vanilla JavaScript. No framework, no package manager, no server-side code. Scripts are classic `<script>` files, not ES modules.

**Why:** the content is a handful of pages with small interactive exercises. A framework would add a toolchain and dependencies to maintain without a real gain. Classic scripts keep every page working when opened straight from the file system.

**Accepted risks:** some markup is repeated across pages (head, back link, icons). It is copied from an existing page when adding one.

**Applied in:** every page, `js/`, `css/style.css`.
