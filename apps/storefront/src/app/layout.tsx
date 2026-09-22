import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "LU'CHÉLO | حقائب نسائية",
  description: "متجر LU'CHÉLO للحقائب بتجربة عربية RTL وأسعار وعروض واضحة.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
