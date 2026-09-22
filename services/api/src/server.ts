import cors from "cors";
import express from "express";
import helmet from "helmet";
import { checkoutSchema } from "@luccello/contracts";
import { loadConfig } from "@luccello/config";
import { logger } from "@luccello/logging";
import { inventorySnapshot } from "./modules/inventory/inventory.service.js";
import { productService } from "./modules/products/product.service.js";
import { checkout } from "./modules/checkout/checkout.service.js";
import { rateLimit } from "./shared/security/rate-limit.js";

const config = loadConfig(process.env);
const app = express();

app.use(helmet());
app.use(
  cors({ origin: [/^http:\/\/localhost:3000$/, /^http:\/\/localhost:3001$/], credentials: true }),
);
app.use(express.json({ limit: "128kb" }));
app.use(rateLimit({ limit: 120, windowMs: 60_000 }));

app.get("/version", (_req, res) => {
  res.json({ version: config.version, gitSha: config.gitSha, environment: config.appEnv });
});

app.get("/products", (_req, res) => {
  res.json(productService.listPublished());
});

app.get("/products/:slug", (req, res) => {
  try {
    res.json(productService.getBySlug(req.params.slug));
  } catch {
    res.status(404).json({ error: "product_not_found" });
  }
});

app.get("/inventory", (_req, res) => {
  res.json(inventorySnapshot());
});

app.post("/checkout", async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", issues: parsed.error.issues });
    return;
  }
  try {
    res.status(201).json(await checkout(parsed.data));
  } catch (error) {
    logger.warn("checkout_failed", { reason: error instanceof Error ? error.message : "unknown" });
    res.status(409).json({ error: "checkout_failed" });
  }
});

app.use("/admin", (_req, res) => {
  res.status(401).json({ error: "admin_auth_required" });
});

const port = Number(process.env.PORT ?? 4000);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => logger.info("api_started", { port }));
}

export { app };
