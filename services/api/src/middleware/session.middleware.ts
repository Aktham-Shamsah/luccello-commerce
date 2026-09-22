import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { userSessions } from "@luccello/database";
import type { NextFunction, Request, Response } from "express";
import { getDatabase } from "../shared/database/client.js";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = "luccello_session";

function hash(value: string) {
  const salt = process.env.SESSION_HASH_SALT ?? "local-development-session-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

function readCookie(header: string | undefined, name: string) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

function fingerprint(value: string | undefined) {
  return value ? hash(value).slice(0, 64) : null;
}
export async function ensureSession(req: Request, res: Response) {
  const db = getDatabase();
  const token = readCookie(req.header("cookie"), COOKIE_NAME);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  if (token) {
    const [existing] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.tokenHash, hash(token)),
          gt(userSessions.expiresAt, now),
          isNull(userSessions.revokedAt),
        ),
      );
    if (existing) {
      await db
        .update(userSessions)
        .set({ lastSeenAt: now, updatedAt: now })
        .where(eq(userSessions.id, existing.id));
      res.locals.session = existing;
      return existing;
    }
  }

  const nextToken = randomBytes(32).toString("base64url");
  const [created] = await db
    .insert(userSessions)
    .values({
      tokenHash: hash(nextToken),
      ipHash: fingerprint(req.ip),
      userAgentHash: fingerprint(req.header("user-agent")),
      expiresAt,
      lastSeenAt: now,
    })
    .returning();
  if (!created) throw new Error("session_create_failed");

  res.cookie(COOKIE_NAME, nextToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS,
  });
  res.locals.session = created;
  return created;
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  void ensureSession(req, res).then(() => next(), next);
}
