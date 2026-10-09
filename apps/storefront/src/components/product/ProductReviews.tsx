"use client";

import { useEffect, useState, type FormEvent } from "react";
import { storefrontApiUrl } from "@/lib/analytics-client";

type Review = { id: string; rating: number; title: string; body: string; createdAt: string };
type ResponseData = { reviews: Review[]; average: number | null; count: number };

export function ProductReviews({ productId }: { productId: string }) {
  const [data, setData] = useState<ResponseData | null>(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isDatabaseProduct = /^[0-9a-f-]{36}$/i.test(productId);
  const api = storefrontApiUrl();

  useEffect(() => {
    if (!api || !isDatabaseProduct) return;
    fetch(`${api}/reviews?productId=${encodeURIComponent(productId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((r: ResponseData | null) => setData(r))
      .catch(() => setData(null));
  }, [api, productId, isDatabaseProduct]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${api}/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title: String(form.get("title")),
          body: String(form.get("body")),
        }),
      });
      if (!response.ok) throw new Error("تعذّر إرسال التقييم");
      setMessage("شكراً! أُرسل تقييمك للمراجعة قبل النشر.");
      event.currentTarget.reset();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "تعذر إرسال التقييم");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="reviews-panel">
      <h2>تقييمات المنتج</h2>
      {data && data.count > 0 ? (
        <p>
          متوسط التقييم {data.average} / 5 ({data.count} مراجعة معتمدة)
        </p>
      ) : (
        <p>لا توجد تقييمات معتمدة لهذا المنتج بعد.</p>
      )}
      {data?.reviews.map((review) => (
        <article className="review-card" key={review.id}>
          <strong>
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)} — {review.title}
          </strong>
          <p>{review.body}</p>
          <small>{new Date(review.createdAt).toLocaleDateString("ar")}</small>
        </article>
      ))}
      {isDatabaseProduct && api ? (
        <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 560 }}>
          <h3>أضيفي تقييمك</h3>
          <select
            className="field"
            aria-label="التقييم"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} نجوم
              </option>
            ))}
          </select>
          <input
            className="field"
            name="title"
            minLength={3}
            maxLength={80}
            placeholder="عنوان التقييم"
            required
          />
          <textarea
            className="field"
            name="body"
            minLength={10}
            maxLength={1000}
            placeholder="تفاصيل التقييم"
            rows={3}
            required
          />
          <button className="btn btn-primary" disabled={busy} type="submit">
            إرسال التقييم
          </button>
          {message ? <p role="status">{message}</p> : null}
        </form>
      ) : null}
    </section>
  );
}
