import { ProductCard } from "@/components/catalog/ProductCard";
import { products } from "@/lib/catalog";

export default function LatestPage() {
  return (
    <section className="container section page-head">
      <h1>وصل حديثا</h1>
      <div className="product-grid">
        {products
          .filter((product) => product.newest)
          .map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
    </section>
  );
}
