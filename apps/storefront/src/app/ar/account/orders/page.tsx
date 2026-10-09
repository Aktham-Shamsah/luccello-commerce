"use client";

import { useEffect, useState, type FormEvent } from "react";
import { storefrontApiUrl } from "@/lib/analytics-client";
import { formatSar } from "@luccello/ui";

type Order = {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  shippingService: string | null;
  paymentMethod: string | null;
  city: string | null;
  items: { name: string; quantity: number; unitPrice: number }[];
};

export default function OrdersPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [found, setFound] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("orderId") ?? "");
    setEmail(params.get("email") ?? "");
  }, []);

  async function lookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFound(null);
    setBusy(true);
    try {
      const api = storefrontApiUrl();
      if (!api) throw new Error("خدمة تتبع الطلبات غير مفعلة في المعاينة");
      const response = await fetch(`${api}/orders/lookup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      if (!response.ok) throw new Error("لم يتم العثور على طلب بهذه البيانات");
      setFound((await response.json()) as Order);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر البحث");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container section page-head">
      <h1>تتبع الطلب</h1>
      <p>استخدمي رقم الطلب والبريد الإلكتروني المستخدم عند الطلب.</p>
      <form onSubmit={lookup} style={{ maxWidth: 600, display: "grid", gap: 12 }}>
        <input
          className="field"
          aria-label="رقم الطلب"
          placeholder="رقم الطلب"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <input
          className="field"
          aria-label="البريد الإلكتروني"
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary" disabled={busy} type="submit">
          {busy ? "جاري البحث..." : "تتبع الطلب"}
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {found ? (
        <div className="summary" style={{ marginTop: 24 }}>
          <h2>تفاصيل الطلب</h2>
          <p>
            الحالة: <strong>{found.status}</strong>
          </p>
          <p>التاريخ: {new Date(found.createdAt).toLocaleDateString("ar")}</p>
          <p>المدينة: {found.city}</p>
          <p>
            الدفع:{" "}
            {found.paymentMethod === "cash_on_delivery" ? "عند الاستلام" : found.paymentMethod}
          </p>
          {found.items.map((item, i) => (
            <p key={i}>
              {item.name} × {item.quantity} — {formatSar(item.unitPrice * item.quantity)}
            </p>
          ))}
          <strong>الإجمالي: {formatSar(found.total)}</strong>
        </div>
      ) : null}
    </section>
  );
}
