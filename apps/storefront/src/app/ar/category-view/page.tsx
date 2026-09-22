import { Suspense } from "react";
import { DynamicCategoryView } from "@/components/catalog/DynamicCategoryView";

export default function CategoryViewPage() {
  return (
    <Suspense
      fallback={
        <section className="container section">
          <p>جاري التحميل…</p>
        </section>
      }
    >
      <DynamicCategoryView />
    </Suspense>
  );
}
