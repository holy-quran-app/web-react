// Generates public/sitemap.xml from the shared route list.
// Runs as part of `npm run build` (before `vite build`, so the file is
// copied into dist/ along with the rest of public/).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ROUTES, SITE_URL } from "./seo-routes.mjs";

const outFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/sitemap.xml",
);

const urls = ROUTES.map(
  ({ path: route }) =>
    `  <url>\n    <loc>${SITE_URL}${route === "/" ? "/" : route}</loc>\n  </url>`,
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(outFile, xml);
console.log(`sitemap: wrote ${ROUTES.length} URLs to ${outFile}`);
