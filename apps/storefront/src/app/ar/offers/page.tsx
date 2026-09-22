import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function OffersPage() {
  return (
    <section className="container section page-head">
      <h1>تخفيضات</h1>
      <p className="muted">منتجات بخصومات واضحة وأسعار بالشيكل.</p>
      <CatalogListing mode="offers" />
    </section>
  );
}
