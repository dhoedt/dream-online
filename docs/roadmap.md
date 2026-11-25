# Roadmap

Planned work, in order. Lifecycle in `CONTRIBUTING.md` (Ideas and planned work).

## Eleventy migration

Move the existing site to Eleventy (D7). The plan, with checks and effort, is in `docs/eleventy-migration.md`.

1. **Switch.** 11ty builds the site with the pages unchanged; the built `dist/` stays the same. The server moves to release folders and a `current` symlink, which allows rollback.
2. **Layouts and partials.** Shared head layout, icon shortcode, generated home page listing, `asset_url` cache busting.

## Flashcard card review

The flashcards (D8) are teaching material and have not been checked. Review every card for accuracy and typos ("dénominatin", "qui se connecte" for "qui se connectent"), then fix them in the spreadsheet and export again.
