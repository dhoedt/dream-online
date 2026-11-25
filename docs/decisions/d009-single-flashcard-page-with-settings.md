# D9 — One flashcard page with settings

Taken on 2026-11-25.

All flashcards are on one page, `flashcards/`. Before studying, the student sets which cards to study on a settings screen. The settings are grouped by exam (Théorie, Pratique), with the core categories first (Hardware, Software, Réseau) and the exam's own subjects next to them. A checkbox toggles a whole exam. The settings also cover the card type (Acronymes, Questions) for all exams and shuffling, which is on by default. They are kept in `localStorage`.

**Why:** one page per subject and source gave many small decks. A student who wanted to revise all of Hardware, or a whole exam, had to go through several of them. One page with filters covers any mix of exams, subjects and types. Keeping the settings saves picking them again on every visit. Progress is still not saved, so the settings hold no study state.

The settings leave out a card limit, a reverse mode, an automatic repeat of the cards to review, and an `Importance` filter. A card limit or an automatic repeat matters little while progress is not saved. Reverse mode does not suit question cards.

**Accepted risks:**
- Every card is written into one page, which grows with the cards. With about 200 cards, the page stays small.
- The settings are kept per browser: a student on another device starts with everything checked.

**Applied in:** `site/flashcards.njk`, `site/index.njk`, `config/flashcards.js`, `config/page-kinds.js`, `site/_data/eleventyComputed.js`, `site/css/style.css`.
