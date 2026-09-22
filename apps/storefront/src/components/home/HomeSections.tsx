import Link from "next/link";
import { categories, products, testimonials } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export function HeroSlider() {
  return (
    <section className="hero">
      <img src="/hero-campaign.png" alt="حقيبة فاخرة ضمن حملة موسمية" />
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
      <img src="/hero-campaign.png" alt="عرض موسمي على الحقائب" />
      <div>
        <span>لفترة محدودة</span>
        <h2>الأكثر مبيعا بـ 196 ريال</h2>
        <Link className="btn btn-outline" href="/ar/offers">
          اطلبي الآن
        </Link>
      </div>
    </section>
  );
}

export function CategoryNavigation() {
  return (
    <section className="container section">
      <div className="section-title">
        <h2>تسوقي حسب الفئة</h2>
      </div>
      <div className="category-grid">
        {categories.slice(1).map((category) => (
          <Link className="category-card" href={`/ar/category/${category.slug}`} key={category.id}>
            <img src={category.image} alt="" />
            <h3>{category.nameAr}</h3>
            <p>{category.nameEn}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FeaturedCollection() {
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
