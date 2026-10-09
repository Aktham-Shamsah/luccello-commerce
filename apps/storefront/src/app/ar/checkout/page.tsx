"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCatalogData } from "@/lib/catalog-client";
import { readCart, removeFromCart, type StoredCartItem } from "@/lib/cart-client";
import { storefrontApiUrl, recordActivity } from "@/lib/analytics-client";
import { computeTotals } from "@/lib/pricing";
import { formatSar } from "@luccello/ui";

type Receipt = { orderId: string; status: string; totals: { total: number } };
export default function CheckoutPage() {
  const [cart, setCart] = useState<StoredCartItem[]>([]);
  const { products } = useCatalogData();
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [coupon, setCoupon] = useState("L10");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setCart(readCart());
    void recordActivity("checkout_start", "/ar/checkout");
  }, []);
  const lines = useMemo(
    () =>
      cart.flatMap((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        return product
          ? [
              {
                productId: product.id,
                slug: product.slug,
                nameAr: product.nameAr,
                quantity: entry.quantity,
                unitPrice: product.salePrice,
                regularPrice: product.regularPrice,
                image: product.images[0] ?? "",
              },
            ]
          : [];
      }),
    [cart, products],
  );
  const totals = computeTotals(lines, coupon, shippingMethod);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!storefrontApiUrl()) {
      setError("الطلبات غير متاحة في معاينة GitHub. شغلي النسخة المحلية المتصلة بالخادم.");
      return;
    }
    if (!lines.length || lines.length !== cart.length) {
      setError("السلة غير متاحة، يرجى تحديثها");
      return;
    }
    const data = new FormData(event.currentTarget);
    const contactEmail = String(data.get("email") ?? "");
    setBusy(true);
    try {
      const response = await fetch(`${storefrontApiUrl()}/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
        body: JSON.stringify({
          items: cart,
          contact: { name: data.get("name"), email: contactEmail, phone: data.get("phone") },
          address: {
            line1: data.get("address"),
            city: data.get("city"),
            country: data.get("country"),
          },
          shippingMethod,
          paymentMethod: "cash_on_delivery",
          couponCode: coupon.trim(),
        }),
      });
      const json: unknown = await response.json();
      if (!response.ok) {
        const code = typeof json === "object" && json && "error" in json ? String(json.error) : "";
        throw new Error(
          code === "insufficient_inventory"
            ? "الكمية غير متوفرة"
            : "تعذر إنشاء الطلب، يرجى مراجعة البيانات ثم المحاولة",
        );
      }
      const result = json as Receipt;
      setReceipt(result);
      setEmail(contactEmail);
      for (const item of cart) removeFromCart(item.productId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر إرسال الطلب");
    } finally {
      setBusy(false);
    }
  }

  if (receipt)
    return (
      <section className="container section checkout">
        <h1>تم تسجيل طلبك بنجاح</h1>
        <p>
          رقم الطلب: <strong dir="ltr">{receipt.orderId}</strong>
        </p>
        <p>
          الدفع عند الاستلام — المجموع: <strong>{formatSar(receipt.totals.total)}</strong>
        </p>
        <p>احفظي رقم الطلب وبريدك الإلكتروني لتتبعي الحالة.</p>
        <Link
          className="btn btn-primary"
          href={`/ar/account/orders?orderId=${receipt.orderId}&email=${encodeURIComponent(email)}`}
        >
          تتبع الطلب
        </Link>
      </section>
    );
  if (!cart.length)
    return (
      <section className="container section">
        <h1>السلة فارغة</h1>
        <Link href="/ar/products">تصفحي المنتجات</Link>
      </section>
    );

  return (
    <section className="container section checkout">
      <h1>إتمام الطلب</h1>
      <form className="checkout-grid" onSubmit={submit}>
        <fieldset>
          <legend>بيانات التواصل</legend>
          <input
            className="field"
            name="name"
            placeholder="الاسم الكامل"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
          />
          <input
            className="field"
            name="email"
            type="email"
            placeholder="البريد الإلكتروني"
            required
            autoComplete="email"
          />
          <input
            className="field"
            name="phone"
            type="tel"
            placeholder="رقم الجوال"
            required
            minLength={8}
            maxLength={24}
            autoComplete="tel"
          />
        </fieldset>
        <fieldset>
          <legend>العنوان والشحن</legend>
          <input
            className="field"
            name="address"
            placeholder="العنوان بالتفصيل"
            required
            minLength={3}
            autoComplete="street-address"
          />
          <input
            className="field"
            name="city"
            placeholder="المدينة"
            required
            minLength={2}
            autoComplete="address-level2"
          />
          <select className="field" name="country" defaultValue="PS" aria-label="البلد">
            <option value="PS">فلسطين</option>
            <option value="JO">الأردن</option>
            <option value="SA">السعودية</option>
          </select>
          <select
            className="field"
            value={shippingMethod}
            onChange={(event) => setShippingMethod(event.target.value as "standard" | "express")}
          >
            <option value="standard">شحن قياسي</option>
            <option value="express">شحن سريع</option>
          </select>
        </fieldset>
        <fieldset>
          <legend>الخصم والدفع</legend>
          <input
            className="field"
            value={coupon}
            onChange={(event) => setCoupon(event.target.value)}
            placeholder="كود الخصم"
            maxLength={80}
          />
          <label className="payment-option">
            <input type="radio" checked readOnly /> الدفع نقداً عند الاستلام
          </label>
          <p className="muted">
            الدفع الإلكتروني غير مفعّل. سيتم التحقق من المخزون والسعر على الخادم.
          </p>
          <p>
            المجموع التقريبي: <strong>{formatSar(totals.total)}</strong>
          </p>
        </fieldset>
        {error ? (
          <p role="alert" style={{ color: "darkred" }}>
            {error}
          </p>
        ) : null}
        <button className="btn btn-primary" disabled={busy} type="submit">
          {busy ? "جارٍ إنشاء الطلب..." : "تأكيد الطلب"}
        </button>
      </form>
    </section>
  );
}
