# Eleventy migration plan

How the existing site moves to Eleventy (11ty). Written on 2026-11-23; nothing in it is implemented yet. The choice of 11ty is D7.

## Scope

The plan covers the 6 existing pages, the shared code, the build and the deploy. It adds no new feature.

Flashcard decks from CSV files come after the migration and are not part of it; see `docs/ideas.md`.

The plan also leaves out end-to-end tests and deploying only a tested commit, as ecoreno-max does. Each push to `main` still deploys the latest `main`, and the checks in each step are made by hand.

The migration has two steps, each one shipped on its own:

1. **Switch.** 11ty builds the site with the pages unchanged. The built `dist/` is the same as today.
2. **Layouts and partials.** The pages move to a shared layout, icon partials and a generated home page listing.

## Step 1: switch

Step 1 also moves the server to release folders; see [Releases](#releases).

### Layout, URLs and copied files

These follow the working 11ty setup in another project of the same owner (ecoreno-max).

1. **Folders inside `site/`.** Layouts and partials go to `site/_includes/`, data to `site/_data/`. This is the layout the 11ty docs describe, and 11ty does not publish either folder. D5 is reworded to "everything in `site/` is published, except `_`-prefixed folders and 11ty data files".
2. **Permalink.** By default, 11ty writes `lessons/subnet.html` to `lessons/subnet/index.html`, which breaks the relative links. `index.html` is not affected, since 11ty already writes it to `index.html`.
   - Each page folder gets a directory data file named after it: `site/lessons/lessons.11tydata.js` and `site/exercises/exercises.11tydata.js`. This is the pattern the 11ty docs describe, and ecoreno-max uses it (`pages/pages.11tydata.js`).
   - Both files import one shared function from `config/permalink.js`, `(data) => data.page.filePathStem + ".html"`, so the rule is written once.
   - A new page folder gets the same one-line data file.
3. **Passthrough copy.** An extension allow-list, `site/**/*.{css,js,png,jpg,svg,webp,ico}`, keeps the output paths (`site/css/style.css` becomes `css/style.css`).
   - New folders are published with no config change. A new file type needs one line.
   - The glob must exclude `_`-prefixed folders and `*.11tydata.js`, since both would otherwise match `*.js`.
   - ecoreno-max lists folders instead. The allow-list is kept here because it fits D5: a new folder in `site/` is published without a hand-kept list.

### Pages

11ty passes plain `.html` files without front matter through Liquid unchanged. No page in `site/` contains `{{`, `{%` or `{#`, so none is misread. In this step, the pages are not edited and still open from disk.

### Folders and files

| Path | Holds | Published |
|---|---|---|
| `site/` | 11ty input: the pages, `css/`, `js/` | yes, as today |
| `site/_includes/`, `site/_data/` | layouts, partials and data (step 2) | no |
| `site/lessons/lessons.11tydata.js`, `site/exercises/exercises.11tydata.js` | the permalink for each page folder | no |
| `config/permalink.js` | the shared permalink function | no |
| `eleventy.config.js`, `package.json`, `package-lock.json` | config and dependencies | no |
| `dist/` | local build output | no, ignored by git; on the server, releases are served instead (see [Releases](#releases)) |
| `_site/` | output of `npm start`, so the dev server never writes into `dist/` | no, ignored by git |
| `node_modules/` | installed packages | no, ignored by git |

The config is ESM. `eleventy.config.js` needs `"type": "module"` in `package.json`; without it, name the file `eleventy.config.mjs`. Folders are set with `export const config` (11ty v3).

`package.json`, as in ecoreno-max:
- `"engines": { "node": ">=22" }`.
- 11ty as a devDependency.
- Scripts: `npm start` runs `eleventy --serve --output=_site`; `npm run build` runs `eleventy`, whose output is set to `dist/` in the config.

### Cache busting and build time

In step 1, both keep the current pass, run on 11ty's output. `build.sh` becomes `build.sh [output folder]`, with `dist/` as the default:
1. It empties the output folder, since 11ty does not clean it.
2. It runs 11ty into the folder.
3. It runs the cache-busting and build-time pass.

`git hash-object` hashes content, and passthrough copies are byte-identical, so the versions do not change. The `<!-- build-time -->` marker stays in `index.html`. Step 2 moves both into 11ty.

The footer also shows the deployed commit, the short SHA from `git rev-parse --short HEAD`: "build: 23/11/2026 à 14:05 · b614aa2". It matches the release folder's name, so the live site can be traced to its release. A local build with uncommitted changes shows the SHA of `HEAD`, without those changes.

### Check

Build the site with the current `build.sh` and with the new one, then compare the two `dist/` folders. They should match, except for the build time.

## Step 2: layouts and partials

- **One layout for the head.** Each page repeats about 6 lines: charset, viewport, the stylesheet link, empty favicon.
  - The layout builds asset paths from a per-page relative prefix: empty for the home page, `../` for the others. It comes from front matter or is computed from the page's depth.
  - Root-absolute paths (`/css/…`) are not an option, since they would stop `dist/` from opening from disk.
- **Back link.** The layout adds it from a front matter target: `../index.html` on exercises, `../index.html#lessons` on lessons, none on the home page.
- **Template language.** The pages move to Nunjucks, the same language as ecoreno-max.
  - They are renamed from `.html` to `.njk`, and the config sets `templateFormats: ["njk"]`.
  - URLs keep `.html`, through the permalink function.
  - In step 1, the pages stay `.html` and are read by Liquid, 11ty's default for HTML.
- **Layouts folder.** Layouts go to `site/_includes/layouts/`, and partials such as the back link to `site/_includes/partials/`.
- **Icon shortcode.** The exercise icons (restart, hint, answer) are copied into every page today: 5 to 6 static inline SVGs per exercise (`recovery.html` 5, `osi.html` 5, `subnet.html` 6).
  - Each icon becomes one SVG file in `site/_includes/icons/`.
  - `{% icon "restart" %}` inlines it, as ecoreno-max's `icon` shortcode does.
  - An unknown name fails the build.
  - No icon package is added, since the icons are the site's own.
- **Generated listing.**
  - The Leçons and Exercices tabs are built from each page's front matter, with collections tagged `lesson` and `exercise`.
  - The Ressources links move to `site/_data/resources.json`: title, URL and host for each link, including the link to the external flashcards app. The tab is generated from it.
  - Adding a page then no longer needs a link in `index.html` (step 2 of "Adding a lesson or an exercise" in `CONTRIBUTING.md`).
- **Page front matter.** Three fields; everything else is derived. The body stays as it is, including the `<h1>` and the inline scripts.

  ```yaml
  ---
  title: Le masque de sous-réseau
  tags: lesson        # or exercise
  order: 1            # position in its tab
  ---
  ```

  - **List entry.** The title, as shown in the tab today.
  - **`<title>`.** "Leçon : " or "Exercice : " from the tag, then the title with its first letter in lowercase: "Exercice : le masque de sous-réseau". This matches the 5 current pages. A title that starts with a proper noun would be lowercased wrongly; none does today.
  - **Back link.** `../index.html#lessons` for lessons, `../index.html` for exercises.
- **Cache busting.** An `asset_url` filter replaces the `build.sh` pass, as in ecoreno-max.
  - It appends `?v=<hash>`: the first 10 hex characters of the file's SHA-256, so the version still changes only when the content does.
  - A missing file fails the build.
  - Unlike ecoreno-max, the links are relative (`../css/style.css`), so the filter resolves the path from the page's folder.
  - D3 is rewritten in place. Its principle, a content hash, is unchanged.
- **Build time and commit.** A data file, `site/_data/build.js`, provides both, and the `<!-- build-time -->` marker goes away.
  - `Intl.DateTimeFormat` needs `timeZoneName: 'longOffset'` to produce the offset in the `datetime` attribute.
  - The "à" in the label is added by hand.
- **`build.sh` removed.** With both passes in 11ty, `npm run build` is the whole build, and `deploy.sh` calls it directly.
- **Source pages.** Once a page uses the layout, it no longer opens from disk. Day-to-day work uses `npm start`.
- **Live Server.** Its setup is removed from `.vscode/settings.json`.

### Check

Compare the new `dist/` with the one from step 1. The differences should be limited to whitespace and the order of attributes. Check each page in a browser: tabs, back links, icons, exercises.

## Build and deploy

The site is still built on the server (option A), so D2 holds: a leaked key can only deploy what is already on `origin/main`.

- **Node on the server.** Version 22 or later, installed by hand on the dream-online server. It is a different server from ecoreno-max's, so Node is not there yet. This adds to D2's accepted risks.
  - It comes from NodeSource's apt repository for Node 22, installed system-wide and updated with `apt`.
  - The forced command then finds `node` and `npm` on the default `PATH`, with no shell setup.
  - The exact setup commands come from NodeSource's current instructions (unconfirmed here).
- **Checks.** `deploy.sh` first checks that `git`, `node`, `npm` and `flock` are installed, and stops otherwise.
- **Where the build runs.** `build.sh` builds the working tree, in the clone. `git archive HEAD:site` is no longer used, since the build needs the root files too.
  - On the server, `deploy.sh` has already reset the tree to `origin/main`, so what is deployed is always the commit. This is where "committed content only" holds.
  - Locally, the build includes uncommitted changes, with no warning, as in ecoreno-max. `README.md` (Build) changes to match.
- **Packages.**
  - `deploy.sh` runs `npm ci --include=dev --engine-strict --no-audit --no-fund` on every deploy.
  - `--include=dev` installs 11ty even if `NODE_ENV=production`. `--engine-strict` refuses a Node version that does not match `engines`.
  - Every deploy needs the npm registry.
  - Third-party packages run under the deploy user.
- **`.gitignore`.** Add `/node_modules/` and `/_site/`.

### Releases

`deploy.sh` publishes the site through release folders and a symlink, as ecoreno-max does. This replaces the `dist.tmp/` swap.

Layout on the server, under one deploy root, as in ecoreno-max:

| Path | Holds |
|---|---|
| `repo/` | the clone: git checkout of the deployed commit; keeps `node_modules/` between deploys |
| `releases/<date>-<sha>/` | one built site per deploy; the 5 newest are kept |
| `current` | symlink to the live release, and nginx's root |
| `deploy.lock` | the `flock` lock file |

The build output no longer lives inside the clone.

One-time server changes:
1. Move the existing clone into `repo/` under the deploy root.
2. Update the forced command's path to `repo/deploy.sh` in `authorized_keys`.
3. Point nginx's root at `current`.

The deploy root's path is set in `deploy.sh`, and can be overridden by an environment variable in the forced command, as ecoreno-max's `DEPLOY_ROOT`.

Each deploy:
1. Takes a lock with `flock`, so only one deploy runs at a time. `concurrency: deploy` in the workflow already prevents parallel runs; the lock also covers a deploy started by hand.
2. Resets the clone to `origin/main` and runs `npm ci`.
3. Builds into a new `releases/<date>-<sha>/`: `build.sh` in step 1, `npm run build -- --output=…` in step 2. If the build fails, the half-written release is removed and the live site is untouched.
4. Points a temporary symlink at the release, then renames it over `current` (`mv -T`). The rename is atomic, so nginx serves either the old site or the new one, never a mix.
5. Removes the oldest releases, keeping the 5 newest.

Rollback: point `current` at a previous release, `ln -sfn <release> current.tmp && mv -T current.tmp current`.

Locally, `dist/` stays the build output.

Building in GitHub Actions and uploading the result (option B) was rejected. The forced command would have to accept an upload, so a leaked key could publish any content, which would weaken D2.

## Decisions and docs

These change when each step is implemented, not before:

| Decision | Step | Change |
|---|---|---|
| D2 | 1 | rewritten in place: Node 22 or later on the server, `npm ci` on every deploy, release folders and the `current` symlink; the forced command is unchanged |
| D3 | 1, 2 | step 1: "Applied in" only, since the pass runs on 11ty's output; step 2: rewritten in place for the `asset_url` filter |
| D5 | 1 | rewritten in place: the build runs 11ty on `site/` instead of extracting it; `_`-prefixed folders and 11ty data files in `site/` are not published |
| D7 | 1, 2 | "Applied in" filled in |

Docs:

| Step | Changes |
|---|---|
| 1 | `README.md` (intro, Build, Deploy, Map), `CONTRIBUTING.md` (Layout, Pages: the data file for each page folder), `docs/architecture.md` (Build, Deploy, including the server layout and rollback), `AGENTS.md` (commands, Hard limits) |
| 2 | `README.md` (Run, Build), `CONTRIBUTING.md` (Layout, Pages, Page conventions), `docs/architecture.md` (Pages, Shared code, Build) |

## Risks

- **Opening from disk.** After step 2, source pages no longer open from disk. The built `dist/` should still open from disk, since paths stay relative and URLs keep `.html` (unconfirmed).
- **Upkeep.** The Node version and the 11ty dependency need maintaining.
- **Inline scripts.** Pages are read by a template engine: Liquid in step 1, Nunjucks from step 2. Each new inline script must avoid `{{`, `{%` and `{#`, or be wrapped in `{% raw %}`. JS template literals (`${…}`) are safe.
- **New page folders.** A new folder of pages without its `.11tydata.js` file gets `<name>/index.html` URLs, which break its relative links. `CONTRIBUTING.md` (Pages) states the rule.

## Effort

Rough estimates, not measurements:

| Task | Step | Time |
|---|---|---|
| Setup: config, package, permalink data files | 1 | 1 to 2 h |
| `build.sh`, `.gitignore`, Node on the server | 1 | 2 to 3 h |
| `deploy.sh` with releases, nginx root | 1 | 1 to 2 h |
| Layout, partials, icon shortcode, front matter for 6 pages, generated listing | 2 | 3 to 5 h |
| `asset_url` filter, build time, removing `build.sh` | 2 | 1 to 2 h |
| Docs and decision records | 1, 2 | 1 to 2 h |

Total: about 1.5 to 2 days.
