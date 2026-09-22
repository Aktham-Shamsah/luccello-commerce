import "./../styles/globals.css";

export const metadata = {
  title: "LU'CHÉLO Admin",
  robots: "noindex,nofollow",
};

const links = [
  ["#dashboard", "الرئيسية"],
  ["#products", "المنتجات والمخزون"],
  ["#categories", "الفئات"],
  ["#banners", "البانرات"],
  ["#analytics", "التحليلات"],
  ["#advertising-metrics", "مؤشرات الإعلانات"],
  ["#user-activity", "نشاط المستخدمين"],
  ["#orders", "المشتريات"],
  ["#users", "المستخدمون"],
] as const;

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <h1>LU&apos;CHÉLO إدارة</h1>
            <nav>
              {links.map(([href, label]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
