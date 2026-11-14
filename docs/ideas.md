# Ideas

Ideas that have not been evaluated yet. Template and lifecycle in `CONTRIBUTING.md`.

## Ideas

### Server setup with Ansible

Describe the server's setup in an Ansible playbook, so the server can be rebuilt reproducibly.

Today the server is set up by hand: packages, deploy user, the repository clone, the forced command in `authorized_keys` (D2), the nginx site configuration and TLS. None of it is in this repository. A playbook would make it reviewable and repeatable.

**Options, in order of value:**

1. **Documented setup script.** A shell script in the repository that runs the setup steps once. It is the cheapest option for one server and needs no new tool.
2. **Ansible playbook.** It runs over SSH and installs nothing on the server. It describes the desired state, so running it again is safe. It is worth it once there are several servers, or other apps on the same one.

**Cost:** learning Ansible, and keeping the playbook in sync with any manual change made on the server.

### Docker image for the site

Ship the site as a Docker image (an nginx image with `dist/` inside) instead of building it on the server.

**Value:** the same image runs locally and on the server, and the nginx configuration lives in the repository. It would fit if the server starts hosting other Docker apps, behind a shared reverse proxy.

**Constraints:** it adds an image registry (or a build on the server), a container runtime on the server, and a new deploy flow replacing D2. For one static site the current pipeline is simpler.
