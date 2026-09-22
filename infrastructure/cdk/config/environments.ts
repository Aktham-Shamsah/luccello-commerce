export type EnvironmentName = "dev" | "staging" | "production";

export type EnvironmentConfig = {
  envName: EnvironmentName;
  region: string;
  auroraMinAcu: number;
  auroraMaxAcu: number;
  apiRateLimit: number;
  wafRateLimit: number;
  budgetWarningUsd: number;
  budgetCriticalUsd: number;
  deletionProtection: boolean;
};

export const environments: Record<EnvironmentName, EnvironmentConfig> = {
  dev: {
    envName: "dev",
    region: "me-south-1",
    auroraMinAcu: 0.5,
    auroraMaxAcu: 2,
    apiRateLimit: 60,
    wafRateLimit: 1200,
    budgetWarningUsd: 40,
    budgetCriticalUsd: 80,
    deletionProtection: false,
  },
  staging: {
    envName: "staging",
    region: "me-south-1",
    auroraMinAcu: 0.5,
    auroraMaxAcu: 4,
    apiRateLimit: 120,
    wafRateLimit: 1800,
    budgetWarningUsd: 75,
    budgetCriticalUsd: 150,
    deletionProtection: true,
  },
  production: {
    envName: "production",
    region: "me-south-1",
    auroraMinAcu: 0.5,
    auroraMaxAcu: 8,
    apiRateLimit: 240,
    wafRateLimit: 3000,
    budgetWarningUsd: 150,
    budgetCriticalUsd: 300,
    deletionProtection: true,
  },
};
