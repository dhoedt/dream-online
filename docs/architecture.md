# Architecture

How the site is built: pages, shared code, build and deploy.

## Pages

- `index.html` lists the content in three tabs: Exercices, Leçons, Ressources. The active tab is kept in the URL hash (`#lessons`), so it survives the back button.
- Each lesson and exercise is a standalone HTML page with its own inline script. Pages do not load each other.
- Exercise data (questions, accepted answers, hints) lives in the page's inline script.

## Shared code

| File | Used by | Holds |
|---|---|---|
| `css/style.css` | every page | the whole style |
| `js/common.js` | exercises | hint/answer panels (one open at a time), feedback line, wrong-field marking |
| `js/subnet.js` | subnet lesson and exercise | subnet calculations and their rendering |

Scripts are plain `<script>` files, not modules, so pages work when opened from the file system (D6). This holds for the source pages and for the built site in `dist/`.

## Build

`build.sh` turns `site/` in the last commit into the deployable site in `dist/`.

1. Extract `site/` from `HEAD` into `dist.tmp/` with `git archive HEAD:site`. Only the site is extracted, so there is nothing to remove.
2. Cache busting: append `?v=<first 8 characters of the file's git hash>` to every CSS/JS reference in the HTML pages. A file's version changes only when its content does.
3. Write the build time, in Belgian time, in place of the `<!-- build-time -->` marker in `index.html`.
4. Swap `dist.tmp/` in as `dist/`, so `dist/` is never half-built.

## Deploy

1. A push to `main` (or a manual run) starts `.github/workflows/deploy.yml`.
2. The workflow opens an SSH connection to the server. It sends no command: the key is restricted to `deploy.sh` by a forced command in the server's `authorized_keys`.
3. `deploy.sh` resets the server's clone to `origin/main` and runs `build.sh`.
4. nginx serves `dist/` as static files. Its configuration lives on the server, not in this repository.

Because `dist/` is swapped in by renaming folders, nginx serves either the old site or the new one, never a mix.

The workflow reads these repository secrets:

| Secret | Holds |
|---|---|
| `DEPLOY_SSH_KEY` | private key of the restricted deploy key |
| `DEPLOY_KNOWN_HOSTS` | the server's host key line, for strict host checking |
| `DEPLOY_USER`, `DEPLOY_HOST` | SSH target |
| `DEPLOY_PORT` | SSH port, 22 when empty |

Deploys never run in parallel (`concurrency: deploy`), and a running deploy is not cancelled by the next push.
