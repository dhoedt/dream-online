# Agents

Working notes for AI coding agents. The rules for people and agents are in `CONTRIBUTING.md`; this file adds only what an agent needs on top.

## Before you start

- Read `CONTRIBUTING.md` before changing any page or doc, or adding any file.
- `docs/architecture.md` and `docs/decisions/` are the source of truth. `docs/todo.md` and `docs/ideas.md` are plans, never the spec.

## Where to start

| Task | Read first |
|---|---|
| Add or change a lesson or an exercise | `CONTRIBUTING.md` (Pages), then an existing page of the same kind |
| Change shared behaviour or style | `docs/architecture.md` (Shared code), then `js/common.js` or `css/style.css` |
| Change the build or the deploy | `docs/architecture.md` (Build, Deploy), then D2 and D3 |
| Make a choice | `docs/decisions/README.md`, then add one file (next free ID) |
| Pick up planned work | `docs/todo.md` |

## Commands

The commands are in `README.md`. On top of them:

- Ask before running the build or any other verification.
- Never run `deploy.sh`. It resets the clone it runs in to `origin/main`, which discards local changes.

## Hard limits

- Content is checked for factual accuracy: lessons are teaching material. Mark anything unverified and ask.
- Everything in `site/` is published; only site files go there.
- No git unless the user asks. That includes read-only use: no `git log`, `show`, `diff`, `blame` or `status` to gather information.
