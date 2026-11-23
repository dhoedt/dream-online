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

### Flashcard decks from CSV files

Publish flashcard decks on the site: dropping a CSV file into `flashcards/` generates the deck page and its entry on the home page. This needs the Eleventy migration (`docs/eleventy-migration.md`) first.

**Options, in order of value:**

1. **11ty data file.** `_data/decks.js` reads every `flashcards/*.csv` with `csv-parse`, checks it and sorts the decks by title. A paginated template writes one page per deck. Parsing, checks, title and order stay in one place.
2. **11ty custom data format.** Registering CSV with `addDataExtension` also works, but it splits these rules across the config and the template.

**Constraints, from a review on 2026-11-23:**
- **Existing files.** `flashcards/` holds 10 files from the old app: 4 "QR" decks, 4 "Acronymes" decks and 2 `... - all.csv` aggregates. They have no header row. Their names have spaces, brackets and accents. Every answer ends with `<br><hr><i></i>`.
- **Header and separator.** A header row is required. The separator is read from it: `;` if present, otherwise `,`. A French Excel saves with `;` (unconfirmed).
- **Encoding.** UTF-8, with a leading BOM stripped. Text containing U+FFFD fails the build, since it means the file was saved as Windows-1252.
- **Plain text.** Card text is plain text. The old app's trailer is stripped after parsing, and each field is escaped once, in the template.
- **Bad files.** A missing header, an unknown column or an empty question or answer fails the build, naming the file and the line.
- **Titles.** A kebab-case file name cannot hold a French title. The options are deck files exempt from kebab-case, or a title inside the file or in a mapping file.
- **Not defined yet:**
  - the deck page's behaviour: flip, navigation, progress, shuffle, known cards
  - which 3 decks come first
  - where the decks sit on the home page
  - whether they replace the link to the external flashcards app

**Cost:** about 1 day on top of the migration, depending on the deck page's behaviour.

### Docker image for the site

Ship the site as a Docker image (an nginx image with `dist/` inside) instead of building it on the server.

**Value:** the same image runs locally and on the server, and the nginx configuration lives in the repository. It would fit if the server starts hosting other Docker apps, behind a shared reverse proxy.

**Constraints:** it adds an image registry (or a build on the server), a container runtime on the server, and a new deploy flow replacing D2. For one static site the current pipeline is simpler.
