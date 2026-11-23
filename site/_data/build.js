import { execSync } from "node:child_process";

const TIME_ZONE = "Europe/Brussels";

// Build time in Belgian time, and the short SHA of the commit the build runs on.
export default function () {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "longOffset",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date()).map((part) => [part.type, part.value]),
  );
  // longOffset gives "GMT+01:00", or "GMT" alone at a zero offset.
  const offset = parts.timeZoneName.replace("GMT", "") || "+00:00";

  return {
    datetime: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}${offset}`,
    label: `${parts.day}/${parts.month}/${parts.year} à ${parts.hour}:${parts.minute}`,
    commit: execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim(),
  };
}
