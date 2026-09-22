import type { NextFunction, Request, Response } from "express";

const blockedMethods = new Set(["TRACE", "TRACK"]);

export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  if (blockedMethods.has(req.method.toUpperCase())) {
    res.status(405).json({ error: "method_not_allowed", requestId: res.locals.requestId });
    return;
  }

  res.setHeader("cache-control", req.method === "GET" ? "no-store" : "no-store");
  next();
}
