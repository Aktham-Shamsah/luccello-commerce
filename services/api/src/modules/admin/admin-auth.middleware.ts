import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_LOCAL_KEY;
  const supplied = req.header("x-admin-key");
  if (expected && expected.length >= 24 && !expected.includes("CHANGE_ME") && supplied) {
    const a = Buffer.from(expected);
    const b = Buffer.from(supplied);
    if (a.length === b.length && timingSafeEqual(a, b)) {
      next();
      return;
    }
  }
  res.status(401).json({ error: "admin_auth_required", requestId: res.locals.requestId });
}
