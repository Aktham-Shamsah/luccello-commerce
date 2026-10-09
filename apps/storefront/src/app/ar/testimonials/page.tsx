import Link from "next/link";
export default function TestimonialsPage() {
  return (
    <section className="container section page-head">
      <h1>آراء العملاء</h1>
      <p>
        لم تُنشر مراجعات حقيقية ومعتمدة بعد. ستظهر تقييمات المنتجات في صفحاتها بعد اعتمادها من
        الإدارة.
      </p>
      <Link className="btn btn-primary" href="/ar/products">
        تصفحي المنتجات
      </Link>
    </section>
  );
}
