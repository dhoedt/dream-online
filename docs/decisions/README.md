# Decisions

What was chosen, why, and where it is applied. One file per decision; numbers are stable and never reused.

The decisions below were recorded on 2026-11-14, after they were taken. Their original dates are not known.

| ID | Title | Date | Summary |
|---|---|---|---|
| [D1](d001-plain-static-site.md) | Plain static site | 2026-11-14 | HTML, CSS and vanilla JS; no framework, no package manager |
| [D2](d002-ssh-forced-command-deploy.md) | Deploy by SSH forced command | 2026-11-14 | GitHub Actions starts `deploy.sh` on the server with a restricted key |
| [D3](d003-content-hash-cache-busting.md) | Content-hash cache busting | 2026-11-14 | `?v=<git hash>` on CSS/JS references, added at build time |
| [D4](d004-languages.md) | Languages | 2026-11-14 | French for students, English for code and docs |
| [D5](d005-site-folder.md) | Site in its own folder | 2026-11-14 | Only `site/` is published; the build extracts it alone |
