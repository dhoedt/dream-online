import { createAssetUrlFilter } from "./config/asset-url.js";
import { createIconShortcode } from "./config/icon.js";

const INPUT_DIR = "site";

// Files with these extensions are copied as they are, keeping their path under site/.
const PASSTHROUGH_EXTENSIONS = "{css,js,png,jpg,svg,webp,ico}";

function byOrder(pages) {
  return pages.sort((first, second) => first.data.order - second.data.order);
}

export default function (eleventyConfig) {
  // Any folder in site/ except top-level _-prefixed ones (_includes, _data).
  eleventyConfig.addPassthroughCopy(
    `${INPUT_DIR}/{,!(_)*/**/}*.${PASSTHROUGH_EXTENSIONS}`,
  );

  // Flashcard CSV files are read by a data file, not as templates: rebuild when they change.
  eleventyConfig.addWatchTarget(`${INPUT_DIR}/_flashcards/`);

  eleventyConfig.addFilter("asset_url", createAssetUrlFilter(INPUT_DIR));
  eleventyConfig.addShortcode("icon", createIconShortcode(`${INPUT_DIR}/_includes/icons`));

  // The home page tabs, in the order given by each page's front matter.
  eleventyConfig.addCollection("lessons", (collectionApi) =>
    byOrder(collectionApi.getFilteredByTag("lesson")),
  );
  eleventyConfig.addCollection("exercises", (collectionApi) =>
    byOrder(collectionApi.getFilteredByTag("exercise")),
  );
}

export const config = {
  templateFormats: ["njk"],
  dir: {
    input: INPUT_DIR,
    includes: "_includes",
    data: "_data",
    output: "dist",
  },
};
