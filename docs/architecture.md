# Architecture

How the site is built: pages, shared code, build and deploy.

## Pages

- Pages are Nunjucks templates (`.njk`). Each one extends `_includes/layouts/base.njk` and fills its `main` block, plus `after_main` for the footer and scripts.
- A page's URL follows its path: `lessons/subnet.njk` becomes `lessons/subnet/` (`lessons/subnet/index.html`).
- The home page (`index.njk`) lists the content in three tabs: Exercices, Leçons, Ressources. The active tab is kept in the URL hash (`#lessons`), so it survives the back button.
  - Leçons and Exercices are generated from the `lessons` and `exercises` collections: the pages tagged `lesson` or `exercise`, sorted by `order`.
  - Ressources is generated from `_data/resources.json`.
  - The footer shows the build time, in Belgian time, and the short SHA of `HEAD`, from `_data/build.js`. The SHA matches the release folder's name on the server.
- Each lesson and exercise is a standalone page with its own inline script. Pages do not load each other.
- Exercise data (questions, accepted answers, hints) lives in the page's inline script.

### What the layout derives

From a page's front matter (`title`, `tags`, `order`), `_data/eleventyComputed.js` and `config/page-kinds.js` derive:

| Value | Lesson | Exercise | Home page |
|---|---|---|---|
| `<title>` | "Leçon : " + title, first letter lowercased | "Exercice : " + title, first letter lowercased | the title |
| Back link | "Leçons", to the home page's `#lessons` tab | "Accueil", to the home page | none |

`rootPrefix` is `../` once per folder between the page and the site root (`../../` for `lessons/subnet/`). Links between pages start with it, so they stay relative.

## Shared code

| File | Used by | Holds |
|---|---|---|
| `css/style.css` | every page | the whole style |
| `js/common.js` | exercises | hint/answer panels (one open at a time), feedback line, wrong-field marking |
| `js/subnet.js` | subnet lesson and exercise | subnet calculations and their rendering |
| `_includes/layouts/base.njk` | every page | the head and the back link |
| `_includes/partials/` | the layout, the home page | the back link, one home page tab |
| `_includes/icons/` | pages, through `{% icon "name" %}` | one SVG file per icon |

Scripts are plain `<script>` files, not modules (D6).

The `icon` shortcode (`config/icon.js`) inlines `_includes/icons/<name>.svg`. A second argument adds attributes to the `<svg>` tag: `{% icon "eye", 'class="icon-closed"' %}`. An unknown name fails the build.

## Build

Eleventy (11ty) builds the site from `site/`, in the working tree. `npm run build` runs the whole build, into `dist/` (`eleventy.config.js`):

1. Pages are rendered with Nunjucks.
2. Cache busting: the `asset_url` filter (`config/asset-url.js`) turns a path from the site root (`'js/common.js'`) into a path from the page, with `?v=<first 10 hex characters of the file's SHA-256>` appended. A file's version changes only when its content does. A missing file fails the build.
3. Asset files are copied by extension (`css`, `js`, `png`, `jpg`, `svg`, `webp`, `ico`). Top-level `_`-prefixed folders (`_includes/`, `_data/`) are not published.

11ty does not empty its output folder, so a local `dist/` keeps files from earlier builds. A release on the server starts empty.

A local build includes uncommitted changes; the SHA is still the one of `HEAD`.

`npm start` runs 11ty's dev server into `_site/`, so it never writes into `dist/`.

## Deploy

1. A push to `main` (or a manual run) starts `.github/workflows/deploy.yml`.
2. The workflow opens an SSH connection to the server. It sends no command: the key is restricted to `deploy.sh` by a forced command in the server's `authorized_keys`.
3. `deploy.sh` checks that `git`, `node`, `npm` and `flock` are installed, and takes a lock so only one deploy runs at a time.
4. It resets the clone to `origin/main` and runs `npm ci`.
5. It runs `npm run build -- --output=<release folder>`. If the build fails, the release is removed and the live site is untouched.
6. It points a temporary symlink at the release and renames it over `current` (`mv -T`). The rename is atomic, so nginx serves either the old site or the new one, never a mix.
7. It removes the oldest releases, keeping the 5 newest.

nginx serves `current` as static files. Its configuration lives on the server, not in this repository.

### Server layout

Under one deploy root, the parent of the clone by default (the `DEPLOY_ROOT` environment variable overrides it):

| Path | Holds |
|---|---|
| `repo/` | the clone, with `node_modules/` kept between deploys; the forced command runs `repo/deploy.sh` |
| `releases/<date>-<sha>/` | one built site per deploy; the 5 newest are kept |
| `current` | symlink to the live release, and nginx's root |
| `deploy.lock` | the lock file |

Node 22 or later is installed system-wide from NodeSource's apt repository, so the forced command finds `node` and `npm` on the default `PATH`.

### Rollback

Point `current` at a previous release, from the deploy root:

```
ln -sfn releases/<release> current.tmp && mv -T current.tmp current
```

The next deploy switches `current` to the new release again.

The workflow reads these repository secrets:

| Secret | Holds |
|---|---|
| `DEPLOY_SSH_KEY` | private key of the restricted deploy key |
| `DEPLOY_KNOWN_HOSTS` | the server's host key line, for strict host checking |
| `DEPLOY_USER`, `DEPLOY_HOST` | SSH target |
| `DEPLOY_PORT` | SSH port, 22 when empty |

Deploys never run in parallel (`concurrency: deploy`), and a running deploy is not cancelled by the next push.
