import { test, expect } from "../fixtures/base-test";

test.describe("Changelog Search Functional Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/changelog/");
    });

    test("searching by version filters changelog entries", async ({ page }) => {
        const searchInput = page.getByLabel("Search changelog entries");
        await expect(searchInput).toBeVisible();

        // Search for specific version
        await searchInput.fill("v3.2.1");

        // The matching article should be visible
        const matchingArticles = page.locator("article").filter({ hasText: /v3\.2\.1/i });
        await expect(matchingArticles.first()).toBeVisible();

        // Articles should be filtered down
        const totalVisible = await page.locator("article").count();
        expect(totalVisible).toBeLessThanOrEqual(2);
    });

    test("searching by keyword filters results and clear button restores list", async ({ page }) => {
        const searchInput = page.getByLabel("Search changelog entries");

        // Search for a keyword like "Biometric" or "Material"
        await searchInput.fill("Material");

        const matchingArticles = page.locator("article").filter({ hasText: /Material/i });
        await expect(matchingArticles.first()).toBeVisible();

        // Exactly one clear button appears
        const clearBtn = page.getByRole("button", { name: "Clear search" });
        await expect(clearBtn).toBeVisible();
        await expect(clearBtn).toHaveCount(1);

        // Click clear and ensure search is reset
        await clearBtn.click();
        await expect(searchInput).toHaveValue("");

        // All entries restored
        const restoredCount = await page.locator("article").count();
        expect(restoredCount).toBeGreaterThan(5);
    });

    test("searching by release state filters to deprecated or yanked entries", async ({ page }) => {
        const searchInput = page.getByLabel("Search changelog entries");

        // Search for "yanked"
        await searchInput.fill("yanked");
        const yankedArticles = page.locator("article").filter({
            has: page.locator(".tag").filter({ hasText: /yanked/i }),
        });
        await expect(yankedArticles.first()).toBeVisible();

        // Search for "deprecated"
        await searchInput.fill("deprecated");
        const deprecatedArticles = page.locator("article").filter({
            has: page.locator(".tag.deprecated"),
        });
        await expect(deprecatedArticles.first()).toBeVisible();
    });

    test("no results message appears on unmatched query and reset works", async ({ page }) => {
        const searchInput = page.getByLabel("Search changelog entries");
        await searchInput.fill("nonexistent-release-query-xyz");

        // "No updates match your filter"
        await expect(page.getByText(/No updates match your filter/i)).toBeVisible();

        // Reset Filters button restores list
        const resetBtn = page.getByRole("button", { name: /Reset Filters/i });
        await expect(resetBtn).toBeVisible();
        await resetBtn.click();

        await expect(searchInput).toHaveValue("");
        await expect(page.locator("article").first()).toBeVisible();
    });
});
