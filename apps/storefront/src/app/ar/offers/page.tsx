import { ProductCard } from "@/components/catalog/ProductCard";
import { products } from "@/lib/catalog";

export default function OffersPage() {
  return (
    <section className="container section page-head">
      <h1>تخفيضات</h1>
      <p className="muted">منتجات بخصومات واضحة، والسيرفر يعيد احتساب السعر في checkout.</p>
      <div className="product-grid">
        {products
          .filter((product) => product.sale)
          .map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
    </section>
  );
}
