import type { NextFunction, Request, Response } from "express";
import type { RateLimitPolicy } from "@luccello/config";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(policy: RateLimitPolicy) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${req.ip ?? "unknown"}:${req.path}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + policy.windowMs });
      next();
      return;
    }

    current.count += 1;
    if (current.count > policy.limit) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader("retry-after", String(retryAfter));
      res.status(429).json({ error: "rate_limited", requestId: res.locals.requestId });
      return;
    }

    next();
  };
}
