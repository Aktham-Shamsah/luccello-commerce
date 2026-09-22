"use client";

import { recordActivity } from "@/lib/analytics-client";

export type StoredCartItem = {
  productId: string;
  quantity: number;
};

const CART_KEY = "luchelo-cart-v1";
export const CART_EVENT = "luchelo-cart-updated";

export function readCart(): StoredCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredCartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StoredCartItem).productId === "string" &&
        Number.isInteger((item as StoredCartItem).quantity) &&
        (item as StoredCartItem).quantity > 0,
    );
  } catch {
    return [];
  }
}
function saveCart(items: StoredCartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(productId: string, quantity = 1) {
  const items = readCart();
  const existing = items.find((item) => item.productId === productId);
  if (existing) existing.quantity = Math.min(20, existing.quantity + quantity);
  else items.push({ productId, quantity: Math.min(20, Math.max(1, quantity)) });
  saveCart(items);
  void recordActivity("cart_add", window.location.pathname, productId);
}

export function removeFromCart(productId: string) {
  saveCart(readCart().filter((item) => item.productId !== productId));
  void recordActivity("cart_remove", window.location.pathname, productId);
}

export function cartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}
