import type { NextFunction, Request, Response } from "express";

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_LOCAL_KEY ?? "local-admin-key";
  const supplied = req.header("x-admin-key");

  if (supplied && supplied === expected) {
    next();
    return;
  }

  res.status(401).json({
    error: "admin_auth_required",
    requestId: res.locals.requestId,
  });
}
