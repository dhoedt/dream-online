# Contributing

How the repository is organised, and the rules for writing and changing it.

## Layout

```
README.md                what the site is, how to run, build and deploy it, and a map of the top folders
CONTRIBUTING.md          this file
AGENTS.md                what an AI agent needs on top of this file (CLAUDE.md imports it)
LICENSE                  the licence of the repository (not published)
site/                    the published site
├── index.njk            home page: tabs listing the exercises, lessons and resources
├── lessons/             one page per lesson (.njk)
├── exercises/           one page per exercise (.njk)
├── css/style.css        the only stylesheet, shared by every page
├── js/common.js         helpers shared by the exercises (panels, feedback, wrong fields)
├── js/<topic>.js        logic shared by the lesson and the exercise of one topic (subnet.js)
├── _includes/           layouts/, partials/ and icons/ (not published)
└── _data/               resources.json, build time and commit, derived page data (not published)
eleventy.config.js       11ty config: input, output, filters, shortcodes, collections, copied files
config/                  the code behind the config: asset_url, icon, page kinds, root prefix
package.json             Node version, 11ty dependency, npm scripts
deploy.sh                runs on the server: updates the clone, builds a release, switches to it
.github/workflows/       the deploy workflow
docs/
├── architecture.md      pages, shared code, build and deploy
├── decisions/           one file per decision
├── roadmap.md           planned work, in order
├── eleventy-migration.md the plan for the Eleventy migration
└── ideas.md             ideas not evaluated yet
dist/                    build output, out of git
_site/                   output of npm start, out of git
node_modules/            installed packages, out of git
```

Everything in `site/` is published, except top-level `_`-prefixed folders (`_includes/`, `_data/`); only site files go there. Everything else stays in the repository.

Asset files are published by extension. A new file type needs its extension added in `eleventy.config.js`.

Site paths in the docs (`index.njk`, `js/common.js`, `exercises/…`) are relative to `site/`.

A new file in `docs/` needs a line in the Map section of `README.md`.

## Authority

| Level | Where | Meaning |
|---|---|---|
| Authoritative | `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `docs/architecture.md`, `docs/decisions/` | What is true now. Code follows these files. |
| Supporting | `docs/roadmap.md`, `docs/eleventy-migration.md`, `docs/ideas.md` | Plans and ideas. Never a source of truth. |

When code and docs disagree, fix one of them; do not leave both.

## Core rules

1. **One owner per fact.** Each fact is stated in one file. Other files refer to it instead of repeating it.
2. **Code never cites the docs.** No doc file names or IDs (`D2`) in code or comments. A comment explains the code on its own terms.
3. **Docs hold the present, not the history.** Rewrite the text to the current state; the history lives in git.
4. **Reuse before adding.** Before writing a new helper or style, check `js/common.js`, the topic script and `css/style.css` for one that already does it.

## Pages

### Adding a lesson or an exercise

1. Copy an existing page of the same kind, then set its front matter. The page appears in its home page tab with no other change.

   ```yaml
   ---
   title: Le masque de sous-réseau
   tags: lesson        # or exercise
   order: 1            # position in its tab
   ---
   ```

2. Keep `{% extends "layouts/base.njk" %}`, the `main` block (the `<h1>` and the content) and the `after_main` block (the scripts). The head, the `<title>` and the back link come from the layout.
3. When a lesson and an exercise cover the same topic, put the shared logic in `js/<topic>.js` and link the lesson to its exercise.

A title starting with a proper noun gets a wrong `<title>`, since its first letter is lowercased after "Leçon : " or "Exercice : ".

### Page conventions

- Load CSS and JS through `asset_url`, with a path from the site root: `<script src="{{ 'js/common.js' | asset_url }}"></script>`. It adds the cache-busting version.
- Link to another page with `rootPrefix` and the page's URL: `href="{{ rootPrefix }}exercises/subnet/"`.
- Use `{% icon "name" %}` for an icon from `_includes/icons/`. A new icon is one SVG file there.
- Pages are read as Nunjucks templates. Inline scripts must not contain `{{`, `{%` or `{#`, or must be wrapped in `{% raw %}`. JS template literals (`${…}`) are safe.
- Exercise pages load `js/common.js` and use its hint/answer panels and feedback line.
- Accessibility: icon buttons carry `title` and `aria-label`; tabs and panels use the matching ARIA roles.

### Content

- Teach the manual way, even when a tool offers a shortcut. Students should learn to find resources themselves (for example, download the Windows ISO themselves rather than through Rufus).
- Hints guide without giving the answer.
- Use French typography in content: a non-breaking space before `:`, `;`, `!`, `?` and inside `« »` (`&nbsp;`).

## Decisions

- One file per decision in `docs/decisions/`, following the template below. IDs (`D1`, `D2`…) are stable: never renumber, never reuse.
- `docs/decisions/README.md` lists every decision: ID, title, date, one-line summary.
- A small change is rewritten in place. A reversed decision is deleted and replaced by a new one with a new number; its **Why** may name the old ID.

## Ideas and planned work

- An idea not evaluated yet goes to `docs/ideas.md`, using the template below.
- Once accepted, it becomes an item in `docs/roadmap.md` (with a decision if it is a real choice), and is removed from `ideas.md`.
- Once done, remove the item from `docs/roadmap.md`.

## Writing style

- **Language:** English for docs, code, identifiers and comments. French only in user-visible content.
- **Sentences:** short, plain, active. One idea per sentence.
- **Dates:** absolute (`2026-11-14`), never "yesterday" or "last week".
- **Headings:** sentence case. One `#` title per file, followed by a one-line purpose.
- **File names:** lowercase, kebab-case (`os-install.html`). A folder's index is `README.md`.
- **References:** plain text (`D2`, `docs/architecture.md`, Deploy section). Links only in index files and to external sources.
- **Unverified claims:** mark them as such ("unconfirmed").

## Templates

### Decision

```markdown
# D<n> — <Title>

Taken on YYYY-MM-DD.

<The choice.>

**Why:** <the reason>.

**Accepted risks:** <if any>.

**Applied in:** <the files it changes>.
```

### Idea

```markdown
### <Idea name>

<One-line summary.>

<Concept: options in order of value, constraints, cost.>
```
