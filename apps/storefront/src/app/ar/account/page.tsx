import Link from "next/link";

export default function AccountPage() {
  return (
    <section className="container section page-head">
      <h1>حسابي</h1>
      <p>يمكنك متابعة طلباتك باستخدام رقم الطلب والبريد الإلكتروني الذي استخدمته عند الشراء.</p>
      <Link className="btn btn-primary" href="/ar/account/orders">
        تتبع طلباتي
      </Link>
      <p className="muted">
        حسابات العملاء الشخصية وحفظ العناوين غير مفعلة في النسخة المحلية الحالية.
      </p>
    </section>
  );
}
