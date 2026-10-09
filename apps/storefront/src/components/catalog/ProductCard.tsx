"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@luccello/types";
import { formatSar } from "@luccello/ui";
import { discountPercent, stockState } from "@/lib/pricing";
import { addToCart } from "@/lib/cart-client";
import { productHref } from "@/lib/catalog-links";
import { SafeImage } from "@/components/common/SafeImage";

export function ProductCard({ product }: { product: Product }) {
  const state = stockState(product);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      setSaved(
        (JSON.parse(localStorage.getItem("luchelo-wishlist-v1") ?? "[]") as string[]).includes(
          product.id,
        ),
      );
    } catch {
      setSaved(false);
    }
  }, [product.id]);
  function toggleSaved() {
    let ids: string[] = [];
    try {
      ids = JSON.parse(localStorage.getItem("luchelo-wishlist-v1") ?? "[]") as string[];
    } catch {
      /* empty */
    }
    const next = ids.includes(product.id)
      ? ids.filter((id) => id !== product.id)
      : [...ids, product.id];
    localStorage.setItem("luchelo-wishlist-v1", JSON.stringify(next));
    setSaved(next.includes(product.id));
    window.dispatchEvent(new Event("luchelo-wishlist-updated"));
  }

  return (
    <article className="product-card">
      <Link href={productHref(product.slug)} className="product-image">
        <SafeImage src={product.images[0]} alt={product.nameAr} />
        {product.sale ? <span className="sale-badge">خصم {discountPercent(product)}%</span> : null}
      </Link>
      <button
        className="wishlist"
        aria-label={saved ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-pressed={saved}
        onClick={toggleSaved}
        type="button"
      >
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="product-content">
        <Link href={productHref(product.slug)}>
          <h3>{product.nameAr}</h3>
        </Link>
        <p>{product.color}</p>
        <p className="muted">تقييمات العملاء داخل صفحة المنتج</p>
        <div className="price-row">
          <strong>{formatSar(product.salePrice)}</strong>
          {product.sale ? <del>{formatSar(product.regularPrice)}</del> : null}
        </div>
        <button
          className="btn btn-primary"
          disabled={state === "out_of_stock"}
          type="button"
          onClick={() => addToCart(product.id)}
        >
          <ShoppingBag size={18} />
          {state === "out_of_stock" ? "نفدت الكمية" : "أضف إلى السلة"}
        </button>
      </div>
    </article>
  );
}
