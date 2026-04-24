We need to produce the content for tests/dashboard.spec.ts as requested. The task is to add an integration test for the dashboard page using Playwright, checking summary cards load. No existing file content was provided, so we'll create a new file. The instruction says "Return only the requested code artifact for compile (unified diff or final file content)." Since no original file content, we provide final file content.

The file should be a Playwright test. It should test that the dashboard page loads and displays summary cards. Use typical Playwright test structure with import of test and expect from @playwright/test. The dashboard page is likely at /dashboard. We'll check that the page loads, and that there are elements matching "summary" or specific card selectors. Since we don't have exact selectors, we'll assume some generic ones like data-testid or role. For the purpose of a test, we can check that the page contains certain text like "Total Contacts" or similar.

We'll write a test that navigates to /dashboard and verifies that at least one summary card is present. Use await page.goto('/dashboard') and await expect(page.locator('[data-testid="summary-card"]')).toHaveCount(4) or similar. Since we lack exact implementation, we'll make reasonable assumptions. We'll also include a test for loading state? Probably just basic.

Additionally, we should consider authentication: the dashboard is protected, so we need to log in first. We'll include a login step using storageState or direct login via API. For simplicity, we'll use page.goto('/login') and fill credentials. We'll assume a test user with email/password. We'll also define a beforeEach to authenticate.

We'll produce the file content with proper imports and structure.
import { test, expect } from "@playwright/test";

test.describe("Dashboard page", () => {
  // Authenticate before each dashboard test
  test.beforeEach(async ({ page }) => {
    // Log in with test credentials
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    // Wait for redirect to dashboard
    await page.waitForURL("/dashboard");
  });

  test("should display summary cards after loading", async ({ page }) => {
    // Verify summary cards are rendered
    const summaryCards = page.locator('[data-testid="summary-card"]');
    await expect(summaryCards).toHaveCount(4);

    // Verify each card has a title and value
    const cardTitles = ["Total Contacts", "Active Deals", "Lead Conversion Rate", "Recent Activities"];
    for (const title of cardTitles) {
      await expect(page.locator(`[data-testid="summary-card"]`).filter({ hasText: title })).toBeVisible();
    }
  });

  test("should handle error state gracefully", async ({ page }) => {
    // Intercept the dashboard API request and force an error
    await page.route("**/api/dashboard/**", (route) => {
      route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Internal server error" }) });
    });

    await page.goto("/dashboard");
    // Expect an error alert or message to appear
    await expect(page.locator('[data-testid="dashboard-error"]')).toBeVisible();
  });
});