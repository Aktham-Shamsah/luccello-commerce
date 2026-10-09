"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useCatalogData } from "@/lib/catalog-client";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const term = query.trim().toLowerCase();
  const { products, ready } = useCatalogData();
  const results = products.filter(
    (p) =>
      !term ||
      [p.nameAr, p.nameEn, p.sku, p.color, p.descriptionAr]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
  );

  return (
    <>
      <form className="search-form">
        <input
          className="field"
          name="q"
          defaultValue={query}
          placeholder="ابحثي عن المنتج أو اللون"
        />
        <button className="btn btn-primary" type="submit">
          بحث
        </button>
      </form>
      {!ready ? (
        <p>جاري تحميل المنتجات…</p>
      ) : results.length === 0 ? (
        <p>لا توجد منتجات مطابقة</p>
      ) : null}
      <div className="product-grid">
        {results.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
    </>
  );
}
