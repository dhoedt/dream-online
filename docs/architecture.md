# Architecture

How the site is built: pages, shared code, build and deploy.

## Pages

- Pages are Nunjucks templates (`.njk`). Each one extends `_includes/layouts/base.njk` and fills its `main` block, plus `after_main` for the footer and scripts.
- A page's URL follows its path: `lessons/subnet.njk` becomes `lessons/subnet/` (`lessons/subnet/index.html`).
- The home page (`index.njk`) lists the content in four tabs: Exercices, Leçons, Flashcards, Ressources. The active tab is kept in the URL hash (`#lessons`), so it survives the back button.
  - Leçons and Exercices are generated from the `lessons` and `exercises` collections: the pages tagged `lesson` or `exercise`, sorted by `order`.
  - Flashcards links to the flashcards page, with the card count from `_data/flashcards.js` (Flashcards).
  - Ressources is generated from `_data/resources.json`.
  - The footer shows the build time, in Belgian time, and the short SHA of `HEAD`, from `_data/build.js`. The SHA matches the release folder's name on the server.
- Each lesson, exercise and the flashcards page is a standalone page with its own inline script. Pages do not load each other.
- Exercise data (questions, accepted answers, hints) lives in the page's inline script.

### What the layout derives

From a page's front matter (`title`, `tags`, `order`), `_data/eleventyComputed.js` and `config/page-kinds.js` derive:

| Value | Lesson | Exercise | Flashcards | Home page |
|---|---|---|---|---|
| `<title>` | "Leçon : " + title | "Exercice : " + title | the title | the title |
| Back link | "Leçons", to the home page's `#lessons` tab | "Accueil", to the home page | "Accueil", to the home page's `#flashcards` tab | none |

After the prefix, the title's first letter is lowercased, unless the title starts with 2 capitals, like an acronym ("OSI").

`rootPrefix` is `../` once per folder between the page and the site root (`../../` for `lessons/subnet/`). Links between pages start with it, so they stay relative.

### Flashcards

The cards come from 2 master CSV files in `_flashcards/` (D8), which is not published:

| File | Holds |
|---|---|
| `acronymes.csv`, `questions.csv` | the cards, with the header `Importance,Matiere,Front,Back,Extra` |
| `flashcards.json` | `sources`: each CSV file, with its id and title (a card type). `categories`: the core categories every exam shares (Hardware, Software, Réseau), with their id and title. `exams`: the exams in display order (Théorie, Pratique), each with its id, title, the `Matiere` values of each category, and `extras`: the exam's own subjects, each with an id, a title and its `Matiere` values |

`_data/flashcards.js` loads them through `config/flashcards.js`, which parses with `config/csv.js`:

- **Subjects.** An exam's subjects are the core categories, in their listed order, then its extras. A subject's id is prefixed with its exam's id (`pratique-hardware`). `Matiere` picks a card's subject. Cards are sorted by exam, then by subject, then by source. Each subject and source has its card count. A card also carries its origin, "Pratique · Réseau".
- **Format.** UTF-8, with a leading BOM stripped. The separator is `;` if the header line holds one, `,` otherwise. Standard CSV quoting.
- **Card text.** `Front`, `Back` and `Extra` are escaped, then `<br>` and line breaks give `<br>`, `<b>` gives `<strong>`, and `` `text` `` gives `<code>`. `Importance` is not used.
- **Checks.** Rows with no `Front`, `Back` and `Extra` are skipped. These fail the build, naming the file and the line: text with U+FFFD (a file saved as Windows-1252), a quote not closed, a header that is not exactly the 5 columns, a row with another number of fields, an empty `Front` or `Back`, a `Matiere` not in `flashcards.json`, a category in an exam that is not in `categories`, a `Front` repeated in a subject of one source, any other markup, or a backtick not closed.

`flashcards.njk` is one page at `flashcards/`, tagged `flashcards` (D9). Every card is written into the page as a hidden list, with its subject and source, so the page needs no request. Its inline script has 2 screens.

The settings screen comes first:

- One box per exam: its core categories, then its extras, set apart. A checkbox in the box's legend checks or unchecks the whole exam; it shows a mixed state when only some subjects are checked. A subject with no card is disabled.
- "Type de cartes": one checkbox per source.
- "Mélanger les cartes", checked by default.
- "Commencer" starts the series: the cards whose subject and source are both checked. The count of matching cards is shown next to it. With none, the button is disabled.
- The settings are saved in `localStorage` on every change and restored on the next visit. Unchecked subjects and sources are saved, so a new subject starts checked. Without storage, they last for the visit.

The study screen shows one card at a time, with its origin above it:

- "Afficher la réponse" (or Space) shows the back and `Extra`. "À revoir" (←) or "Je savais" (→) moves to the next card.
- At the end of a pass, a summary gives the score and offers a new pass over the cards to review, a restart of the series, or the settings.
- "Réglages" goes back to the settings. The restart button restarts the series, shuffled again when "Mélanger" is on.
- Progress is not saved.

`npm start` watches `_flashcards/`: a changed CSV file rebuilds the site.

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
3. Asset files are copied by extension (`css`, `js`, `png`, `jpg`, `svg`, `webp`, `ico`). Top-level `_`-prefixed folders (`_includes/`, `_data/`, `_flashcards/`) are not published.

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
