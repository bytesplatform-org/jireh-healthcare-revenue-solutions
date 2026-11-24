import type { MetadataRoute } from "next";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/content";

/**
 * /sitemap.xml, built from the app directory itself so new pages are listed
 * automatically (prerendered at build time).
 *
 * Every `page.(tsx|ts|jsx|js|mdx)` under `app/` becomes a URL, except:
 *  - pages that opt out of indexing (`robots: { index: false }` in their metadata);
 *  - private folders (`_components`…), parallel routes (`@slot`) and intercepting routes (`(.)x`);
 *  - dynamic routes (`[slug]`): list their URLs in `EXTRA` below.
 * Route groups `(group)` are dropped from the URL, as Next does.
 */

const APP_DIR = path.join(process.cwd(), "app");
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

/** Weight of a few key routes (others default to 0.7). */
const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.9,
  "/book-a-free-consultation": 0.9,
};

/** URLs the scan can't discover (e.g. dynamic routes). Paths like "/blog/first-post". */
const EXTRA: string[] = [];

type Page = { route: string; file: string };

function findPages(dir: string, segments: string[] = []): Page[] {
  const pages: Page[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isFile() && PAGE_FILE.test(entry.name)) {
      pages.push({ route: `/${segments.join("/")}`, file: full });
      continue;
    }
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith("_") || name.startsWith("@") || name.startsWith("(.")) continue; // private, parallel, intercepting
    if (name.includes("[")) continue; // dynamic: add to EXTRA
    const isGroup = name.startsWith("(") && name.endsWith(")");
    pages.push(...findPages(full, isGroup ? segments : [...segments, name]));
  }
  return pages;
}

/** A page opted out of search engines (`robots: { index: false }` or `noindex`). */
function isNoIndex(file: string) {
  const src = readFileSync(file, "utf8");
  return /index:\s*false/.test(src) || /noindex/i.test(src);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = findPages(APP_DIR).filter((p) => !isNoIndex(p.file));
  const entries = pages.map(({ route, file }) => ({
    url: new URL(route, SITE.url).toString(),
    lastModified: statSync(file).mtime,
    changeFrequency: "monthly" as const,
    priority: PRIORITY[route] ?? 0.7,
  }));
  const extra = EXTRA.map((route) => ({
    url: new URL(route, SITE.url).toString(),
    changeFrequency: "monthly" as const,
    priority: PRIORITY[route] ?? 0.6,
  }));
  return [...entries, ...extra].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || a.url.localeCompare(b.url));
}
