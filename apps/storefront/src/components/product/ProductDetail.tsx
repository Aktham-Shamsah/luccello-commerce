"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@luccello/types";
import { formatSar } from "@luccello/ui";
import { discountPercent, stockState } from "@/lib/pricing";
import { useCatalogData } from "@/lib/catalog-client";
import { ProductCard } from "@/components/catalog/ProductCard";
import { addToCart } from "@/lib/cart-client";
import { SafeImage } from "@/components/common/SafeImage";
import { ProductReviews } from "@/components/product/ProductReviews";

export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { products } = useCatalogData();
  const state = stockState(product);
  const related = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.id !== product.id && item.categories.some((c) => product.categories.includes(c)),
        )
        .slice(0, 4),
    [product.id, products],
  );

  return (
    <>
      <section className="container product-detail">
        <div className="gallery">
          <SafeImage src={product.images[selectedImage]} alt={product.nameAr} />
          {product.images.length > 1 ? (
            <div className="thumbs">
              {product.images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`الصورة ${index + 1}`}
                  aria-pressed={selectedImage === index}
                >
                  <SafeImage src={image} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="product-info">
          <span className="sku">{product.sku}</span>
          <h1>{product.nameAr}</h1>
          <p className="muted">{product.shortDescriptionAr}</p>
          <div className="product-price">
            <strong>{formatSar(product.salePrice)}</strong>
            <del>{formatSar(product.regularPrice)}</del>
            <span>خصم {discountPercent(product)}%</span>
          </div>
          <p className={`stock stock-${state}`}>
            {state === "in_stock" ? "متوفر" : state === "low_stock" ? "كمية محدودة" : "غير متوفر"}
          </p>
          <label>
            اللون
            <select className="field" defaultValue={product.color}>
              <option>{product.color}</option>
            </select>
          </label>
          <div className="quantity" aria-label="الكمية">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
              <Minus size={18} />
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))}>
              <Plus size={18} />
            </button>
          </div>
          <button
            className="btn btn-primary add-wide"
            disabled={state === "out_of_stock"}
            type="button"
            onClick={() => addToCart(product.id, quantity)}
          >
            <ShoppingBag size={20} />
            أضف إلى السلة
          </button>
          <section className="note">
            <h2>ملاحظة المنتج</h2>
            <p>{product.notes}</p>
            {product.attachments?.map((attachment) => (
              <Link href={attachment.url} key={attachment.url}>
                {attachment.label}
              </Link>
            ))}
          </section>
        </div>
      </section>
      <section className="container product-tabs">
        <div>
          <h2>الوصف</h2>
          <p>{product.descriptionAr}</p>
        </div>
        <div>
          <h2>المواصفات</h2>
          <dl>
            <dt>الخامة</dt>
            <dd>{product.material}</dd>
            <dt>الأبعاد</dt>
            <dd>{product.dimensions}</dd>
            <dt>المخزون</dt>
            <dd>{product.inventoryQuantity}</dd>
          </dl>
        </div>
        <ProductReviews productId={product.id} />
      </section>
      <section className="container section">
        <div className="section-title">
          <h2>منتجات مشابهة</h2>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}
