import { z } from "zod";

export const appConfigSchema = z.object({
  appEnv: z.enum(["local", "dev", "staging", "production"]).default("local"),
  awsRegion: z.string().default("me-south-1"),
  databaseUrl: z.string().url(),
  version: z.string().default("0.1.0-local-ready"),
  gitSha: z.string().default("local"),
  auroraMinAcu: z.coerce.number().positive().default(0.5),
  auroraMaxAcu: z.coerce.number().positive().default(8),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  return appConfigSchema.parse({
    appEnv: env.APP_ENV ?? "local",
    awsRegion: env.AWS_REGION ?? "me-south-1",
    databaseUrl: env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/luccello",
    version: env.VERSION ?? "0.1.0-local-ready",
    gitSha: env.GIT_SHA ?? "local",
    auroraMinAcu: env.AWS_AURORA_MIN_ACU ?? "0.5",
    auroraMaxAcu: env.AWS_AURORA_MAX_ACU ?? "8",
  });
}
