import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { advertisementMetrics, analyticsEvents, userSessions } from "@luccello/database";
import { getDatabase } from "../../shared/database/client.js";
import { sessionMiddleware } from "../../middleware/session.middleware.js";

const activitySchema = z.object({
  type: z.enum([
    "page_view",
    "product_view",
    "cart_add",
    "cart_remove",
    "search",
    "checkout_start",
  ]),
  path: z.string().max(500),
  productId: z.string().uuid().optional(),
});

const adEventSchema = z.object({
  bannerId: z.string().uuid(),
  eventType: z.enum(["impression", "click", "conversion"]),
  revenue: z.number().nonnegative().max(1_000_000).optional(),
});

const consentSchema = z.object({ analytics: z.boolean() });

export const analyticsRouter = Router();
analyticsRouter.use(sessionMiddleware);
analyticsRouter.get("/session", (_req, res) => {
  const session = res.locals.session as typeof userSessions.$inferSelect;
  res.json({
    active: true,
    expiresAt: session.expiresAt,
    analyticsConsent: session.analyticsConsent,
  });
});

analyticsRouter.post("/session/consent", async (req, res) => {
  const parsed = consentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
    return;
  }
  const session = res.locals.session as typeof userSessions.$inferSelect;
  await getDatabase()
    .update(userSessions)
    .set({ analyticsConsent: parsed.data.analytics, updatedAt: new Date() })
    .where(eq(userSessions.id, session.id));
  res.status(204).end();
});

analyticsRouter.post("/activity", async (req, res) => {
  const parsed = activitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
    return;
  }
  const session = res.locals.session as typeof userSessions.$inferSelect;
  if (!session.analyticsConsent) {
    res.status(204).end();
    return;
  }
  await getDatabase()
    .insert(analyticsEvents)
    .values({
      type: parsed.data.type,
      anonymousId: String(session.anonymousId),
      sessionId: session.id,
      userId: session.userId,
      payload: {
        path: parsed.data.path,
        ...(parsed.data.productId ? { productId: parsed.data.productId } : {}),
      },
    });
  res.status(204).end();
});

analyticsRouter.post("/advertisement", async (req, res) => {
  const parsed = adEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
    return;
  }
  const session = res.locals.session as typeof userSessions.$inferSelect;
  if (!session.analyticsConsent) {
    res.status(204).end();
    return;
  }
  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  const impressions = parsed.data.eventType === "impression" ? 1 : 0;
  const clicks = parsed.data.eventType === "click" ? 1 : 0;
  const conversions = parsed.data.eventType === "conversion" ? 1 : 0;
  const revenue = parsed.data.revenue ?? 0;

  await getDatabase()
    .insert(advertisementMetrics)
    .values({
      bannerId: parsed.data.bannerId,
      day,
      impressions,
      clicks,
      conversions,
      revenue: revenue.toFixed(2),
    })
    .onConflictDoUpdate({
      target: [advertisementMetrics.bannerId, advertisementMetrics.day],
      set: {
        impressions: sql`${advertisementMetrics.impressions} + ${impressions}`,
        clicks: sql`${advertisementMetrics.clicks} + ${clicks}`,
        conversions: sql`${advertisementMetrics.conversions} + ${conversions}`,
        revenue: sql`${advertisementMetrics.revenue} + ${revenue.toFixed(2)}::numeric`,
        updatedAt: new Date(),
      },
    });
  await getDatabase()
    .insert(analyticsEvents)
    .values({
      type: `ad_${parsed.data.eventType}`,
      anonymousId: String(session.anonymousId),
      sessionId: session.id,
      userId: session.userId,
      payload: { bannerId: parsed.data.bannerId, revenue },
    });
  res.status(204).end();
});
