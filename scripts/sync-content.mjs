// Refreshes the committed copy of the shared content.json from www before a build.
// If www cannot be reached, or serves something without the portfolios list,
// the build carries on with the committed copy.
import { writeFile } from "node:fs/promises";

const url = process.env.CONTENT_URL ?? "https://www.jaykimsly.co.za/content.json";
const target = new URL(process.argv[2], new URL("../", import.meta.url));

try {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const content = await res.json();
  if (!Array.isArray(content.portfolios)) throw new Error("no portfolios list");
  await writeFile(target, `${JSON.stringify(content, null, 2)}\n`);
  console.log(`content.json refreshed from ${url}`);
} catch (error) {
  console.warn(`content.json not refreshed (${error.message}); using the committed copy`);
}
