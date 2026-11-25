import { fileURLToPath } from "node:url";

import { loadFlashcards } from "../../config/flashcards.js";

const FLASHCARDS_DIR = fileURLToPath(new URL("../_flashcards/", import.meta.url));

// Every flashcard, with its cards' text as HTML, and the exams, subjects and sources to filter them by.
export default function () {
  return loadFlashcards(FLASHCARDS_DIR);
}
