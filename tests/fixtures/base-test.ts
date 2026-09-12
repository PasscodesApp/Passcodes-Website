import { test as base, expect } from "@playwright/test";
import rawReleases from "../../src/data/raw-releases.json";

/**
 * Custom test fixture that:
 * 1. Intercepts external GitHub API requests and responds with local snapshots (deterministic, offline).
 * 2. Monitors uncaught page errors and console.error events, failing tests if fatal JS crashes occur.
 */
export const test = base.extend({
    page: async ({ page }, use) => {
        const pageErrors: Error[] = [];
        const consoleErrors: string[] = [];

        page.on("pageerror", (err) => {
            pageErrors.push(err);
        });

        page.on("console", (msg) => {
            if (msg.type() === "error") {
                const text = msg.text();
                // Filter out non-actionable external icon 404 noise if any
                if (!text.includes("favicon.ico")) {
                    consoleErrors.push(text);
                }
            }
        });

        // Deterministic GitHub API routing with local repository snapshots
        await page.route("https://api.github.com/**", async (route) => {
            const url = route.request().url();
            if (url.includes("/releases")) {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(rawReleases),
                });
            } else if (url.includes("/contributors")) {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify([]),
                });
            } else if (url.includes("/repos/PasscodesApp/Passcodes")) {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({
                        stargazers_count: 150,
                        forks_count: 20,
                    }),
                });
            } else {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({}),
                });
            }
        });

        await use(page);

        expect(
            pageErrors,
            `Uncaught page errors detected: ${pageErrors.map((e) => e.message).join("; ")}`
        ).toHaveLength(0);

        expect(
            consoleErrors,
            `Console errors detected: ${consoleErrors.join("; ")}`
        ).toHaveLength(0);
    },
});

export { expect };
