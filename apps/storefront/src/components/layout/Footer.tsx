import Link from "next/link";
import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";

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
          <h3>L&apos;uccello</h3>
          <p>
            متجر تجريبي مستقل يقدم تجربة عربية RTL مستوحاة من بنية متجر حقائب حديث، مع أصول ومحتوى
            خياليين غير مرتبطين بالعلامة المرجعية.
          </p>
        </section>
        <section>
          <h3>معلومات المتجر</h3>
          <a href="https://wa.me/966500000000">
            <MessageCircle size={18} /> واتساب
          </a>
          <a href="tel:+966500000000">
            <Phone size={18} /> الجوال
          </a>
          <a href="mailto:hello@example.test">
            <Mail size={18} /> البريد الإلكتروني
          </a>
          <a href="https://instagram.com" rel="noreferrer">
            <Instagram size={18} /> انستغرام
          </a>
        </section>
      </div>
      <div className="footer-bottom">
        2026 منصة تجريبية مفتوحة المصدر. لا تستخدم بيانات إنتاجية.
      </div>
    </footer>
  );
}
