import { test, expect } from "@playwright/test";

test.describe("RoleFit AI E2E Comprehensive Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto("/");
  });

  test("E2E Case 1: Landing Page renders hero title and navigates to /analyze via CTA", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Know how well your resume matches the job");

    // Click Analyze My Resume CTA
    await page.click('text="Analyze My Resume"');
    await expect(page).toHaveURL(/\/analyze$/);
    await expect(page.locator("h1")).toContainText("Analyze Resume vs Job Description");
  });

  test("E2E Case 2: Analyzer page displays dropzone, sample JD button, and character counter", async ({ page }) => {
    await page.goto("/analyze");

    await expect(page.locator("text=Upload Resume")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();

    // Click Load Sample JD
    await page.click('text="Load Sample JD"');
    const value = await page.locator("textarea").inputValue();
    expect(value.length).toBeGreaterThan(150);
  });

  test("E2E Case 3: Empty or short JD shows validation guidance", async ({ page }) => {
    await page.goto("/analyze");

    const textarea = page.locator("textarea");
    await textarea.fill("Short JD");
    await expect(page.locator("text=Recommended minimum length: 150 characters")).toBeVisible();
  });

  test("E2E Case 4: Analyze button is disabled when file or JD is incomplete", async ({ page }) => {
    await page.goto("/analyze");

    const analyzeBtn = page.locator('button:has-text("Analyze Role Fit")');
    await expect(analyzeBtn).toBeDisabled();
  });

  test("E2E Case 5: Responsive layout rendering on mobile viewport (375x812)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/analyze");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("E2E Case 6: Navigation pages (Privacy & About) render correctly", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy & Disclosures");

    await page.goto("/about");
    await expect(page.locator("h1")).toContainText("About RoleFit AI");
  });
});
