ALTER TABLE "orders" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_line1" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_city" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_country" varchar(2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_service" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_idempotency_key_unique" UNIQUE("idempotency_key");