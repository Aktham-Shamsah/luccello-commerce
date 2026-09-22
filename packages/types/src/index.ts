export type Currency = "ILS";

export type StockState = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  nameAr: string;
  nameEn?: string;
  shortDescriptionAr: string;
  descriptionAr: string;
  salePrice: number;
  regularPrice: number;
  currency: Currency;
  categories: string[];
  images: string[];
  color: string;
  material: string;
  dimensions: string;
  inventoryQuantity: number;
  lowStockThreshold: number;
  published: boolean;
  featured: boolean;
  newest: boolean;
  sale: boolean;
  notes?: string;
  attachments?: Array<{ label: string; url: string }>;
  seoTitle: string;
  seoDescription: string;
  relatedProductIds: string[];
};

export type Category = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  image: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  nameAr: string;
  unitPrice: number;
  regularPrice: number;
  quantity: number;
  image: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  couponCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export type DomainEvent =
  | { type: "OrderCreated"; version: 1; orderId: string; cartId: string }
  | { type: "PaymentSucceeded"; version: 1; orderId: string; paymentId: string }
  | { type: "PaymentFailed"; version: 1; orderId: string; paymentId: string; reason: string }
  | { type: "InventoryReserved"; version: 1; reservationId: string; orderId: string }
  | { type: "InventoryReleased"; version: 1; reservationId: string; orderId: string }
  | { type: "OrderConfirmed"; version: 1; orderId: string }
  | { type: "OrderCancelled"; version: 1; orderId: string; reason: string }
  | { type: "ShipmentCreated"; version: 1; orderId: string; trackingCode: string }
  | { type: "ReviewSubmitted"; version: 1; reviewId: string; productId: string };
