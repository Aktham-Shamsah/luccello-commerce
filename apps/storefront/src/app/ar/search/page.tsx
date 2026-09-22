import { Suspense } from "react";
import { SearchResults } from "@/components/catalog/SearchResults";

export default function SearchPage() {
  return (
    <section className="container section page-head">
      <h1>البحث</h1>
      <Suspense fallback={<p className="muted">جارٍ تحميل البحث...</p>}>
        <SearchResults />
      </Suspense>
    </section>
  );
}
