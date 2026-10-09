import { z } from "zod";

export { rateLimits, type RateLimitPolicy } from "./rate-limits.js";

// Provider-neutral configuration for local Node.js and Docker deployments.
export const appConfigSchema = z.object({
  appEnv: z.enum(["local", "dev", "staging", "production"]).default("local"),
  databaseUrl: z.string().url(),
  version: z.string().default("0.1.0-local-ready"),
  gitSha: z.string().default("local"),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  return appConfigSchema.parse({
    appEnv: env.APP_ENV ?? "local",
    databaseUrl: env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/luccello",
    version: env.VERSION ?? "0.1.0-local-ready",
    gitSha: env.GIT_SHA ?? "local",
  });
}
