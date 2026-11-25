import { readFileSync } from "node:fs";
import path from "node:path";

import { parseCsv } from "./csv.js";

const COLUMNS = ["Importance", "Matiere", "Front", "Back", "Extra"];
const CARD_TEXT_COLUMNS = ["Front", "Back", "Extra"];

// The only markup allowed in card text, besides `code` between backticks.
const ALLOWED_TAG = /<br\s*\/?>|<\/?b>/gi;
const ANY_TAG = /<[a-z!\/][^>]*>/i;

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

// Card text as HTML: escaped, then line breaks, bold and `code` rendered.
function renderCardText(text, location) {
  const unknownTag = text.replace(ALLOWED_TAG, "").match(ANY_TAG);
  if (unknownTag) {
    throw new Error(`${location}: markup not allowed in card text: ${unknownTag[0]}`);
  }
  if ((text.match(/`/g) ?? []).length % 2 !== 0) {
    throw new Error(`${location}: a backtick is not closed`);
  }
  return escapeHtml(text.trim())
    .replace(/&lt;br\s*\/?&gt;|\r?\n/gi, "<br>")
    .replace(/&lt;b&gt;/gi, "<strong>")
    .replace(/&lt;\/b&gt;/gi, "</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function readSourceRows(file) {
  const text = readFileSync(file, "utf8").replace(/^﻿/, "");
  if (text.includes("�")) {
    throw new Error(`${file}: not valid UTF-8 (saved as Windows-1252?)`);
  }
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const separator = firstLine.includes(";") ? ";" : ",";
  try {
    return parseCsv(text, separator);
  } catch (error) {
    throw new Error(`${file}, ${error.message}`);
  }
}

// Column name -> index, checked against the expected columns.
function readHeader(headerRow, file) {
  const names = headerRow.fields.map((name) => name.trim());
  const unknown = names.filter((name) => !COLUMNS.includes(name));
  const missing = COLUMNS.filter((name) => !names.includes(name));
  if (unknown.length > 0 || missing.length > 0) {
    throw new Error(
      `${file}, line ${headerRow.line}: the header must be ${COLUMNS.join(",")}` +
        (unknown.length > 0 ? `; unknown: ${unknown.join(", ")}` : "") +
        (missing.length > 0 ? `; missing: ${missing.join(", ")}` : ""),
    );
  }
  return Object.fromEntries(names.map((name, index) => [name, index]));
}

// Cards of one source file, grouped by subject id.
function readSourceCards(file, subjectIdByMatiere) {
  const [headerRow, ...rows] = readSourceRows(file);
  if (!headerRow) {
    throw new Error(`${file}: the file is empty`);
  }
  const columnIndex = readHeader(headerRow, file);
  const cardsBySubject = new Map();

  for (const row of rows) {
    const location = `${file}, line ${row.line}`;
    const value = (column) => (row.fields[columnIndex[column]] ?? "").trim();

    if (CARD_TEXT_COLUMNS.every((column) => value(column) === "")) {
      continue;
    }
    if (row.fields.length !== COLUMNS.length) {
      throw new Error(`${location}: ${row.fields.length} fields, ${COLUMNS.length} expected`);
    }
    for (const column of ["Front", "Back"]) {
      if (value(column) === "") {
        throw new Error(`${location}: ${column} is empty`);
      }
    }
    const subjectId = subjectIdByMatiere.get(value("Matiere"));
    if (!subjectId) {
      throw new Error(`${location}: Matiere "${value("Matiere")}" is not in flashcards.json`);
    }

    const cards = cardsBySubject.get(subjectId) ?? [];
    if (cards.some((card) => card.frontText === value("Front"))) {
      throw new Error(`${location}: duplicate Front "${value("Front")}" in its subject`);
    }
    cards.push({
      frontText: value("Front"),
      front: renderCardText(value("Front"), location),
      back: renderCardText(value("Back"), location),
      extra: renderCardText(value("Extra"), location),
    });
    cardsBySubject.set(subjectId, cards);
  }
  return cardsBySubject;
}

// An exam's subjects: the shared categories first, in their listed order, then the exam's own extras.
// A subject's id is prefixed with its exam's id, so 2 exams can share a category.
function examSubjects(exam, categories) {
  const unknown = Object.keys(exam.categories).filter(
    (categoryId) => !categories.some((category) => category.id === categoryId),
  );
  if (unknown.length > 0) {
    throw new Error(`flashcards.json, exam "${exam.id}": unknown categories: ${unknown.join(", ")}`);
  }
  const coreSubjects = categories.map((category) => ({
    id: category.id,
    title: category.title,
    matieres: exam.categories[category.id] ?? [],
    isCore: true,
  }));
  const extraSubjects = (exam.extras ?? []).map((extra) => ({ ...extra, isCore: false }));
  return [...coreSubjects, ...extraSubjects].map((subject) => ({
    ...subject,
    id: `${exam.id}-${subject.id}`,
    origin: `${exam.title} · ${subject.title}`,
  }));
}

// Every card, sorted by exam, then by subject, then by source, with the filters' counts.
export function loadFlashcards(flashcardsDir) {
  const { sources, categories, exams } = JSON.parse(
    readFileSync(path.join(flashcardsDir, "flashcards.json"), "utf8"),
  );
  const subjectsByExam = exams.map((exam) => ({ exam, subjects: examSubjects(exam, categories) }));
  const subjects = subjectsByExam.flatMap(({ subjects: examSubjectList }) => examSubjectList);
  const subjectIdByMatiere = new Map(
    subjects.flatMap((subject) => subject.matieres.map((matiere) => [matiere, subject.id])),
  );
  const cardsBySource = sources.map((source) => ({
    source,
    cardsBySubject: readSourceCards(path.join(flashcardsDir, source.file), subjectIdByMatiere),
  }));

  const cards = subjects.flatMap((subject) =>
    cardsBySource.flatMap(({ source, cardsBySubject }) =>
      (cardsBySubject.get(subject.id) ?? []).map(({ front, back, extra }) => ({
        subject: subject.id,
        source: source.id,
        origin: subject.origin,
        front,
        back,
        extra,
      })),
    ),
  );
  const countCards = (field, id) => cards.filter((card) => card[field] === id).length;
  const withCount = (subject) => ({
    id: subject.id,
    title: subject.title,
    cardCount: countCards("subject", subject.id),
  });

  return {
    sources: sources.map((source) => ({
      id: source.id,
      title: source.title,
      cardCount: countCards("source", source.id),
    })),
    exams: subjectsByExam.map(({ exam, subjects: examSubjectList }) => ({
      id: exam.id,
      title: exam.title,
      coreSubjects: examSubjectList.filter((subject) => subject.isCore).map(withCount),
      extraSubjects: examSubjectList.filter((subject) => !subject.isCore).map(withCount),
    })),
    cards,
  };
}
