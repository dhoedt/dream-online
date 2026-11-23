# D6 — Static site, build tools allowed

Taken on 2026-11-23.

The published site is static: HTML, CSS and vanilla JavaScript, with no client-side framework and no server-side code. Scripts are classic `<script>` files, not ES modules.

The build may use a tool, and a package manager to install it, when the tool removes manual work that grows with the content. Examples are shared layouts, generated listings and pages generated from data files. Each tool is recorded in its own decision, with what it is for.

The built site keeps relative paths, so it can still be opened from the file system.

**Why:** replaces D1, which banned any package manager and toolchain. The ban was too strict for flashcard decks from CSV files, where dropping a file must be enough to publish a deck. That needs a build step that finds the files and generates the pages, and D1 left only a home-made generator. In the browser, D1's reason still holds: the pages are small exercises, and a framework would bring no real gain.

**Accepted risks:**
- Build tools and their dependencies need upkeep.
- Pages generated at build time do not exist in the source, so they only open from the built site.
- Source pages may stop opening straight from disk once they use the build.
- The build server needs each tool's runtime, which adds to D2's accepted risks.

**Applied in:** every page, `js/`, `css/style.css`. Build tools chosen under this decision: 11ty (D7).
