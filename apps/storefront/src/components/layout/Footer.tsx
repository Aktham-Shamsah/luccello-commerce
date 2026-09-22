import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <section>
          <h3>روابط مهمة</h3>
          <Link href="/ar/about">عن المتجر</Link>
          <Link href="/ar/returns">سياسة الاستبدال والاسترجاع</Link>
          <Link href="/ar/privacy">الخصوصية</Link>
          <Link href="/ar/terms">الشروط والأحكام</Link>
        </section>
        <section className="footer-about">
          <h3>LU&apos;CHÉLO</h3>
          <p>حقائب مختارة بتصميم أنيق وتجربة تسوق عربية سهلة وسريعة على الجوال والكمبيوتر.</p>
        </section>
        <section>
          <h3>تواصل معنا</h3>
          <a href="#" aria-disabled="true">
            <MessageCircle size={18} /> واتساب
          </a>
          <span className="muted">رقم الدعم سيضاف لاحقاً</span>
        </section>
      </div>
      <div className="footer-bottom">© 2026 LU&apos;CHÉLO</div>
    </footer>
  );
}
