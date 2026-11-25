# D8 — Flashcards from master CSV files

Taken on 2026-11-23.

Flashcards come from 2 master CSV files in `site/_flashcards/`, one per kind of card: `acronymes.csv` and `questions.csv`. Each file has the header `Importance,Matiere,Front,Back,Extra`. The build files each card under an exam and a subject by its `Matiere`. `site/_flashcards/flashcards.json` lists the core categories every exam shares (Hardware, Software, Réseau), then the exams in display order (Théorie, Pratique). Each exam gives the `Matiere` values of each category, plus its own extra subjects. A value that is not listed fails the build.

`Matiere` alone picks the exam and the subject: Pratique cards take `Pratique` before the subject (`Pratique OS`). The CSV has no exam column.

**Why:** the cards are maintained in 2 spreadsheets, whose `all` tab holds every card. The per-subject tabs exported from them had drifted: they lacked 39 cards. Taking the `all` tab as it is keeps one copy of each card, and updating the site is one export. One file per subject would make adding a subject a single dropped file, but the subject order and the French titles need a list anyway, so adding a subject takes 2 steps either way. An exam column would give a cleaner split, but every row of both spreadsheets would need it, and the header would change. Only the practice rows needed new values.

**Accepted risks:**
- Edits land in 2 large files, which are harder to scan than one small file per subject.
- A new subject needs an entry in `flashcards.json` before its cards build.
- A practice card exported as plain `Pratique` fails the build, until it is given a subject.

**Applied in:** `site/_flashcards/`, `config/csv.js`, `config/flashcards.js`, `site/_data/flashcards.js`.
