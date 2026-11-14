# Contributing

How the repository is organised, and the rules for writing and changing it.

## Layout

```
README.md                what the site is, how to run, build and deploy it, and a map of the top folders
CONTRIBUTING.md          this file
AGENTS.md                what an AI agent needs on top of this file (CLAUDE.md imports it)
LICENSE                  the licence of the repository (not published)
site/                    the published site
├── index.html           home page: tabs listing the exercises, lessons and resources
├── lessons/             one HTML page per lesson
├── exercises/           one HTML page per exercise
├── css/style.css        the only stylesheet, shared by every page
├── js/common.js         helpers shared by the exercises (panels, feedback, wrong fields)
└── js/<topic>.js        logic shared by the lesson and the exercise of one topic (subnet.js)
build.sh                 builds dist/ from site/ in the last commit
deploy.sh                runs on the server: updates the clone and runs build.sh
.github/workflows/       the deploy workflow
docs/
├── architecture.md      pages, shared code, build and deploy
├── decisions/           one file per decision
├── todo.md              planned work
└── ideas.md             ideas not evaluated yet
dist/                    build output, out of git
```

Everything in `site/` is published; only site files go there. Everything else stays in the repository.

Site paths in the docs (`index.html`, `js/common.js`, `exercises/…`) are relative to `site/`.

A new file in `docs/` needs a line in the Map section of `README.md`.

## Authority

| Level | Where | Meaning |
|---|---|---|
| Authoritative | `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `docs/architecture.md`, `docs/decisions/` | What is true now. Code follows these files. |
| Supporting | `docs/todo.md`, `docs/ideas.md` | Plans and ideas. Never a source of truth. |

When code and docs disagree, fix one of them; do not leave both.

## Core rules

1. **One owner per fact.** Each fact is stated in one file. Other files refer to it instead of repeating it.
2. **Code never cites the docs.** No doc file names or IDs (`D2`) in code or comments. A comment explains the code on its own terms.
3. **Docs hold the present, not the history.** Rewrite the text to the current state; the history lives in git.
4. **Reuse before adding.** Before writing a new helper or style, check `js/common.js`, the topic script and `css/style.css` for one that already does it.

## Pages

### Adding a lesson or an exercise

1. Copy an existing page of the same kind, so the head, back link and structure stay the same.
2. Link it from the matching tab in `index.html`.
3. When a lesson and an exercise cover the same topic, put the shared logic in `js/<topic>.js` and link the lesson to its exercise.

### Page conventions

- `lang="fr"`, the viewport meta, `../css/style.css`, and the empty favicon (`<link rel="icon" href="data:,">`).
- Reference CSS and JS with relative paths in double or single quotes. The cache busting in `build.sh` matches them that way.
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
- Once accepted, it becomes an item in `docs/todo.md` (with a decision if it is a real choice), and is removed from `ideas.md`.
- Once done, remove the item from `docs/todo.md`.

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
