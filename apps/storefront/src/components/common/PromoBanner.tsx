import Link from "next/link";
import { publicPath } from "@/lib/public-path";

export function PromoBanner() {
  return (
    <section className="promo-banner" aria-label="عرض جديد">
      <img src={publicPath("/hero-campaign.png")} alt="عرض LU'CHÉLO الجديد" />
      <div className="promo-banner__overlay">
        <span>NEW DROP</span>
        <h2>اختاري حقيبتك الجديدة</h2>
        <p>شحن فوري · توصيل مجاني · كود الخصم L10</p>
        <Link className="btn promo-banner__cta" href="/ar/offers">
          اكتشفي العروض
        </Link>
      </div>
    </section>
  );
}
