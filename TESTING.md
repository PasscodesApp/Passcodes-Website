# 🎭 End-to-End & Regression Testing with Playwright

This repository maintains an automated end-to-end (E2E) and regression test suite powered by [Playwright](https://playwright.dev/). The test suite guards user-facing flows and critical business logic against unintended regressions.

---

## 🏗️ Architecture & Design Principles

1. **Production-Faithful Static Export Testing**
   Next.js static site generation (`next build` / `npm run build`) generates static HTML/JS output in the `out/` directory. Tests run against this production export served locally via `npx serve out -l 3000 -L` to ensure tests evaluate exact client-side runtime behavior without development-mode artifacts.

2. **Deterministic Offline Testing (Zero Rate Limits)**
   The website client-side queries the GitHub API for releases (`https://api.github.com/**`). In the custom test fixture (`tests/fixtures/base-test.ts`), all GitHub API requests are routed and answered with local snapshots (`src/data/raw-releases.json`). This ensures:
   - Zero dependency on live internet access during test runs.
   - Zero risk of hitting GitHub's unauthenticated IP rate limit (60 requests/hour).
   - High speed and 100% deterministic test outcomes.

3. **No Flaky Arbitrary Timeouts**
   Tests use Playwright web assertions (`expect(...).toBeVisible()`, `expect(...).toHaveClass(...)`) and locator auto-waiting. Explicit calls to `page.waitForTimeout()` are avoided.

4. **Cross-Platform Device Coverage**
   Configured for both Desktop Chrome (`1280x720`) and Mobile Chrome (`Pixel 5` viewport) to validate responsive layouts, desktop navigation, and mobile hamburger drawer interactions.

5. **Visual Regression Policy**
   Pixel-by-pixel screenshot comparisons (`toMatchSnapshot`) are intentionally **deferred** to prevent brittle test failures caused by font rendering variations across operating systems (e.g., Linux CI runners vs. Windows/macOS local machines). Instead, tests focus on structural DOM, role-based semantics, ARIA states, and CSS class assertions.

---

## 🚀 Running Tests Locally

### Prerequisites

Ensure project dependencies and Playwright Chromium binaries are installed:

```bash
npm install
npx playwright install chromium
```

Before running tests, ensure the static production export is built:

```bash
npm run build
```

### Test Commands

| Command | Purpose |
| :--- | :--- |
| `npm run test:e2e` | Runs all end-to-end tests headlessly across Desktop and Mobile projects. |
| `npm run test:e2e:ui` | Launches Playwright's interactive UI mode with time-travel debugging and locator inspection. |
| `npm run test:e2e:report` | Opens the generated HTML test results report in your browser. |

You can also run specific test files or projects directly:

```bash
# Run only smoke tests
npx playwright test tests/smoke/

# Run only on Desktop Chrome
npx playwright test --project=chromium

# Run a specific test in debug mode
npx playwright test tests/smoke/homepage.spec.ts --debug
```

---

## 📁 Test Suite Structure

```text
tests/
├── fixtures/
│   └── base-test.ts            # Custom Playwright fixture intercepting GitHub API requests & checking console errors
├── functional/
│   ├── changelog-search.spec.ts # Changelog search filter, debouncing, & clear interactions
│   ├── release-filters.spec.ts  # Downloads channel tabs (Stable/Beta/Alpha) & release search
│   └── theme.spec.ts            # Dark/light theme toggle, html class mutation, & localStorage persistence
└── smoke/
    ├── changelog.spec.ts        # Changelog timeline, v1/v2 deprecation badges, yanked notices, & detail pages
    ├── community.spec.ts        # Community page, contributor cards, "A Guy" Community Manager card integrity
    ├── downloads.spec.ts        # Downloads page, recommended build card, split ABIs, & deprecated/yanked releases
    ├── footer.spec.ts           # Footer design credit (@harsha-vardhan-burra) & navigation links
    ├── homepage.spec.ts         # Homepage hero, tagline, primary CTAs, & section landmarks
    └── mobile.spec.ts           # Mobile viewport hamburger button, drawer menu, and mobile navigation
```

---

## 🤖 Continuous Integration (CI)

The GitHub Actions workflow (`.github/workflows/playwright.yml`) executes automatically on:
- Every push to `main`
- Every pull request targeting `main`
- Manual workflow dispatch

The CI pipeline runs:
1. `npm run type-check` (TypeScript type integrity)
2. `npm run lint` (ESLint code standards)
3. `npm run build` (Static export generation)
4. `npm run test:e2e` (Playwright test suite execution)
5. Test report upload on failure for artifact inspection
