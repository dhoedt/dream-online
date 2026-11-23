// What a page's tag gives it: the prefix of its <title> and its back link.
// Back link targets are relative to the site root.
export const PAGE_KINDS = {
  lesson: {
    titlePrefix: "Leçon",
    backLink: { href: "index.html#lessons", label: "Leçons", icon: "arrow-left" },
  },
  exercise: {
    titlePrefix: "Exercice",
    backLink: { href: "index.html", label: "Accueil", icon: "home" },
  },
};

// Front matter may give `tags` as one string or as a list.
export function pageKindOf(data) {
  const tags = Array.isArray(data.tags) ? data.tags : [data.tags];
  const kindName = tags.find((tag) => tag in PAGE_KINDS);
  return kindName ? PAGE_KINDS[kindName] : null;
}
