import Link from "next/link";
export default function AddressesPage() {
  return (
    <section className="container section page-head">
      <h1>العناوين</h1>
      <p>تُدخَل تفاصيل التوصيل عند إتمام كل طلب. لا نخزن العناوين في المتصفح.</p>
      <Link href="/ar/checkout">الذهاب إلى إتمام الطلب</Link>
    </section>
  );
}
