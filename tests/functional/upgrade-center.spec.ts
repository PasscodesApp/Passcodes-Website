import { test, expect } from "../fixtures/base-test";
import { getLatestProductionRelease } from "../../src/lib/changelog";

test.describe("Upgrade & Migration Center Functional Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/upgrade/");
    });

    test("1. route loads with expected title, heading, breadcrumbs and accessible landmark", async ({ page }) => {
        await expect(page).toHaveTitle(/Upgrade & Migration Guide \| Passcodes/i);
        await expect(
            page.getByRole("heading", { name: "Upgrade & Migration Center", level: 1 })
        ).toBeVisible();

        // Semantic Breadcrumbs
        const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
        await expect(breadcrumb).toBeVisible();
        const breadcrumbList = breadcrumb.locator("ol");
        await expect(breadcrumbList).toBeVisible();
        const currentItem = breadcrumb.locator("[aria-current='page']");
        await expect(currentItem).toHaveText("Upgrade & Migration Center");

        // Step 1 question
        await expect(
            page.getByRole("heading", { name: /What are you trying to do\?/i, level: 2 })
        ).toBeVisible();
    });

    test("2. displays all 5 primary situation cards in radiogroup", async ({ page }) => {
        const situationGroup = page.getByRole("radiogroup", { name: /What are you trying to do\?/i });
        await expect(situationGroup).toBeVisible();

        const options = situationGroup.getByRole("radio");
        await expect(options).toHaveCount(5);

        await expect(situationGroup.getByText(/Install Passcodes for the first time/i)).toBeVisible();
        await expect(situationGroup.getByText(/Update an existing installation/i)).toBeVisible();
        await expect(situationGroup.getByText(/Move to another phone or restore data/i)).toBeVisible();
        await expect(situationGroup.getByText(/I am on an older v1\.x or v2\.x release/i)).toBeVisible();
        await expect(situationGroup.getByText(/I am not sure which version I have/i)).toBeVisible();
    });

    test("3. first-time installation pathway shows checklist and canonical downloads CTA", async ({ page }) => {
        await page.getByRole("radio", { name: /Install Passcodes for the first time/i }).click();

        // Heading in result panel
        await expect(
            page.getByRole("heading", { name: /Installing Passcodes for the First Time/i, level: 3 })
        ).toBeVisible();

        // Recommended next step callout
        await expect(page.getByText(/Recommended Next Step/i)).toBeVisible();
        await expect(page.getByText(/minimum requirement/i)).toBeVisible();

        // Pre-flight checklist checks - verified minimum Android 8.0 without invented testing claims
        await expect(page.getByText(/Passcodes requires Android 8\.0 \(API level 26\) or higher\./i)).toBeVisible();
        await expect(page.getByText(/Officially tested on Android 8 through Android 14\/17/i)).toHaveCount(0);
        await expect(page.getByText(/Select the right package/i)).toBeVisible();
        await expect(page.getByText(/Local-only architecture/i)).toBeVisible();

        // Dynamic latest release info
        const latestProd = getLatestProductionRelease();
        if (latestProd) {
            await expect(page.getByText(`Recommended Release: ${latestProd.version}`)).toBeVisible();
        }

        // Primary download CTA points to /downloads
        const downloadsCta = page.getByRole("link", { name: /Go to Downloads/i });
        await expect(downloadsCta).toBeVisible();
        await expect(downloadsCta).toHaveAttribute("href", /\/downloads\/?/);

        // Official setup guide link
        const setupGuideLink = page.getByRole("link", { name: /Official Setup Guide/i });
        await expect(setupGuideLink).toBeVisible();
        await expect(setupGuideLink).toHaveAttribute("target", "_blank");
    });

    test("4. update pathway triggers step 2 and v3.x path displays standard update cautions", async ({ page }) => {
        await page.getByRole("radio", { name: /Update an existing installation/i }).click();

        // Step 2 appears
        await expect(
            page.getByRole("heading", { name: /Which version family is currently installed on your phone\?/i, level: 2 })
        ).toBeVisible();

        // Choose v3.x
        await page.getByRole("radio", { name: /v3\.x Series/i }).click();

        // Result panel for v3 update
        await expect(
            page.getByRole("heading", { name: /Updating Within the v3\.x Series/i, level: 3 })
        ).toBeVisible();

        // Checklist items with verified labels and warnings
        await expect(page.getByText(/Export your passwords first/i)).toBeVisible();
        await expect(page.getByText(/Settings → Export passwords/i)).toBeVisible();
        await expect(page.getByText(/CSV data safety/i)).toBeVisible();
        await expect(page.getByText(/credentials in unencrypted readable plaintext/i)).toBeVisible();
        await expect(page.getByText(/Never uninstall the app/i)).toBeVisible();
        await expect(page.getByText(/Documented update path/i)).toBeVisible();
        await expect(page.getByText(/Optional troubleshooting mechanism/i)).toBeVisible();
        await expect(page.getByText(/Settings → Troubleshooting → Data Recovery/i)).toBeVisible();

        // Dynamic target update version
        const latestProd = getLatestProductionRelease();
        if (latestProd) {
            await expect(page.getByText(`Target Update: ${latestProd.version} (Stable)`)).toBeVisible();
            const changelogLink = page.getByRole("link", { name: /View Release Notes/i });
            await expect(changelogLink).toBeVisible();
            await expect(changelogLink).toHaveAttribute("href", new RegExp(`/changelog/${latestProd.slug}/?`));
        }
    });

    test("5. legacy pathway displays prominent deprecation warning and no false migration guarantees", async ({ page }) => {
        await page.getByRole("radio", { name: /I am on an older v1\.x or v2\.x release/i }).click();

        // Step 2 appears
        await expect(
            page.getByRole("heading", { name: /Which legacy release family are you using\?/i, level: 2 })
        ).toBeVisible();

        // Choose v2.x
        await page.getByRole("radio", { name: /v2\.x releases/i }).click();

        // Legacy result
        await expect(
            page.getByRole("heading", { name: /Upgrading from Legacy v2\.x/i, level: 3 })
        ).toBeVisible();

        // Deprecation & Safety Notice
        await expect(page.getByText(/Important Safety Notice/i)).toBeVisible();
        await expect(page.getByText(/v1\.x and v2\.x releases are Deprecated and have reached End of Support/i)).toBeVisible();
        await expect(page.getByText(/No guaranteed automated migration/i)).toBeVisible();
        await expect(page.getByText(/Export your passwords immediately/i)).toBeVisible();
        await expect(page.getByText(/Do NOT delete or uninstall the old app/i)).toBeVisible();
        await expect(page.getByText(/not a guaranteed recovery process or a substitute for an exported backup/i)).toBeVisible();

        // Links to community support
        const discordCta = page.getByRole("link", { name: /Ask Maintainers on Discord/i });
        await expect(discordCta).toBeVisible();
        await expect(discordCta).toHaveAttribute("href", /discord\.gg/);

        // Architecture milestone link
        const milestoneLink = page.getByRole("link", { name: /Read Architecture Transition Milestone/i });
        await expect(milestoneLink).toBeVisible();
        await expect(milestoneLink).toHaveAttribute("href", /\/changelog\/end-of-android-only\/?/);
    });

    test("6. device-switch pathway explains offline nature, CSV security, and verified navigation labels", async ({ page }) => {
        await page.getByRole("radio", { name: /Move to another phone or restore data/i }).click();

        await expect(
            page.getByRole("heading", { name: /Moving to Another Phone or Restoring Data/i, level: 3 })
        ).toBeVisible();

        // Plaintext CSV Warning
        await expect(page.getByText(/CSV Data Safety Warning/i)).toBeVisible();
        await expect(page.getByText(/unencrypted plaintext/i)).toBeVisible();

        // Highlights no cloud sync and verified step labels
        await expect(page.getByText(/No cloud synchronization/i)).toBeVisible();
        await expect(page.getByText(/Step 1 — Export on old phone/i)).toBeVisible();
        await expect(page.getByText(/Settings → Export passwords/i)).toBeVisible();
        await expect(page.getByText(/Step 2 — Transfer the file securely/i)).toBeVisible();
        await expect(page.getByText(/Step 3 — Install on new phone/i)).toBeVisible();
        await expect(page.getByText(/Step 4 — Import credentials/i)).toBeVisible();
        await expect(page.getByText(/Settings → Import passwords/i)).toBeVisible();
        await expect(page.getByText(/Do NOT wipe your old phone yet/i)).toBeVisible();
    });

    test("7. version identification pathway gives clear in-app and Android settings steps", async ({ page }) => {
        await page.getByRole("radio", { name: /I am not sure which version I have/i }).click();

        await expect(
            page.getByRole("heading", { name: /How to Check Which Version You Have/i, level: 3 })
        ).toBeVisible();

        await expect(page.getByText(/Method 1: Inside the App/i)).toBeVisible();
        await expect(page.getByText(/Method 2: Android System Settings/i)).toBeVisible();

        // Quick jump action buttons work
        const v3JumpBtn = page.getByRole("button", { name: /I have v3\.x/i });
        await expect(v3JumpBtn).toBeVisible();
        await v3JumpBtn.click();

        // Transitioned to v3 update result!
        await expect(
            page.getByRole("heading", { name: /Updating Within the v3\.x Series/i, level: 3 })
        ).toBeVisible();
    });

    test("8. yanked release selection warns that build is withdrawn and does not offer direct download of yanked APK", async ({ page }) => {
        await page.getByRole("radio", { name: /I am on an older v1\.x or v2\.x release/i }).click();
        await page.getByRole("radio", { name: /Explicitly Yanked/i }).click();

        await expect(
            page.getByRole("heading", { name: /Handling a Withdrawn or Yanked Release/i, level: 3 })
        ).toBeVisible();

        await expect(page.getByText(/Withdrawn from Active Distribution/i)).toBeVisible();
        await expect(page.getByText(/Do not download or redistribute/i)).toBeVisible();

        // CTA directs to current recommended build, never yanked build
        const cta = page.getByRole("link", { name: /Get Recommended Release/i });
        await expect(cta).toBeVisible();
        await expect(cta).toHaveAttribute("href", /\/downloads\/?/);
    });

    test("9. 'Start over' reset button returns to clean initial state", async ({ page }) => {
        await page.getByRole("radio", { name: /Install Passcodes for the first time/i }).click();
        await expect(page.getByText(/Recommended Next Step/i)).toBeVisible();

        const startOverBtn = page.getByRole("button", { name: /Start over/i });
        await expect(startOverBtn).toBeVisible();
        await startOverBtn.click();

        // Result panel disappears, Step 1 reset
        await expect(page.getByText(/Recommended Next Step/i)).toHaveCount(0);
        const radio = page.getByRole("radio", { name: /Install Passcodes for the first time/i });
        await expect(radio).toHaveAttribute("aria-checked", "false");
    });

    test("10. keyboard navigation supports roving tabindex and arrow keys across choices", async ({ page }) => {
        const radios = page.getByRole("radiogroup", { name: /What are you trying to do\?/i }).getByRole("radio");

        // Initial roving tabindex: first radio is tabindex 0, others are -1
        await expect(radios.nth(0)).toHaveAttribute("tabindex", "0");
        await expect(radios.nth(1)).toHaveAttribute("tabindex", "-1");
        await expect(radios.nth(2)).toHaveAttribute("tabindex", "-1");

        // Focus first radio
        await radios.nth(0).focus();

        // Press ArrowDown to advance to situation 2 (Update)
        await page.keyboard.press("ArrowDown");
        await expect(radios.nth(1)).toBeFocused();
        await expect(radios.nth(1)).toHaveAttribute("aria-checked", "true");
        await expect(radios.nth(1)).toHaveAttribute("tabindex", "0");
        await expect(radios.nth(0)).toHaveAttribute("tabindex", "-1");

        // Step 2 should now be visible because situation is 'update'
        await expect(
            page.getByRole("heading", { name: /Which version family is currently installed on your phone\?/i, level: 2 })
        ).toBeVisible();

        // Press ArrowUp to move back to situation 1 (First-time install)
        await page.keyboard.press("ArrowUp");
        await expect(radios.nth(0)).toBeFocused();
        await expect(radios.nth(0)).toHaveAttribute("aria-checked", "true");
        await expect(radios.nth(0)).toHaveAttribute("tabindex", "0");

        // Heading for first-time installation should now be visible
        await expect(
            page.getByRole("heading", { name: /Installing Passcodes for the First Time/i, level: 3 })
        ).toBeVisible();
    });

    test("11. flow does not include sensitive input fields or file upload prompts", async ({ page }) => {
        // No input[type=password], input[type=file], or form submitting credentials
        await expect(page.locator("input[type='password']")).toHaveCount(0);
        await expect(page.locator("input[type='file']")).toHaveCount(0);
    });

    test("12. contextual navigation from other pages to /upgrade/ works", async ({ page }) => {
        // From Downloads page guidance banner
        await page.goto("/downloads/");
        const downloadsBannerCta = page.getByRole("link", { name: /Get Guidance/i });
        await expect(downloadsBannerCta).toBeVisible();
        await downloadsBannerCta.click();
        await expect(page).toHaveURL(/\/upgrade\/?$/);

        // From Footer Product links
        await page.goto("/");
        const footerUpgradeLink = page.locator("footer.site-footer").getByRole("link", { name: /Upgrade & Migration/i });
        await expect(footerUpgradeLink).toBeVisible();
        await footerUpgradeLink.click();
        await expect(page).toHaveURL(/\/upgrade\/?$/);
    });
});
