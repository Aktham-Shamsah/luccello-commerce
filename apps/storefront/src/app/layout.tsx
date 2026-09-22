import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "L'uccello Demo Store",
  description: "Arabic RTL ecommerce platform demo with original assets.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
