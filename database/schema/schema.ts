import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "admin", "manager", "support"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "confirmed",
  "cancelled",
  "fulfilled",
  "refunded",
]);
export const moderationStatusEnum = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cognitoSub: varchar("cognito_sub", { length: 160 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    subIdx: uniqueIndex("users_cognito_sub_idx").on(table.cognitoSub),
  }),
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    role: roleEnum("role").notNull(),
  },
  (table) => ({ pk: primaryKey({ columns: [table.userId, table.role] }) }),
);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  line1: text("line1").notNull(),
  city: text("city").notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  ...timestamps,
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull(),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en"),
    parentId: uuid("parent_id"),
    ...timestamps,
  },
  (table) => ({ slugIdx: uniqueIndex("categories_slug_idx").on(table.slug) }),
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull(),
    sku: varchar("sku", { length: 80 }).notNull(),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en"),
    descriptionAr: text("description_ar").notNull(),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }).notNull(),
    regularPrice: numeric("regular_price", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    published: boolean("published").default(false).notNull(),
    featured: boolean("featured").default(false).notNull(),
    newest: boolean("newest").default(false).notNull(),
    sale: boolean("sale").default(false).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    skuIdx: uniqueIndex("products_sku_idx").on(table.sku),
  }),
);

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  sku: varchar("sku", { length: 80 }).notNull(),
  priceDelta: numeric("price_delta", { precision: 12, scale: 2 }).default("0").notNull(),
  attributes: jsonb("attributes").notNull(),
  ...timestamps,
});

export const productAttributes = pgTable("product_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const productAttributeValues = pgTable("product_attribute_values", {
  id: uuid("id").primaryKey().defaultRandom(),
  attributeId: uuid("attribute_id")
    .references(() => productAttributes.id)
    .notNull(),
  value: text("value").notNull(),
});

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id)
      .notNull(),
  },
  (table) => ({ pk: primaryKey({ columns: [table.productId, table.categoryId] }) }),
);

export const inventory = pgTable("inventory", {
  productId: uuid("product_id")
    .references(() => products.id)
    .primaryKey(),
  quantity: integer("quantity").notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(3).notNull(),
  ...timestamps,
});

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  quantityDelta: integer("quantity_delta").notNull(),
  reason: text("reason").notNull(),
  orderId: uuid("order_id"),
  ...timestamps,
});

export const inventoryReservations = pgTable("inventory_reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  releasedAt: timestamp("released_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  ...timestamps,
});

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  anonymousId: text("anonymous_id"),
  couponCode: text("coupon_code"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .references(() => carts.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  ...timestamps,
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  status: orderStatusEnum("status").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountTotal: numeric("discount_total", { precision: 12, scale: 2 }).notNull(),
  shippingTotal: numeric("shipping_total", { precision: 12, scale: 2 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  ...timestamps,
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  status: orderStatusEnum("status").notNull(),
  note: text("note"),
  ...timestamps,
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  provider: text("provider").notNull(),
  providerPaymentId: text("provider_payment_id").notNull(),
  status: text("status").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  ...timestamps,
});

export const refunds = pgTable("refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentTransactionId: uuid("payment_transaction_id")
    .references(() => paymentTransactions.id)
    .notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  ...timestamps,
});

export const shippingMethods = pgTable("shipping_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  provider: text("provider").notNull(),
  trackingCode: text("tracking_code"),
  status: text("status").notNull(),
  ...timestamps,
});

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 80 }).notNull(),
    type: text("type").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    minimumCart: numeric("minimum_cart", { precision: 12, scale: 2 }),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    maxUses: integer("max_uses"),
    perCustomerLimit: integer("per_customer_limit"),
    ...timestamps,
  },
  (table) => ({ codeIdx: uniqueIndex("coupons_code_idx").on(table.code) }),
);

export const couponUsage = pgTable("coupon_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  couponId: uuid("coupon_id")
    .references(() => coupons.id)
    .notNull(),
  userId: uuid("user_id").references(() => users.id),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  ...timestamps,
});

export const productReviews = pgTable("product_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  userId: uuid("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  status: moderationStatusEnum("status").default("pending").notNull(),
  ...timestamps,
});

export const storeTestimonials = pgTable("store_testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  body: text("body").notNull(),
  rating: integer("rating").notNull(),
  status: moderationStatusEnum("status").default("pending").notNull(),
  ...timestamps,
});

export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  href: text("href"),
  enabled: boolean("enabled").default(true).notNull(),
  ...timestamps,
});

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  nameAr: text("name_ar").notNull(),
  ...timestamps,
});

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: uuid("collection_id")
      .references(() => collections.id)
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
  },
  (table) => ({ pk: primaryKey({ columns: [table.collectionId, table.productId] }) }),
);

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  ...timestamps,
});

export const storeSettings = pgTable("store_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  ...timestamps,
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  anonymousId: text("anonymous_id"),
  userId: uuid("user_id").references(() => users.id),
  payload: jsonb("payload").notNull(),
  ...timestamps,
});

export const dailyStoreMetrics = pgTable("daily_store_metrics", {
  day: timestamp("day", { withTimezone: true }).primaryKey(),
  visitors: integer("visitors").notNull(),
  orders: integer("orders").notNull(),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).notNull(),
});

export const dailyProductMetrics = pgTable("daily_product_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  day: timestamp("day", { withTimezone: true }).notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  views: integer("views").notNull(),
  cartAdds: integer("cart_adds").notNull(),
  purchases: integer("purchases").notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  recipient: text("recipient").notNull(),
  status: text("status").notNull(),
  payload: jsonb("payload").notNull(),
  ...timestamps,
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target").notNull(),
  metadata: jsonb("metadata").notNull(),
  ...timestamps,
});

export const idempotencyKeys = pgTable("idempotency_keys", {
  key: text("key").primaryKey(),
  route: text("route").notNull(),
  responseHash: text("response_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});
