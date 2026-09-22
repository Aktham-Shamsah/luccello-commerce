"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@luccello/types";
import { formatSar } from "@luccello/ui";
import { discountPercent, stockState } from "@/lib/pricing";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { publicPath } from "@/lib/public-path";

export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const state = stockState(product);
  const related = useMemo(
    () => products.filter((item) => item.id !== product.id).slice(0, 4),
    [product.id],
  );

  return (
    <>
      <section className="container product-detail">
        <div className="gallery">
          <img src={product.images[0]} alt={product.nameAr} />
          <div className="thumbs">
            <img src={product.images[0]} alt="" />
            <img src={publicPath("/hero-campaign.png")} alt="" />
          </div>
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
              <option>عاجي</option>
              <option>أسود</option>
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
        <div>
          <h2>التقييمات</h2>
          <p>التقييمات تخضع للمراجعة قبل النشر لحماية تجربة العملاء ومنع المحتوى غير الملائم.</p>
        </div>
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
