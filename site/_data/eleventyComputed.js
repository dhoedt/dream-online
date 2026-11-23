import { pageKindOf } from "../../config/page-kinds.js";
import { rootPrefixOf } from "../../config/root-prefix.js";

function lowercaseFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export default {
  rootPrefix: (data) => rootPrefixOf(data.page),

  // "Exercice : le masque de sous-réseau" for a tagged page, the title alone otherwise.
  pageTitle: (data) => {
    const pageKind = pageKindOf(data);
    return pageKind ? `${pageKind.titlePrefix} : ${lowercaseFirst(data.title)}` : data.title;
  },

  backLink: (data) => pageKindOf(data)?.backLink ?? null,
};
