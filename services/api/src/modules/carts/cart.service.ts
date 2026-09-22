import type { CartItem } from "@luccello/types";

export function authoritativeCartTotals(items: CartItem[], couponCode?: string) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = couponCode === "L10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 196 ? 0 : 30;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
