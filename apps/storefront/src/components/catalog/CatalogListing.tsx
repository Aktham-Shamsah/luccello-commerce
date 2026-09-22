"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useCatalogData } from "@/lib/catalog-client";

type Mode = "all" | "latest" | "offers";

export function CatalogListing({ mode }: { mode: Mode }) {
  const { products } = useCatalogData();
  const visible = products.filter((product) => {
    if (mode === "latest") return product.newest;
    if (mode === "offers") return product.sale;
    return true;
  });

  return (
    <div className="product-grid">
      {visible.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
