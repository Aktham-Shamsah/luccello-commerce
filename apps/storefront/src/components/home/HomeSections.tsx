"use client";

import Link from "next/link";
import { testimonials } from "@/lib/catalog";
import { useCatalogData } from "@/lib/catalog-client";
import { categoryHref } from "@/lib/catalog-links";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SafeImage } from "@/components/common/SafeImage";
import { publicPath } from "@/lib/public-path";

export function HeroSlider() {
  return (
    <section className="hero">
      <SafeImage src={publicPath("/hero-campaign.png")} alt="حقيبة فاخرة ضمن حملة موسمية" />
      <div className="hero-copy animate-reveal">
        <p>عزنا بكرمنا</p>
        <h1>لأنك تستحقين الأفضل</h1>
        <Link className="btn btn-primary" href="/ar/offers">
          تسوقي العروض
        </Link>
      </div>
    </section>
  );
}

export function CampaignBanner() {
  return (
    <section className="container campaign">
      <SafeImage src={publicPath("/hero-campaign.png")} alt="عرض موسمي على الحقائب" />
      <div>
        <span>لفترة محدودة</span>
        <h2>الأكثر مبيعا بـ 196 شيكل</h2>
        <Link className="btn btn-outline" href="/ar/offers">
          اطلبي الآن
        </Link>
      </div>
    </section>
  );
}

export function CategoryNavigation() {
  const { categories } = useCatalogData();
  const visibleCategories = categories.filter((category) => category.slug !== "all");
  return (
    <section className="container section">
      <div className="section-title">
        <h2>تسوقي حسب الفئة</h2>
      </div>
      <div className="category-grid">
        {visibleCategories.map((category) => (
          <Link className="category-card" href={categoryHref(category.slug)} key={category.id}>
            <SafeImage src={category.image} alt="" />
            <h3>{category.nameAr}</h3>
            <p>{category.nameEn}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FeaturedCollection() {
  const { products } = useCatalogData();
  return (
    <section className="container section">
      <div className="section-title">
        <h2>الأكثر مبيعا</h2>
        <Link className="btn btn-outline" href="/ar/products">
          عرض الكل
        </Link>
      </div>
      <div className="product-grid">
        {products
          .filter((product) => product.featured)
          .slice(0, 8)
          .map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
    </section>
  );
}

export function NewestProducts() {
  const { products } = useCatalogData();
  return (
    <section className="section panel-band">
      <div className="container">
        <div className="section-title">
          <h2>وصل حديثا</h2>
          <Link className="btn btn-outline" href="/ar/latest">
            عرض الكل
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((product) => product.newest)
            .slice(0, 8)
            .map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialCarousel() {
  return (
    <section className="container section">
      <div className="section-title">
        <h2>آراء العملاء</h2>
        <Link className="btn btn-outline" href="/ar/testimonials">
          عرض الكل
        </Link>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name}>
            <div aria-label={`${testimonial.rating} نجوم`}>★★★★★</div>
            <blockquote>{testimonial.body}</blockquote>
            <figcaption>{testimonial.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <h2>تابعي وصول القطع الجديدة</h2>
        <form>
          <input
            className="field"
            type="email"
            placeholder="البريد الإلكتروني"
            aria-label="البريد الإلكتروني"
          />
          <button className="btn btn-primary" type="submit">
            اشتراك
          </button>
        </form>
      </div>
    </section>
  );
}

export function CategoryShowcaseSections() {
  const { categories, products } = useCatalogData();
  const visibleCategories = categories.filter((category) => category.slug !== "all");
  return (
    <div className="category-showcases">
      {visibleCategories.map((category) => {
        const categoryProducts = products
          .filter((product) => product.categories.includes(category.slug))
          .slice(0, 4);

        return (
          <section className="container section category-showcase" key={category.id}>
            <Link className="category-wide-banner" href={categoryHref(category.slug)}>
              <SafeImage src={category.image} alt={category.nameAr} />
              <div>
                <span>{category.nameEn}</span>
                <h2>{category.nameAr}</h2>
                <strong>عرض الكل</strong>
              </div>
            </Link>
            <div className="product-grid category-product-grid">
              {categoryProducts.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
