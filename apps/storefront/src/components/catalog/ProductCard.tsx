"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@luccello/types";
import { formatSar } from "@luccello/ui";
import { discountPercent, stockState } from "@/lib/pricing";
import { addToCart } from "@/lib/cart-client";
import { productHref } from "@/lib/catalog-links";
import { SafeImage } from "@/components/common/SafeImage";

export function ProductCard({ product }: { product: Product }) {
  const state = stockState(product);

  return (
    <article className="product-card">
      <Link href={productHref(product.slug)} className="product-image">
        <SafeImage src={product.images[0]} alt={product.nameAr} />
        {product.sale ? <span className="sale-badge">خصم {discountPercent(product)}%</span> : null}
      </Link>
      <button className="wishlist" aria-label="إضافة للمفضلة" type="button">
        <Heart size={18} />
      </button>
      <div className="product-content">
        <Link href={productHref(product.slug)}>
          <h3>{product.nameAr}</h3>
        </Link>
        <p>{product.color}</p>
        <div className="product-rating" aria-label="تقييم 4.9 من 5">
          <span>★★★★★</span>
          <small>4.9 (27)</small>
        </div>
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
