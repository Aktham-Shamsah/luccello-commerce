import { Suspense } from "react";
import { DynamicProductView } from "@/components/catalog/DynamicProductView";

export default function ProductViewPage() {
  return (
    <Suspense
      fallback={
        <section className="container section">
          <p>جاري التحميل…</p>
        </section>
      }
    >
      <DynamicProductView />
    </Suspense>
  );
}
