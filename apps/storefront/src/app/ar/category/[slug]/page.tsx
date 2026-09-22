import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { categories, getProductsByCategory } from "@/lib/catalog";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryProducts = getProductsByCategory(slug);

  return (
    <section className="container section page-head">
      <h1>{category.nameAr}</h1>
      <p className="muted">{category.descriptionAr}</p>
      <div className="product-grid">
        {categoryProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
