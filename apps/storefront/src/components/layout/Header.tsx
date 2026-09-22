"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/catalog";

export function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { href: "/ar/products", label: "جميع المنتجات" },
    { href: "/ar/offers", label: "تخفيضات" },
    ...categories.slice(1).map((category) => ({
      href: `/ar/category/${category.slug}`,
      label: category.nameAr,
    })),
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="icon-btn menu-btn"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="القائمة"
        >
          <Menu size={24} />
        </button>
        <Link href="/ar" className="brand" aria-label="لوشيلو">
          L&apos;uccello
        </Link>
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="icon-btn" href="/ar/search" aria-label="البحث">
            <Search size={22} />
          </Link>
          <Link className="icon-btn" href="/ar/account" aria-label="الحساب">
            <UserRound size={22} />
          </Link>
          <Link className="icon-btn cart-dot" href="/ar/cart" aria-label="السلة">
            <ShoppingCart size={22} />
          </Link>
        </div>
      </div>
      {open ? (
        <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="القائمة">
          <button
            className="icon-btn"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="إغلاق"
          >
            <X size={24} />
          </button>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
