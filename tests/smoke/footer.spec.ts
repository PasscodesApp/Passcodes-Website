import { test, expect } from "../fixtures/base-test";

test.describe("Footer Contributor Credit & Integrity Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("footer contains Design by @harsha-vardhan-burra credit pointing to GitHub", async ({ page }) => {
        const footer = page.locator("footer.site-footer");
        await expect(footer).toBeVisible();

        // The attribution text "Design by" is visible in footer
        await expect(footer.getByText(/Design by/i)).toBeVisible();

        // The link with handle @harsha-vardhan-burra
        const creditLink = footer.getByRole("link", { name: /@harsha-vardhan-burra/i });
        await expect(creditLink).toBeVisible();
        await expect(creditLink).toHaveCount(1);
        await expect(creditLink).toHaveAttribute("href", "https://github.com/harsha-vardhan-burra");
        await expect(creditLink).toHaveAttribute("target", "_blank");
        await expect(creditLink).toHaveAttribute("rel", /noopener/);

        // Accessible label / title includes full name
        const accessibleName = await creditLink.getAttribute("aria-label");
        const titleAttr = await creditLink.getAttribute("title");
        const hasAccessibleIdentity =
            (accessibleName && accessibleName.includes("Harsha Vardhan Burra")) ||
            (titleAttr && titleAttr.includes("Harsha Vardhan Burra"));
        expect(hasAccessibleIdentity).toBe(true);
    });

    test("footer preserves privacy/security and copyright messaging", async ({ page }) => {
        const footer = page.locator("footer.site-footer");

        // Copyright message
        await expect(footer.getByText(/Copyright © Jeel Dobariya/i)).toBeVisible();

        // Privacy messaging
        await expect(footer.getByText(/Crafted for privacy and local control/i)).toBeVisible();
        await expect(footer.getByText(/zero cloud, zero trackers/i)).toBeVisible();
    });
});
