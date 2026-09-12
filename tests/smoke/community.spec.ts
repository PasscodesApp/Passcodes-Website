import { test, expect } from "../fixtures/base-test";

test.describe("Community Page Smoke Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/community/");
    });

    test("community page loads and displays contributors", async ({ page }) => {
        await expect(page).toHaveTitle(/Community/i);
        await expect(page.getByRole("heading", { name: "Community", level: 1 })).toBeVisible();

        // Established contributors appear
        await expect(page.getByRole("heading", { name: "Jeel Dobariya" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Harsha Vardhan Burra" })).toBeVisible();
    });

    test("A Guy community manager card renders without misleading links", async ({ page }) => {
        // Find "A Guy" contributor card
        const guyCard = page.locator(".card").filter({ hasText: "A Guy" });
        await expect(guyCard).toBeVisible();
        await expect(guyCard).toHaveCount(1);

        // Role should be Community Manager
        await expect(guyCard.locator(".role")).toHaveText("Community Manager");

        // The card must not have empty or misleading external links
        const externalLinks = guyCard.locator("a");
        await expect(externalLinks).toHaveCount(0);
    });

    test("established contributors have appropriate social/GitHub links", async ({ page }) => {
        const harshaCard = page.locator(".card").filter({ hasText: "Harsha Vardhan Burra" });
        await expect(harshaCard).toBeVisible();

        // Verify GitHub link
        const githubLink = harshaCard.locator("a[href*='github.com/harsha-vardhan-burra']");
        await expect(githubLink).toBeVisible();
    });
});
