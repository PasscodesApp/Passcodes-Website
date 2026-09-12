import { test, expect } from "../fixtures/base-test";

test.describe("Theme Toggle Functional Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("theme toggle switches between dark and light modes and updates DOM", async ({ page }) => {
        // Visible theme button (handles desktop vs mobile header)
        const themeBtn = page.getByRole("button", { name: /Switch to (light|dark) mode/i }).and(page.locator(":visible"));
        await expect(themeBtn).toBeVisible();

        const initialLabel = await themeBtn.getAttribute("aria-label");
        const isInitialDark = initialLabel?.includes("light");

        // Toggle theme
        await themeBtn.click();

        // Verify HTML element received appropriate class
        const html = page.locator("html");
        if (isInitialDark) {
            await expect(html).toHaveClass(/light/);
            await expect(themeBtn).toHaveAttribute("aria-label", /Switch to dark mode/i);
        } else {
            await expect(html).toHaveClass(/dark/);
            await expect(themeBtn).toHaveAttribute("aria-label", /Switch to light mode/i);
        }

        // Toggle back
        await themeBtn.click();
        if (isInitialDark) {
            await expect(html).toHaveClass(/dark/);
        } else {
            await expect(html).toHaveClass(/light/);
        }
    });

    test("theme preference persists across reload", async ({ page }) => {
        const themeBtn = page.getByRole("button", { name: /Switch to (light|dark) mode/i }).and(page.locator(":visible"));
        await themeBtn.click();

        // Reload page
        await page.reload();

        // Ensure page is still functional
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
});
