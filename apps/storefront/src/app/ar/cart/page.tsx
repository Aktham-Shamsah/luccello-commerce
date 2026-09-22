import Link from "next/link";
import { products } from "@/lib/catalog";
import { computeTotals } from "@/lib/pricing";
import { formatSar } from "@luccello/ui";

export default function CartPage() {
  const demoItems = products.slice(0, 2).map((product) => ({
    productId: product.id,
    slug: product.slug,
    nameAr: product.nameAr,
    unitPrice: product.salePrice,
    regularPrice: product.regularPrice,
    quantity: 1,
    image: product.images[0] ?? "/product-collage.png",
  }));
  const totals = computeTotals(demoItems, "L10");

  return (
    <section className="container section split-page">
      <div>
        <h1>السلة</h1>
        {demoItems.map((item) => (
          <article className="cart-item" key={item.productId}>
            <img src={item.image} alt="" />
            <div>
              <h2>{item.nameAr}</h2>
              <p>الكمية: {item.quantity}</p>
              <strong>{formatSar(item.unitPrice)}</strong>
            </div>
          </article>
        ))}
      </div>
      <aside className="summary">
        <h2>ملخص الطلب</h2>
        <p>المجموع: {formatSar(totals.subtotal)}</p>
        <p>الخصم: {formatSar(totals.discount)}</p>
        <p>الشحن: {formatSar(totals.shipping)}</p>
        <strong>الإجمالي: {formatSar(totals.total)}</strong>
        <Link className="btn btn-primary" href="/ar/checkout">
          المتابعة للدفع
        </Link>
      </aside>
    </section>
  );
}
