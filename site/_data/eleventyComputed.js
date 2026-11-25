import { pageKindOf } from "../../config/page-kinds.js";
import { rootPrefixOf } from "../../config/root-prefix.js";

// An acronym ("OS (software)") keeps its case: only a capitalised word is lowercased.
function lowercaseFirst(text) {
  const isAcronym = /^\p{Lu}{2}/u.test(text);
  return isAcronym ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

export default {
  rootPrefix: (data) => rootPrefixOf(data.page),

  // "Exercice : le masque de sous-réseau" for a page whose kind has a prefix, the title alone otherwise.
  pageTitle: (data) => {
    const titlePrefix = pageKindOf(data)?.titlePrefix;
    return titlePrefix ? `${titlePrefix} : ${lowercaseFirst(data.title)}` : data.title;
  },

  backLink: (data) => pageKindOf(data)?.backLink ?? null,
};
