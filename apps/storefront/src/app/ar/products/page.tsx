import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function ProductsPage() {
  return (
    <section className="container section page-head">
      <h1>جميع المنتجات</h1>
      <p className="muted">المنتجات والأسعار والمخزون تُحدّث من الكتالوج المتصل.</p>
      <CatalogListing mode="all" />
    </section>
  );
}
