import cors from "cors";
import express from "express";
import helmet from "helmet";
import { checkoutSchema, productSlugSchema } from "@luccello/contracts";
import { loadConfig, rateLimits } from "@luccello/config";
import { logger } from "@luccello/logging";
import { checkout } from "./modules/checkout/checkout.service.js";
import { inventorySnapshot } from "./modules/inventory/inventory.service.js";
import { productService } from "./modules/products/product.service.js";
import {
  findPublishedDatabaseProductBySlug,
  listPublishedDatabaseProducts,
} from "./modules/products/database-product.repository.js";
import { listDatabaseCategories } from "./modules/categories/category.repository.js";
import { listEnabledBanners } from "./modules/banners/banner.repository.js";
import { adminRouter } from "./modules/admin/admin.router.js";
import { adminAuthMiddleware } from "./modules/admin/admin-auth.middleware.js";
import { uploadDirectory } from "./modules/admin/upload.service.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";
import { idempotencyMiddleware } from "./middleware/idempotency.middleware.js";
import { loggingMiddleware } from "./middleware/logging.middleware.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { securityMiddleware } from "./middleware/security.middleware.js";
import { validateBody } from "./middleware/validation.middleware.js";
import { rateLimit } from "./shared/security/rate-limit.js";

const config = loadConfig(process.env);
const app = express();
const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(requestIdMiddleware);
app.use(loggingMiddleware);
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use("/uploads", express.static(uploadDirectory, { maxAge: "1d", immutable: false }));
app.use(express.json({ limit: "7mb" }));
app.use(securityMiddleware);

app.get("/version", (_req, res) => {
  res.json({ version: config.version, gitSha: config.gitSha, environment: config.appEnv });
});

app.get("/products", rateLimit(rateLimits.catalogRead), async (_req, res) => {
  try {
    const databaseProducts = await listPublishedDatabaseProducts();
    res.json(databaseProducts.length ? databaseProducts : productService.listPublished());
  } catch {
    res.json(productService.listPublished());
  }
});

app.get("/products/:slug", rateLimit(rateLimits.catalogRead), async (req, res) => {
  const parsedSlug = productSlugSchema.safeParse(req.params.slug);
  if (!parsedSlug.success) {
    res.status(400).json({ error: "validation_error", requestId: res.locals.requestId });
    return;
  }

  try {
    const databaseProduct = await findPublishedDatabaseProductBySlug(parsedSlug.data);
    res.json(databaseProduct ?? productService.getBySlug(parsedSlug.data));
  } catch {
    try {
      res.json(productService.getBySlug(parsedSlug.data));
    } catch {
      res.status(404).json({ error: "product_not_found", requestId: res.locals.requestId });
    }
  }
});

app.get("/categories", rateLimit(rateLimits.catalogRead), async (_req, res) => {
  try {
    res.json(await listDatabaseCategories());
  } catch {
    res.json([]);
  }
});

app.get("/banners", rateLimit(rateLimits.catalogRead), async (_req, res) => {
  try {
    res.json(await listEnabledBanners());
  } catch {
    res.json([]);
  }
});

app.get("/inventory", rateLimit(rateLimits.catalogRead), (_req, res) => {
  res.json(inventorySnapshot());
});

app.post(
  "/checkout",
  rateLimit(rateLimits.checkout),
  idempotencyMiddleware,
  validateBody(checkoutSchema),
  async (req, res) => {
    try {
      res.status(201).json(await checkout(req.body));
    } catch (error) {
      logger.warn("checkout_failed", {
        requestId: res.locals.requestId,
        reason: error instanceof Error ? error.message : "unknown",
      });
      res.status(409).json({ error: "checkout_failed", requestId: res.locals.requestId });
    }
  },
);

app.use("/admin", rateLimit(rateLimits.adminLogin), adminAuthMiddleware, adminRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 4000);
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => logger.info("api_started", { port }));
}

export { app };
