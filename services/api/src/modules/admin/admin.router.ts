import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  bannerAdminPatchSchema,
  bannerAdminSchema,
  categoryAdminPatchSchema,
  categoryAdminSchema,
  inventoryAdminSchema,
  imageUploadSchema,
  productAdminPatchSchema,
  productAdminSchema,
} from "./admin.schemas.js";
import {
  createAdminBanner,
  createAdminCategory,
  createAdminProduct,
  deleteAdminBanner,
  deleteAdminCategory,
  deleteAdminProduct,
  getAdminDashboard,
  listAdminBanners,
  listAdminCategories,
  listAdminOrders,
  listAdminProducts,
  listAdminUsers,
  updateAdminBanner,
  updateAdminCategory,
  updateAdminInventory,
  updateAdminProduct,
} from "./admin.repository.js";
import { saveAdminImage } from "./upload.service.js";

const idSchema = z.string().uuid();

function route(
  handler: (req: Request, res: Response) => Promise<void>,
): (req: Request, res: Response) => void {
  return (req, res) => {
    handler(req, res).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "admin_operation_failed";
      res.status(message.endsWith("_not_found") ? 404 : 500).json({
        error: message,
        requestId: res.locals.requestId,
      });
    });
  };
}

function parseId(raw: string | string[] | undefined, res: Response) {
  const parsed = idSchema.safeParse(Array.isArray(raw) ? raw[0] : raw);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_id", requestId: res.locals.requestId });
    return null;
  }
  return parsed.data;
}

export const adminRouter = Router();

adminRouter.post(
  "/upload",
  route(async (req, res) => {
    const parsed = imageUploadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    const publicBaseUrl = process.env.API_DOMAIN ?? `${req.protocol}://${req.get("host")}`;
    const url = await saveAdminImage(parsed.data, publicBaseUrl);
    res.status(201).json({ url });
  }),
);

adminRouter.get(
  "/dashboard",
  route(async (_req, res) => {
    res.json(await getAdminDashboard());
  }),
);

adminRouter.get(
  "/products",
  route(async (_req, res) => {
    res.json(await listAdminProducts());
  }),
);

adminRouter.get(
  "/categories",
  route(async (_req, res) => {
    res.json(await listAdminCategories());
  }),
);

adminRouter.get(
  "/banners",
  route(async (_req, res) => {
    res.json(await listAdminBanners());
  }),
);

adminRouter.get(
  "/users",
  route(async (_req, res) => {
    res.json(await listAdminUsers());
  }),
);

adminRouter.get(
  "/orders",
  route(async (_req, res) => {
    res.json(await listAdminOrders());
  }),
);

adminRouter.post(
  "/products",
  route(async (req, res) => {
    const parsed = productAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    const id = await createAdminProduct(parsed.data);
    res.status(201).json({ id });
  }),
);

adminRouter.patch(
  "/products/:id",
  route(async (req, res) => {
    const id = parseId(req.params.id, res);
    if (!id) return;
    const parsed = productAdminPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    await updateAdminProduct(id, parsed.data);
    res.status(204).end();
  }),
);

adminRouter.delete(
  "/products/:id",
  route(async (req, res) => {
    const id = parseId(req.params.id, res);
    if (!id) return;
    await deleteAdminProduct(id);
    res.status(204).end();
  }),
);

adminRouter.post(
  "/categories",
  route(async (req, res) => {
    const parsed = categoryAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    res.status(201).json(await createAdminCategory(parsed.data));
  }),
);

adminRouter.patch(
  "/categories/:id",
  route(async (req, res) => {
    const id = parseId(req.params.id, res);
    if (!id) return;
    const parsed = categoryAdminPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    await updateAdminCategory(id, parsed.data);
    res.status(204).end();
  }),
);

adminRouter.delete(
  "/categories/:id",
  route(async (req, res) => {
    const id = parseId(req.params.id, res);
    if (!id) return;
    await deleteAdminCategory(id);
    res.status(204).end();
  }),
);

adminRouter.post(
  "/banners",
  route(async (req, res) => {
    const parsed = bannerAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    res.status(201).json(await createAdminBanner(parsed.data));
  }),
);

adminRouter.patch(
  "/banners/:id",
  route(async (req, res) => {
    const id = parseId(req.params.id, res);
    if (!id) return;
    const parsed = bannerAdminPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    await updateAdminBanner(id, parsed.data);
    res.status(204).end();
  }),
);

adminRouter.delete(
  "/banners/:id",
  route(async (req, res) => {
    const id = parseId(req.params.id, res);
    if (!id) return;
    await deleteAdminBanner(id);
    res.status(204).end();
  }),
);

adminRouter.patch(
  "/inventory/:productId",
  route(async (req, res) => {
    const productId = parseId(req.params.productId, res);
    if (!productId) return;
    const parsed = inventoryAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", details: parsed.error.flatten() });
      return;
    }
    await updateAdminInventory(productId, parsed.data);
    res.status(204).end();
  }),
);
