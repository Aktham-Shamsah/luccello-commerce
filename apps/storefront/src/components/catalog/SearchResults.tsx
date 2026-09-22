"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { searchProducts } from "@/lib/catalog";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = searchProducts(query);

  return (
    <>
      <form className="search-form">
        <input
          className="field"
          name="q"
          defaultValue={query}
          placeholder="ابحثي عن رقم المنتج أو اللون"
        />
        <button className="btn btn-primary" type="submit">
          بحث
        </button>
      </form>
      <div className="product-grid">
        {results.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </>
  );
}
