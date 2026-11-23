# D5 — Site in its own folder

Taken on 2026-11-14.

The site's sources live in `site/`. Everything else (docs, scripts, config, agent files, `LICENSE`) stays at the repository root and is not published. The build runs 11ty on `site/`: pages are rendered, asset files are copied, and top-level `_`-prefixed folders (`_includes/`, `_data/`) are not published.

**Why:** the repository files are separated from the site by where they live, not by a hand-kept list. Under the old list, a new top-level file was published unless someone remembered to exclude it. Asset files are copied by extension, so a new folder in `site/` is published with no config change.

**Accepted risks:**
- `LICENSE` is no longer published; it was before, only because the exclusion list did not name it.
- Anything put in `site/` by mistake is published, including a `_`-prefixed folder below the top level.
- A file with an extension missing from the allow-list in `eleventy.config.js` is not published until the extension is added.

**Applied in:** `site/`, `eleventy.config.js`, `CONTRIBUTING.md` (Layout), `AGENTS.md` (Hard limits).
