# D7 — Eleventy for the build

Taken on 2026-11-23.

The build uses Eleventy (11ty), installed with npm, with Nunjucks templates. Pages share one layout and icon files, and the home page listing is generated from the pages' front matter. Pages use 11ty's default URLs (`lessons/subnet/`). The site is still built on the server (D2).

**Why:** D6 allows a build tool that removes manual work growing with the content. Each new page needed the head, the back link and the icons copied, plus a link added to `index.html`. 11ty removes both chores. It also gives a live-reload dev server and a base for generating pages from data files later, such as flashcard decks. A Python generator using only the standard library would avoid a package manager, but it would mean home-made templating. The default URLs need no permalink config.

**Accepted risks:**
- Node runs on the server and locally.
- npm packages need upkeep and run under the deploy user.
- Source pages no longer open from disk, and neither does navigation in the built site: links end in `/`, which only a web server turns into `index.html`.
- Inline scripts must avoid Nunjucks syntax.

**Applied in:** `package.json`, `eleventy.config.js`, `config/`, `site/_includes/`, `site/_data/`, every page, `deploy.sh`.
