# Cours d'informatique - DYL

A static website with computer-science lessons and interactive exercises for students, in French.
Topics so far: subnet masks, the OSI model, installing an operating system, Windows 11 recovery options, plus flashcards for 2 exams, theory and practice, on hardware, software and networking, with keyboard shortcuts in practice.

The site is static: plain HTML, CSS and JavaScript, with no framework and no server-side code. It is built with Eleventy (11ty), installed with npm (D7). Node 22 or later is needed.

## Run

Pages are templates, so they do not open from disk. Run 11ty's dev server, with live reload:

```
npm install      # once, and after each dependency change
npm start        # serves the site from _site/, at the URL it prints
```

AI agents never run the app: no `npm start` and no other server. The user runs it.

## Build

```
npm run build    # builds the deployable site in dist/ from the working tree
```

The build includes uncommitted changes, with no warning.
It adds cache-busting versions to CSS/JS references and writes the build time and commit in the home page footer.
It does not empty `dist/`: delete the folder first to drop files from earlier builds.

## Deploy

A push to `main` deploys the site. The flow, the server layout and the rollback are in `docs/architecture.md` (Deploy).

## Map

The rules for each folder are in `CONTRIBUTING.md`.

- [site/](site/): the published site, and nothing else.
  - [index.njk](site/index.njk): home page, with the Exercices, Leçons, Flashcards and Ressources tabs.
  - [_includes/](site/_includes/), [_data/](site/_data/): layout, partials, icons and data (not published).
  - [_flashcards/](site/_flashcards/): the flashcard CSV files and their exams and subjects (not published).
  - [lessons/](site/lessons/): one page per lesson.
  - [exercises/](site/exercises/): one page per exercise.
  - [flashcards.njk](site/flashcards.njk): the flashcards page, with its settings screen.
  - [css/](site/css/), [js/](site/js/): shared style and scripts.
- [eleventy.config.js](eleventy.config.js), [config/](config/): the 11ty build.
- [docs/architecture.md](docs/architecture.md): pages, shared code, build and deploy.
- [docs/decisions/](docs/decisions/README.md): what was chosen and why.
- [docs/roadmap.md](docs/roadmap.md): planned work, in order.
- [docs/ideas.md](docs/ideas.md): ideas not evaluated yet.
- [docs/eleventy-migration.md](docs/eleventy-migration.md): the plan for moving the site to Eleventy.
