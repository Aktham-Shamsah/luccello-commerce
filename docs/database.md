# Database

The Drizzle schema includes users, roles, addresses, products, product images, variants, attributes, categories, inventory, reservations, carts, orders, payments, refunds, shipping, coupons, reviews, testimonials, banners, collections, pages, settings, analytics, metrics, notifications, audit logs, and idempotency keys.

Cash-on-delivery order creation uses a PostgreSQL transaction to lock inventory rows, validate available stock and authoritative prices, create confirmed orders and order items, decrement inventory, and record inventory movements. Admin cancellation restores stock. Online payment providers are not connected.
