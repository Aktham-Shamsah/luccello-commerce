import { CatalogListing } from "@/components/catalog/CatalogListing";

export default function LatestPage() {
  return (
    <section className="container section page-head">
      <h1>وصل حديثا</h1>
      <CatalogListing mode="latest" />
    </section>
  );
}
