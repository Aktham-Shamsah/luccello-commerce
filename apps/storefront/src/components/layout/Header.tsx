"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCatalogData } from "@/lib/catalog-client";
import { categoryHref } from "@/lib/catalog-links";
import { CART_EVENT, cartCount } from "@/lib/cart-client";
import { publicPath } from "@/lib/public-path";

export function Header() {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const { categories } = useCatalogData();

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
    { href: "/ar", label: "الرئيسية" },
    { href: "/ar/products", label: "جميع المنتجات" },
    { href: "/ar/latest", label: "أحدث المنتجات" },
    { href: "/ar/offers", label: "التخفيضات" },
    ...categories
      .filter((category) => category.slug !== "all")
      .map((category) => ({
        href: categoryHref(category.slug),
        label: category.nameAr,
      })),
    { href: "/ar/testimonials", label: "آراء العملاء" },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="menu-trigger"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="فتح القائمة"
        >
          <Menu size={22} />
          <span>القائمة</span>
        </button>
        <Link href="/ar" className="brand" aria-label="LU'CHÉLO">
          <img src={publicPath("/luchelo-mark.png")} alt="LU'CHÉLO" />
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
        <>
          <button
            className="mobile-panel-backdrop"
            type="button"
            aria-label="إغلاق القائمة"
            onClick={() => setOpen(false)}
          />
          <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="القائمة">
            <div className="mobile-panel__head">
              <img src={publicPath("/luchelo-mark.png")} alt="" />
              <button
                className="icon-btn"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
              >
                <X size={24} />
              </button>
            </div>
            <h2>القائمة</h2>
            <nav className="mobile-panel__links" aria-label="روابط القائمة">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
