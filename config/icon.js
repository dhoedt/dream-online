import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

// Shortcode factory: {% icon "restart" %} inlines <iconsDir>/restart.svg.
// Extra attributes go on the <svg> tag: {% icon "eye", 'class="icon-closed"' %}.
export function createIconShortcode(iconsDir) {
  return function icon(name, attributes = "") {
    const iconFile = path.join(iconsDir, `${name}.svg`);
    if (!existsSync(iconFile)) {
      throw new Error(`icon: unknown icon "${name}" (no ${iconFile})`);
    }
    const svg = readFileSync(iconFile, "utf8").trim();
    return attributes ? svg.replace("<svg ", `<svg ${attributes} `) : svg;
  };
}
