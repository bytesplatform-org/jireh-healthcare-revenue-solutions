import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

/** /robots.txt: allow everything and point crawlers at the generated sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
