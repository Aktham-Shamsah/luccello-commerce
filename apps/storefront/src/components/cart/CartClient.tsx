"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatSar } from "@luccello/ui";
import { products } from "@/lib/catalog";
import { computeTotals } from "@/lib/pricing";
import { CART_EVENT, readCart, removeFromCart, type StoredCartItem } from "@/lib/cart-client";

export function CartClient() {
  const [storedItems, setStoredItems] = useState<StoredCartItem[]>([]);

  const refresh = () => setStoredItems(readCart());

  useEffect(() => {
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const items = useMemo(
    () =>
      storedItems.flatMap((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        if (!product) return [];
        return [{ ...entry, product }];
      }),
    [storedItems],
  );

  const totals = computeTotals(
    items.map(({ product, quantity }) => ({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      unitPrice: product.salePrice,
      regularPrice: product.regularPrice,
      quantity,
      image: product.images[0] ?? "",
    })),
    "L10",
  );

  if (items.length === 0) {
    return (
      <section className="container section cart-empty">
        <h1>السلة فارغة</h1>
        <p>أضيفي المنتجات التي تعجبك وستظهر هنا مباشرة.</p>
        <Link className="btn btn-primary" href="/ar/products">
          تصفحي المنتجات
        </Link>
      </section>
    );
  }

  return (
    <section className="container section split-page">
      <div>
        <h1>السلة</h1>
        <div className="cart-list">
          {items.map(({ product, quantity }) => (
            <article className="cart-item" key={product.id}>
              <img src={product.images[0]} alt={product.nameAr} />
              <div className="cart-item-content">
                <Link href={`/ar/product/${product.slug}`}>
                  <h2>{product.nameAr}</h2>
                </Link>
                <p>الكمية: {quantity}</p>
                <div className="cart-line-price">
                  <strong>{formatSar(product.salePrice * quantity)}</strong>
                  {product.sale ? <del>{formatSar(product.regularPrice * quantity)}</del> : null}
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`حذف ${product.nameAr} من السلة`}
                >
                  <Trash2 size={18} />
                  حذف من السلة
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="summary">
        <h2>ملخص الطلب</h2>
        <p>المجموع: {formatSar(totals.subtotal)}</p>
        <p>الخصم: {formatSar(totals.discount)}</p>
        <p>الشحن: {formatSar(totals.shipping)}</p>
        <strong className="summary-total">الإجمالي: {formatSar(totals.total)}</strong>
        <Link className="btn btn-primary" href="/ar/checkout">
          المتابعة للدفع
        </Link>
      </aside>
    </section>
  );
}
