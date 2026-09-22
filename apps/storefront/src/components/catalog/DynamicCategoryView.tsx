"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SafeImage } from "@/components/common/SafeImage";
import { useCatalogData } from "@/lib/catalog-client";

export function DynamicCategoryView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { categories, products, ready } = useCatalogData();
  const category = categories.find((item) => item.slug === slug);

  if (!ready) {
    return (
      <section className="container section page-head">
        <h1>جاري تحميل الفئة…</h1>
      </section>
    );
  }

  if (!category) {
    return (
      <section className="container section page-head">
        <h1>الفئة غير موجودة</h1>
        <Link className="btn btn-primary" href="/ar/products">
          عرض المنتجات
        </Link>
      </section>
    );
  }

  const items = products.filter((product) => product.categories.includes(slug));
  return (
    <section className="container section page-head">
      <div className="dynamic-category-hero">
        <SafeImage src={category.image} alt={category.nameAr} />
        <div>
          <h1>{category.nameAr}</h1>
          <p>{category.descriptionAr}</p>
        </div>
      </div>
      <div className="product-grid">
        {items.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
