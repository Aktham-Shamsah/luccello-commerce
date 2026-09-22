import { ProductCard } from "@/components/catalog/ProductCard";
import { searchProducts } from "@/lib/catalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const results = searchProducts(query);

  return (
    <section className="container section page-head">
      <h1>البحث</h1>
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
    </section>
  );
}
