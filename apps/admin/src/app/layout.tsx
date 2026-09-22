import "./../styles/globals.css";

export const metadata = {
  title: "Luccello Admin",
  robots: "noindex,nofollow",
};

const links = ["Dashboard", "Products", "Inventory", "Orders", "Metrics", "Security"];

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <h1>L&apos;uccello Admin</h1>
            <nav>
              {links.map((link) => (
                <a key={link} href="#">
                  {link}
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
