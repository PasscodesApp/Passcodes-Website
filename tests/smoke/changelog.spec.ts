import { test, expect } from "../fixtures/base-test";

test.describe("Changelog Smoke & Detail Page Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/changelog/");
    });

    test("changelog index loads and displays timeline stream", async ({ page }) => {
        await expect(page).toHaveTitle(/Passcodes/i);
        await expect(page.getByRole("heading", { name: "Release Highlights & Milestones", level: 1 })).toBeVisible();

        // Articles/timeline entries render
        const articles = page.locator("article");
        await expect(articles.first()).toBeVisible();

        // Latest release (v3.2.1) is present
        await expect(page.getByText("v3.2.1").first()).toBeVisible();
    });

    test("historical releases display deprecated and yanked indicators appropriately", async ({ page }) => {
        // v2.1.1 should have Deprecated tag
        const v2Entry = page.locator("article").filter({ hasText: /v2\.1\.1/i }).first();
        await expect(v2Entry).toBeVisible();
        await expect(v2Entry.locator(".tag.deprecated")).toBeVisible();

        // v1.2.0 should display Yanked tag and Deprecated tag
        const v120Entry = page.locator("article").filter({ has: page.getByRole("heading", { name: /v1\.2\.0/i }) }).first();
        await expect(v120Entry).toBeVisible();
        await expect(v120Entry.locator(".tag.deprecated")).toBeVisible();
        await expect(v120Entry.locator(".tag").filter({ hasText: /yanked/i })).toBeVisible();
    });

    test("release detail page loads with metadata and navigates back", async ({ page }) => {
        // Navigate to v3.2.1 detail page
        await page.goto("/changelog/v3-2-1-stable/");

        await expect(page).toHaveTitle(/v3\.2\.1.*Passcodes Changelog/i);
        const titleHeading = page.getByRole("heading", { level: 1 });
        await expect(titleHeading).toBeVisible();
        await expect(titleHeading).toContainText("v3.2.1");

        // Release Highlights or sections are visible
        await expect(page.getByText(/Release Highlights/i)).toBeVisible();

        // Back link works
        const backLink = page.getByRole("link", { name: /Back to all updates/i });
        await expect(backLink).toBeVisible();
        await backLink.click();
        await expect(page).toHaveURL(/\/changelog\/?$/);
    });

    test("deprecated release detail page displays deprecation notice banner", async ({ page }) => {
        // Navigate to deprecated release detail page
        await page.goto("/changelog/v2-1-1-beta/");

        await expect(page).toHaveTitle(/v2\.1\.1.*Passcodes Changelog/i);
        await expect(page.locator(".tag.deprecated")).toContainText(/Deprecated Release/i);
        await expect(page.getByText(/Deprecated Release Notice/i)).toBeVisible();
    });
});
