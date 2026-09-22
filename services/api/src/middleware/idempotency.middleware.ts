import type { NextFunction, Request, Response } from "express";

const keyPattern = /^[A-Za-z0-9._:-]{12,120}$/;

export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.header("idempotency-key");
  if (!key || !keyPattern.test(key)) {
    res.status(400).json({ error: "idempotency_key_required", requestId: res.locals.requestId });
    return;
  }

  if (typeof req.body === "object" && req.body !== null) {
    req.body = { ...req.body, idempotencyKey: key };
  }
  next();
}
