import { test, expect } from "../fixtures/base-test";

test.describe("Homepage Smoke Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("homepage loads successfully and displays core branding", async ({ page }) => {
        await expect(page).toHaveTitle(/Passcodes/i);
        const heading = page.getByRole("heading", { level: 1 });
        await expect(heading).toBeVisible();
        await expect(heading).toContainText("passwords");
    });

    test("hero section contains primary CTAs and release info", async ({ page }) => {
        // Primary Call to Action
        const downloadCTA = page.getByRole("link", { name: /Download for Android/i });
        await expect(downloadCTA).toBeVisible();
        await expect(downloadCTA).toHaveAttribute("href", "/downloads/");

        // GitHub Repository Link
        const githubCTA = page.getByRole("link", { name: /View on GitHub/i });
        await expect(githubCTA).toBeVisible();
        await expect(githubCTA).toHaveAttribute("href", /github\.com\/PasscodesApp\/Passcodes/);

        // Current release announcement badge
        const releasePill = page.getByRole("link", { name: /v3\.\d+\.\d+.*is live/i });
        await expect(releasePill).toBeVisible();
    });

    test("primary navigation links are functional", async ({ page }) => {
        const nav = page.getByRole("navigation", { name: "Main navigation" });

        // Downloads navigation
        const downloadsLink = nav.getByRole("link", { name: "Downloads" });
        if (await downloadsLink.isVisible()) {
            await downloadsLink.click();
            await expect(page).toHaveURL(/\/downloads\/?$/);
            await expect(page.getByRole("heading", { name: /Downloads/i, level: 1 })).toBeVisible();
        }
    });

    test("core trust features are presented", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "On-Device Storage" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Designed for Offline Privacy" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "100% Open Source" })).toBeVisible();
    });
});
