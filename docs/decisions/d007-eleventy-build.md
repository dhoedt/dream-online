# D7 — Eleventy for the build

Taken on 2026-11-23.

The build uses Eleventy (11ty), installed with npm. Pages share one layout and icon partials, and the home page listing is generated from the pages' front matter. The site is still built on the server (D2).

**Why:** D6 allows a build tool that removes manual work growing with the content. Today each new page needs the head, the back link and the icons copied, plus a link added to `index.html`. 11ty removes both chores. It also gives a live-reload dev server and a base for generating pages from data files later, such as flashcard decks. A Python generator using only the standard library would avoid a package manager, but it would mean home-made templating.

**Accepted risks:**
- Node runs on the server and locally.
- npm packages need upkeep and run under the deploy user.
- Source pages that use the layout no longer open from disk.
- Inline scripts must avoid Liquid syntax.

**Applied in:** not yet applied. The plan is in `docs/eleventy-migration.md`.
