import { test, expect } from "../fixtures/base-test";

test.describe("Downloads Channel Filter & Search Functional Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/downloads/");
        // Wait for release cards to be rendered
        await expect(page.locator(".release-card").first()).toBeVisible();
    });

    test("release channel filter buttons update the visible release list", async ({ page }) => {
        const stableFilterBtn = page.getByRole("button", { name: "Stable", exact: true });
        const betaFilterBtn = page.getByRole("button", { name: "Beta", exact: true });
        const alphaFilterBtn = page.getByRole("button", { name: "Alpha", exact: true });
        const allFilterBtn = page.getByRole("button", { name: "All Releases", exact: true });

        const archiveCards = page.locator(".release-card:not(.latest)");

        // Filter by Stable
        await stableFilterBtn.click();
        await expect(stableFilterBtn).toHaveClass(/active/);
        await expect(archiveCards.first()).toBeVisible();

        // Stable releases should include v3.2.1
        await expect(archiveCards.filter({ hasText: /v3\.2\.1/i })).toBeVisible();
        // Should not show Beta releases in stable filter
        await expect(archiveCards.locator(".tag.beta")).toHaveCount(0);

        // Filter by Beta
        await betaFilterBtn.click();
        await expect(betaFilterBtn).toHaveClass(/active/);
        await expect(archiveCards.first()).toBeVisible();
        await expect(archiveCards.locator(".tag.beta").first()).toBeVisible();
        await expect(archiveCards.locator(".tag.stable")).toHaveCount(0);

        // Filter by Alpha
        await alphaFilterBtn.click();
        await expect(alphaFilterBtn).toHaveClass(/active/);
        await expect(archiveCards.first()).toBeVisible();
        await expect(archiveCards.locator(".tag.alpha").first()).toBeVisible();
        await expect(archiveCards.locator(".tag.stable")).toHaveCount(0);

        // Filter by Deprecated
        const deprecatedFilterBtn = page.getByRole("button", { name: "Deprecated", exact: true });
        await deprecatedFilterBtn.click();
        await expect(deprecatedFilterBtn).toHaveClass(/active/);
        await expect(archiveCards.first()).toBeVisible();
        await expect(archiveCards.locator(".tag.deprecated").first()).toBeVisible();

        // Filter by Yanked
        const yankedFilterBtn = page.getByRole("button", { name: "Yanked", exact: true });
        await yankedFilterBtn.click();
        await expect(yankedFilterBtn).toHaveClass(/active/);
        await expect(archiveCards.first()).toBeVisible();
        await expect(archiveCards.locator(".tag").filter({ hasText: /yanked/i }).first()).toBeVisible();

        // Reset to All
        await allFilterBtn.click();
        await expect(allFilterBtn).toHaveClass(/active/);
        await expect(archiveCards.count()).resolves.toBeGreaterThan(5);
    });

    test("downloads search filters releases and clear button restores list", async ({ page }) => {
        const searchInput = page.getByLabel("Search releases");
        await expect(searchInput).toBeVisible();

        // Enter search term
        await searchInput.fill("v3.2.1");

        // Release list should filter to v3.2.1
        const archiveCards = page.locator(".release-card:not(.latest)");
        await expect(archiveCards).toHaveCount(1);
        await expect(archiveCards.first()).toContainText("v3.2.1");

        // Clear button should be visible (only one clear button inside search input container)
        const clearBtn = page.getByRole("button", { name: "Clear search" });
        await expect(clearBtn).toBeVisible();
        await expect(clearBtn).toHaveCount(1);

        // Click clear and verify list is restored
        await clearBtn.click();
        await expect(searchInput).toHaveValue("");
        await expect(archiveCards.count()).resolves.toBeGreaterThan(1);
    });

    test("unmatched query shows friendly empty state with working reset button", async ({ page }) => {
        const searchInput = page.getByLabel("Search releases");
        await searchInput.fill("nonexistentquery9999");

        const emptyMessage = page.getByText(/No releases match your/i);
        await expect(emptyMessage).toBeVisible();

        const resetBtn = page.getByRole("button", { name: "Reset filters" });
        await expect(resetBtn).toBeVisible();
        await resetBtn.click();

        await expect(searchInput).toHaveValue("");
        const archiveCards = page.locator(".release-card:not(.latest)");
        await expect(archiveCards.first()).toBeVisible();
    });
});
