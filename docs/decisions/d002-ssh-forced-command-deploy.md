# D2 — Deploy by SSH forced command

Taken on 2026-11-14 (recorded after the fact).

A push to `main` runs a GitHub Actions workflow that connects to the server over SSH. The deploy key is restricted to running `deploy.sh` by a forced command in `authorized_keys`. The server keeps a git clone of the repository and builds the site itself, with Node 22 or later and `npm ci` on every deploy. Each build goes to its own release folder, and a `current` symlink, which nginx serves, is switched to it.

**Why:** it is the simplest pipeline for one server serving static files. If the key leaks, it can only trigger a deploy of what is already on `origin/main`. No container, deploy tool or artifact storage is needed. Release folders make the switch atomic and allow a rollback by pointing `current` at an older release.

**Accepted risks:**
- The server's setup (clone, deploy user, `authorized_keys`, nginx configuration, Node) is done by hand and is not in this repository. Rebuilding the server means redoing it from memory. The Ansible idea in `docs/ideas.md` addresses this.
- Node is installed system-wide from NodeSource's apt repository and must be kept up to date.
- Every deploy needs the npm registry, and third-party packages run under the deploy user.

**Applied in:** `.github/workflows/deploy.yml`, `deploy.sh`, `docs/architecture.md` (Deploy).
