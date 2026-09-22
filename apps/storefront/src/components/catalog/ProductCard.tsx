"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@luccello/types";
import { formatSar } from "@luccello/ui";
import { discountPercent, stockState } from "@/lib/pricing";

export function ProductCard({ product }: { product: Product }) {
  const state = stockState(product);

  return (
    <article className="product-card">
      <Link href={`/ar/product/${product.slug}`} className="product-image">
        <img src={product.images[0]} alt={product.nameAr} />
        {product.sale ? <span className="sale-badge">خصم {discountPercent(product)}%</span> : null}
      </Link>
      <button className="wishlist" aria-label="إضافة للمفضلة" type="button">
        <Heart size={18} />
      </button>
      <div className="product-content">
        <Link href={`/ar/product/${product.slug}`}>
          <h3>{product.nameAr}</h3>
        </Link>
        <p>{product.color}</p>
        <div className="price-row">
          <strong>{formatSar(product.salePrice)}</strong>
          {product.sale ? <del>{formatSar(product.regularPrice)}</del> : null}
        </div>
        <button className="btn btn-primary" disabled={state === "out_of_stock"} type="button">
          <ShoppingBag size={18} />
          {state === "out_of_stock" ? "نفدت الكمية" : "أضف إلى السلة"}
        </button>
      </div>
    </article>
  );
}
