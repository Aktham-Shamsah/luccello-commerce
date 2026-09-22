import { ProductCard } from "@/components/catalog/ProductCard";
import { products } from "@/lib/catalog";

export default function ProductsPage() {
  return (
    <section className="container section page-head">
      <h1>جميع المنتجات</h1>
      <p className="muted">كتالوج تجريبي يدعم الأسعار والمخزون والخصومات.</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
