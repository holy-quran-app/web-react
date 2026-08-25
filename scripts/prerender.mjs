// Post-build step: writes a static HTML entry file for every indexable route
// so GitHub Pages serves deep links (e.g. /surah/2) with HTTP 200 instead of
// falling back to 404.html. GitHub Pages resolves the extensionless URL
// /surah/2 to dist/surah/2.html directly, with no redirect.
//
// Each copy of dist/index.html gets route-specific <title>, meta description,
// canonical URL, and Open Graph / Twitter tags, so crawlers that don't run
// JavaScript still see correct per-page metadata.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ROUTES, SITE_URL } from "./seo-routes.mjs";

const distDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);

const template = readFileSync(path.join(distDir, "index.html"), "utf8");

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
}

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: pattern not found in index.html: ${pattern}`);
  }
  return html.replace(pattern, replacement);
}

function renderRoute({ path: route, title, description }) {
  const url = `${SITE_URL}${route === "/" ? "/" : route}`;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  html = replaceOnce(
    html,
    /(<meta name="description" content=")[^"]*(")/,
    `$1${d}$2`,
  );
  html = replaceOnce(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`,
  );
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`);
  html = replaceOnce(
    html,
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${d}$2`,
  );
  html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`);
  html = replaceOnce(
    html,
    /(<meta name="twitter:description" content=")[^"]*(")/,
    `$1${d}$2`,
  );
  return html;
}

let count = 0;
for (const route of ROUTES) {
  if (route.path === "/") continue; // dist/index.html already carries home metadata
  const outFile = path.join(distDir, `${route.path.slice(1)}.html`);
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, renderRoute(route));
  count++;
}
console.log(`prerender: wrote ${count} route entry files to ${distDir}`);
