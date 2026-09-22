import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        requestId: res.locals.requestId,
        issues: parsed.error.issues,
      });
      return;
    }

    req.body = parsed.data;
    next();
  };
}
