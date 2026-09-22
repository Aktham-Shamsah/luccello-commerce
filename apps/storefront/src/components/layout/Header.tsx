"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { categories } from "@/lib/catalog";
import { CART_EVENT, cartCount } from "@/lib/cart-client";
import { publicPath } from "@/lib/public-path";

export function Header() {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const refresh = () => setCartItems(cartCount());
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const nav = [
    { href: "/ar/products", label: "جميع المنتجات" },
    { href: "/ar/offers", label: "تخفيضات" },
    ...categories.slice(1).map((category) => ({
      href: `/ar/category/${category.slug}`,
      label: category.nameEn,
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
        <Link href="/ar" className="brand" aria-label="LU'CHÉLO">
          <img src={publicPath("/luchelo-logo.webp")} alt="LU'CHÉLO" />
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
          <Link
            className="icon-btn cart-dot"
            href="/ar/cart"
            aria-label={`السلة - ${cartItems} منتجات`}
          >
            <ShoppingCart size={22} />
            {cartItems > 0 ? <span className="cart-count">{cartItems}</span> : null}
          </Link>
        </div>
      </div>
      {open ? (
        <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="القائمة">
          <h2>القائمة</h2>
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
