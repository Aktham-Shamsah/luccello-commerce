# Database

The Drizzle schema includes users, roles, addresses, products, product images, variants, attributes, categories, inventory, reservations, carts, orders, payments, refunds, shipping, coupons, reviews, testimonials, banners, collections, pages, settings, analytics, metrics, notifications, audit logs, and idempotency keys.

Order creation must use transactions:

1. Lock inventory rows.
2. Validate available quantity.
3. Create reservation.
4. Create pending order and items.
5. Commit.
6. Convert reservation into inventory movement only after verified payment.
