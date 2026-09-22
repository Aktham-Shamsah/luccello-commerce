import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 900 } },
    },
  ],
  webServer: {
    command: "corepack pnpm --filter @luccello/storefront dev",
    url: "http://localhost:3000/ar",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
