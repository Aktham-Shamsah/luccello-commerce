import { Router } from "express";
import { and, desc, eq } from "drizzle-orm";
import { productReviews, products } from "@luccello/database";
import { reviewSchema } from "@luccello/contracts";
import { getDatabase } from "../../shared/database/client.js";
import { rateLimit } from "../../shared/security/rate-limit.js";
import { rateLimits } from "@luccello/config";

export const reviewRouter = Router();

reviewRouter.get("/", async (req, res, next) => {
  const productId = req.query.productId;
  if (typeof productId !== "string" || !/^[a-f0-9-]{36}$/i.test(productId)) {
    res.status(400).json({ error: "invalid_product_id" });
    return;
  }
  try {
    const rows = await getDatabase()
      .select({
        id: productReviews.id,
        rating: productReviews.rating,
        title: productReviews.title,
        body: productReviews.body,
        createdAt: productReviews.createdAt,
      })
      .from(productReviews)
      .where(and(eq(productReviews.productId, productId), eq(productReviews.status, "approved")))
      .orderBy(desc(productReviews.createdAt))
      .limit(30);
    const average = rows.length
      ? Math.round((rows.reduce((sum, r) => sum + r.rating, 0) / rows.length) * 10) / 10
      : null;
    res.json({ reviews: rows, count: rows.length, average });
  } catch (error) {
    next(error);
  }
});

reviewRouter.post("/", rateLimit(rateLimits.reviews), async (req, res, next) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error" });
    return;
  }
  try {
    const [product] = await getDatabase()
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, parsed.data.productId), eq(products.published, true)));
    if (!product) {
      res.status(404).json({ error: "product_not_found" });
      return;
    }
    await getDatabase()
      .insert(productReviews)
      .values({ ...parsed.data, status: "pending" });
    res.status(202).json({ status: "pending_moderation" });
  } catch (error) {
    next(error);
  }
});
