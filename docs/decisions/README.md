# Decisions

What was chosen, why, and where it is applied. One file per decision; numbers are stable and never reused.

D2 to D5 were recorded on 2026-11-14, after they were taken. Their original dates are not known. D1 was replaced by D6.

| ID | Title | Date | Summary |
|---|---|---|---|
| [D2](d002-ssh-forced-command-deploy.md) | Deploy by SSH forced command | 2026-11-14 | GitHub Actions starts `deploy.sh` on the server with a restricted key; the server builds into release folders |
| [D3](d003-content-hash-cache-busting.md) | Content-hash cache busting | 2026-11-14 | `?v=<SHA-256 prefix>` on CSS/JS references, added by the `asset_url` filter |
| [D4](d004-languages.md) | Languages | 2026-11-14 | French for students, English for code and docs |
| [D5](d005-site-folder.md) | Site in its own folder | 2026-11-14 | Only `site/` is published, minus 11ty's top-level `_` folders |
| [D6](d006-static-site-build-tools-allowed.md) | Static site, build tools allowed | 2026-11-23 | Static HTML, CSS and vanilla JS; the build may use a tool and a package manager, each in its own decision |
| [D7](d007-eleventy-build.md) | Eleventy for the build | 2026-11-23 | 11ty builds the site with a shared layout, partials and a generated listing |
| [D8](d008-flashcard-master-files.md) | Flashcards from master CSV files | 2026-11-23 | 2 master CSV files; `Matiere` files each card under an exam and a subject, listed with their order in `flashcards.json` |
| [D9](d009-single-flashcard-page-with-settings.md) | One flashcard page with settings | 2026-11-25 | One page for all cards; a settings screen filters them by exam, subject and type, and sets shuffling; settings kept in `localStorage` |
