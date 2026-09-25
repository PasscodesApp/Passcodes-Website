import { test, expect } from "../fixtures/base-test";

test.describe("Downloads Page Smoke & Regression Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/downloads/");
    });

    test("downloads page loads and displays release archive", async ({ page }) => {
        await expect(page).toHaveTitle(/Downloads/i);
        await expect(page.getByRole("heading", { name: "Downloads & Releases", level: 1 })).toBeVisible();

        // Release list container
        const releaseCards = page.locator(".release-card");
        await expect(releaseCards.first()).toBeVisible();
    });

    test("recommended production build displays architecture download options", async ({ page }) => {
        // Recommended production build section
        await expect(page.getByText("Recommended Production Build")).toBeVisible();

        // Download controls are rendered
        const downloadOptions = page.locator(".arch-download-btn, .arch-dropdown, a[href*='.apk']");
        await expect(downloadOptions.first()).toBeVisible();

        // Link to release notes & milestones in /changelog
        const releaseNotesLink = page.getByRole("link", { name: /Release notes & milestones/i });
        await expect(releaseNotesLink).toBeVisible();
        await expect(releaseNotesLink).toHaveAttribute("href", /\/changelog\/?/);

        // Download cards contain "View in Project Updates" link
        const updatesLink = page.getByRole("link", { name: /View in Project Updates/i }).first();
        await expect(updatesLink).toBeVisible();
        await expect(updatesLink).toHaveAttribute("href", /\/changelog/);

        // Setup guide link prompt is visible below recommended build
        const setupLink = page.getByRole("link", { name: "Installation & Setup Guide" });
        await expect(setupLink).toBeVisible();

        // Channel explanation text is visible
        await expect(page.getByText(/Displaying all recorded releases across active/i)).toBeVisible();
    });

    test("deprecated v1.x and v2.x releases display deprecation indicators while v3.x does not", async ({ page }) => {
        // v3.2.1 is current/stable and must NOT be marked deprecated
        const v3Card = page.locator(".release-card").filter({ hasText: /v3\.2\.1/i }).first();
        await expect(v3Card).toBeVisible();
        await expect(v3Card.locator(".tag.deprecated")).toHaveCount(0);

        // v2.1.1 is an older major version and MUST display deprecated badge
        const v2Card = page.locator(".release-card").filter({ hasText: /v2\.1\.1/i }).first();
        await expect(v2Card).toBeVisible();
        await expect(v2Card.locator(".tag.deprecated")).toBeVisible();
        await expect(v2Card.getByText(/Deprecated Release/i)).toBeVisible();

        // v1.0.0 is an older major version and MUST display deprecated badge
        const v1Card = page.locator(".release-card").filter({ hasText: /v1\.0\.0/i }).first();
        await expect(v1Card).toBeVisible();
        await expect(v1Card.locator(".tag.deprecated")).toBeVisible();
    });

    test("yanked release v1.2.0 displays both yanked and deprecated statuses cleanly", async ({ page }) => {
        const v120Card = page.locator(".release-card").filter({ hasText: /v1\.2\.0/i }).first();
        await expect(v120Card).toBeVisible();

        // Both distinct statuses coexist
        await expect(v120Card.locator(".tag.deprecated")).toBeVisible();
        await expect(v120Card.locator(".tag").filter({ hasText: /yanked/i })).toBeVisible();
    });

    test("archive release item allows expanding architecture variants", async ({ page }) => {
        const buildsToggle = page.locator(".release-card:not(.latest) button", { hasText: /builds/i }).first();
        if (await buildsToggle.isVisible()) {
            await expect(buildsToggle).toHaveAttribute("aria-expanded", "false");
            await buildsToggle.click();
            await expect(buildsToggle).toHaveAttribute("aria-expanded", "true");
            // Expanded variants list should now be visible
            const variantLinks = page.locator(".release-card:not(.latest) ul a[href*='.apk']");
            await expect(variantLinks.first()).toBeVisible();
        }
    });
});
