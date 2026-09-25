import { test, expect } from "../fixtures/base-test";

test.describe("Mobile Responsive Usability Tests", () => {
    test("mobile navigation drawer opens and navigates", async ({ page, isMobile }) => {
        // Run mobile menu tests on mobile projects
        test.skip(!isMobile, "Mobile-specific drawer test only applies to mobile viewports");

        await page.goto("/");

        // Open menu button
        const menuBtn = page.getByRole("button", { name: "Open menu" });
        await expect(menuBtn).toBeVisible();
        await menuBtn.click();

        // Drawer should be open
        const mobileDrawer = page.locator("#mobile-menu");
        await expect(mobileDrawer).toBeVisible();

        // Navigation links visible inside drawer
        const downloadsLink = mobileDrawer.getByRole("link", { name: "Downloads" });
        await expect(downloadsLink).toBeVisible();
        await downloadsLink.click();

        await expect(page).toHaveURL(/\/downloads\/?$/);
    });

    test("downloads page does not horizontally overflow viewport on mobile", async ({ page, isMobile }) => {
        test.skip(!isMobile, "Horizontal overflow check targeted for mobile viewports");

        await page.goto("/downloads/");

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(hasHorizontalOverflow, "Page has unexpected horizontal overflow").toBe(false);
    });

    test("changelog page does not horizontally overflow viewport on mobile", async ({ page, isMobile }) => {
        test.skip(!isMobile, "Horizontal overflow check targeted for mobile viewports");

        await page.goto("/changelog/");

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(hasHorizontalOverflow, "Changelog has unexpected horizontal overflow").toBe(false);
    });

    test("homepage does not horizontally overflow viewport on mobile", async ({ page, isMobile }) => {
        test.skip(!isMobile, "Horizontal overflow check targeted for mobile viewports");

        await page.goto("/");

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(hasHorizontalOverflow, "Homepage has unexpected horizontal overflow").toBe(false);
    });

    test("release detail page does not horizontally overflow viewport on mobile", async ({ page, isMobile }) => {
        test.skip(!isMobile, "Horizontal overflow check targeted for mobile viewports");

        await page.goto("/changelog/v3-2-1-stable/");

        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(hasHorizontalOverflow, "Release detail page has unexpected horizontal overflow").toBe(false);
    });
});
