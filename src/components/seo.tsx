import { useEffect } from "react";

const SITE_URL = "https://holy-quran.app";
const SITE_NAME = "Holy Quran";

interface SeoProps {
  /** Page title; " | Holy Quran" is appended unless the title already contains it. */
  title: string;
  description?: string;
  /** Canonical path (e.g. "/surah/2"). Omit for noindex-only pages. */
  path?: string;
  noindex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Keeps document metadata in sync on client-side navigations by updating the
 * tags already present in index.html (the build also prerenders these
 * statically per route — see scripts/prerender.mjs).
 */
export function Seo({ title, description, path, noindex }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMeta("property", "og:title", fullTitle);
    setMeta("name", "twitter:title", fullTitle);

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    if (path) {
      const url = `${SITE_URL}${path === "/" ? "/" : path}`;
      setMeta("property", "og:url", url);
      let canonical = document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }

    const robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    if (noindex) {
      setMeta("name", "robots", "noindex");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, path, noindex]);

  return null;
}
