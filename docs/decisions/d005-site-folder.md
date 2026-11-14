# D5 — Site in its own folder

Taken on 2026-11-14.

The published site lives in `site/`. Everything else (docs, scripts, agent files, `LICENSE`) stays at the repository root and is not published. The build extracts only `site/` from the last commit.

**Why:** the repository files are separated from the site by where they live, not by a hand-kept list in `build.sh`. Under the old list, a new top-level file was published unless someone remembered to exclude it.

**Accepted risks:** `LICENSE` is no longer published; it was before, only because the exclusion list did not name it. Anything put in `site/` by mistake is published.

**Applied in:** `site/`, `build.sh`, `CONTRIBUTING.md` (Layout), `AGENTS.md` (Hard limits).
