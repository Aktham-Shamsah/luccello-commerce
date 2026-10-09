"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useCatalogData } from "@/lib/catalog-client";

function loadIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("luchelo-wishlist-v1") ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}
export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([]);
  const { products } = useCatalogData();
  useEffect(() => {
    const refresh = () => setIds(loadIds());
    refresh();
    window.addEventListener("luchelo-wishlist-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("luchelo-wishlist-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const matching = products.filter((p) => ids.includes(p.id));
  return (
    <section className="container section">
      <h1>المفضلة</h1>
      {matching.length ? (
        <div className="product-grid">
          {matching.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p>لا توجد منتجات محفوظة في المفضلة.</p>
      )}
    </section>
  );
}
