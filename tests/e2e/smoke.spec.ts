import { expect, test } from "@playwright/test";

const locale = "en";
const workspaceSlug = "e2e-smoke";

test.describe("route surfaces (ADR-0003)", () => {
  test("root redirects to default locale public home", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(`/${locale}`);
    await expect(
      page.getByRole("heading", { name: "Multi-Tenant SaaS Starter" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Public surface · locale: ${locale}`),
    ).toBeVisible();
  });

  test("public home renders", async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(
      page.getByRole("heading", { name: "Multi-Tenant SaaS Starter" }),
    ).toBeVisible();
  });

  test("tenant workspace route renders", async ({ page }) => {
    await page.goto(`/${locale}/t/${workspaceSlug}`);
    await expect(
      page.getByRole("heading", { name: "Workspace" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Tenant surface · ${locale} / ${workspaceSlug}`),
    ).toBeVisible();
  });

  test("platform admin route renders", async ({ page }) => {
    await page.goto(`/${locale}/admin`);
    await expect(
      page.getByRole("heading", { name: "Platform administration" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Platform surface · locale: ${locale}`),
    ).toBeVisible();
  });
});
