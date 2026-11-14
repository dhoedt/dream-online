# D2 — Deploy by SSH forced command

Taken on 2026-11-14 (recorded after the fact).

A push to `main` runs a GitHub Actions workflow that connects to the server over SSH. The deploy key is restricted to running `deploy.sh` by a forced command in `authorized_keys`. The server keeps a git clone of the repository, builds the site itself, and nginx serves the result.

**Why:** it is the simplest pipeline for one server serving static files. If the key leaks, it can only trigger a deploy of what is already on `origin/main`. No container, deploy tool or artifact storage is needed.

**Accepted risks:** the server's setup (clone, deploy user, `authorized_keys`, nginx configuration) is done by hand and is not in this repository. Rebuilding the server means redoing it from memory. The Ansible idea in `docs/ideas.md` addresses this.

**Applied in:** `.github/workflows/deploy.yml`, `deploy.sh`, `docs/architecture.md` (Deploy).
