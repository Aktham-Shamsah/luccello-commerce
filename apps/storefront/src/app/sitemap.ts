import type { MetadataRoute } from "next";
// Dynamic product URLs are published via the API in production; do not index demo product pages.

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: `${base}/ar` },
    { url: `${base}/ar/products` },
    { url: `${base}/ar/about` },
    { url: `${base}/ar/returns` },
  ];
}
