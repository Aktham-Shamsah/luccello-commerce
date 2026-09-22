"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { useCatalogData } from "@/lib/catalog-client";

export function DynamicProductView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { products, ready } = useCatalogData();
  const product = products.find((item) => item.slug === slug);

  if (!ready) {
    return (
      <section className="container section page-head">
        <h1>جاري تحميل المنتج…</h1>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container section page-head">
        <h1>المنتج غير موجود</h1>
        <Link className="btn btn-primary" href="/ar/products">
          عرض المنتجات
        </Link>
      </section>
    );
  }

  return <ProductDetail product={product} />;
}
