import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import { rootPrefixOf } from "./root-prefix.js";

const VERSION_LENGTH = 10;

// Filter factory: {{ 'css/style.css' | asset_url }} takes a path from the site root,
// and gives the path from the page being rendered with ?v=<content hash> appended
// ("../../css/style.css?v=…"), so browsers fetch the file again only when its content changes.
export function createAssetUrlFilter(inputDir) {
  // A regular function: 11ty passes the page being rendered as `this.page`.
  return function assetUrl(sitePath) {
    const assetFile = path.join(inputDir, sitePath);
    if (!existsSync(assetFile)) {
      throw new Error(`asset_url: ${sitePath} not found (no ${assetFile})`);
    }
    const version = createHash("sha256")
      .update(readFileSync(assetFile))
      .digest("hex")
      .slice(0, VERSION_LENGTH);
    return `${rootPrefixOf(this.page)}${sitePath}?v=${version}`;
  };
}
