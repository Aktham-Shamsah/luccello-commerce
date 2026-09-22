import type { NextFunction, Request, Response } from "express";
import { logger } from "@luccello/logging";

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ error: "not_found", requestId: res.locals.requestId });
}

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  void _next;
  logger.error("unhandled_request_error", {
    requestId: res.locals.requestId,
    reason: error instanceof Error ? error.message : "unknown",
  });

  res.status(500).json({ error: "internal_error", requestId: res.locals.requestId });
}
