# Cours d'informatique - DYL

A static website with computer-science lessons and interactive exercises for students, in French.
Topics so far: subnet masks, the OSI model, installing an operating system, Windows 11 recovery options.

The site is static: plain HTML, CSS and JavaScript, with no framework and no server-side code. The build may use tools with a package manager (D6); none is in use yet.

## Run

Open `site/index.html` in a browser. Every page works straight from the file system as long as no page is generated at build time.

## Build

```
sh build.sh      # builds the deployable site in dist/ from site/ in the last commit
```

The build uses `git archive HEAD:site`, so uncommitted changes are not included.
It adds cache-busting versions to CSS/JS references and writes the build time in the home page footer.

## Deploy

A push to `main` deploys the site. The flow is in `docs/architecture.md` (Deploy).

## Map

The rules for each folder are in `CONTRIBUTING.md`.

- [site/](site/): the published site, and nothing else.
  - [index.html](site/index.html): home page, with the Exercices, Leçons and Ressources tabs.
  - [lessons/](site/lessons/): one page per lesson.
  - [exercises/](site/exercises/): one page per exercise.
  - [css/](site/css/), [js/](site/js/): shared style and scripts.
- [docs/architecture.md](docs/architecture.md): pages, shared code, build and deploy.
- [docs/decisions/](docs/decisions/README.md): what was chosen and why.
- [docs/roadmap.md](docs/roadmap.md): planned work, in order.
- [docs/ideas.md](docs/ideas.md): ideas not evaluated yet.
- [docs/eleventy-migration.md](docs/eleventy-migration.md): the plan for moving the site to Eleventy.
