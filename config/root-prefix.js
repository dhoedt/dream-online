// "../" once per folder between a page's output and the site root, so links stay relative.
// page.url is "/" for the home page and "/lessons/subnet/" for lessons/subnet.njk.
export function rootPrefixOf(page) {
  const folderDepth = page.url.split("/").filter(Boolean).length;
  return "../".repeat(folderDepth);
}
