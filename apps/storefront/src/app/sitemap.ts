import type { MetadataRoute } from "next";
import { products, categories } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  return [
    { url: `${base}/ar` },
    ...products.map((product) => ({ url: `${base}/ar/product/${product.slug}` })),
    ...categories.map((category) => ({ url: `${base}/ar/category/${category.slug}` })),
  ];
}
