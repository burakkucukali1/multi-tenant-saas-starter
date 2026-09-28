import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT ?? "3000";
const host = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: skipWebServer
    ? undefined
    : {
        // Invoke Next directly so Playwright's subprocess is not tied to Corepack/pnpm version.
        command: process.env.CI
          ? `node node_modules/next/dist/bin/next build && node node_modules/next/dist/bin/next start -p ${port} -H ${host}`
          : `node node_modules/next/dist/bin/next dev -p ${port} -H ${host}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ...process.env,
          PORT: port,
          HOSTNAME: host,
        },
      },
});
