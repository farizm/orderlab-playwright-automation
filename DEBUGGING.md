# Debugging Guide

This guide explains how to debug the most common failures in the OrderLab
Playwright automation project.

## Start with the failing layer

Use the smallest command that reproduces the problem:

```bash
npm run typecheck
npm run test:api
npm run test:smoke
npm run test:ui
```

If only one spec fails, run that file directly:

```bash
npx playwright test tests/ui/login.spec.ts
```

## Browser is missing locally

If Playwright says the browser executable does not exist, install the browser
for the pinned Playwright version:

```bash
npx playwright install chromium
```

This can happen after changing `@playwright/test` versions or after a cleanup
tool removes Playwright browser caches.

## Local browser launch fails on macOS

If Chromium fails with a macOS permission or sandbox error inside an automation
environment, rerun from a normal terminal or allow the test command to run
outside the restricted sandbox. This is an environment issue, not a test failure.

## API auth failures

Check these variables first:

```bash
SUPABASE_URL
SUPABASE_ANON_KEY
CUSTOMER_EMAIL
CUSTOMER_PASSWORD
ADMIN_EMAIL
ADMIN_PASSWORD
```

For local runs, they should be in `.env`. In GitHub Actions, demo passwords are
stored as repository secrets.

## CI failures

The GitHub Actions workflow is split by layer:

1. `typecheck`
2. `smoke`
3. `api`
4. `ui`

Open the failed job first, then download its artifacts:

- `*-playwright-report` for the HTML report;
- `*-test-results` for traces, screenshots, and error context.

## Test data issues

The current v0.1 strategy is isolation-based:

- tests create fresh orders;
- tests use predictable seeded products;
- tests do not depend on old order history;
- there is no destructive cleanup against the public demo database.

If order-related tests become noisy, prefer adding a dedicated reset endpoint in
the demo app before adding complex cleanup logic to the test framework.

## Test reset endpoint is skipped

The reset contract tests are opt-in. They are skipped unless both variables are
configured:

```bash
TEST_API_BASE_URL
TEST_RESET_TOKEN
```

See `docs/TEST_DATA_RESET_CONTRACT.md` before enabling them in CI.

## Locator issues

Prefer this order:

1. role and accessible name;
2. label;
3. stable visible text;
4. `data-testid` as an explicit test contract.

Avoid XPath, fixed sleeps, long CSS chains, and selectors based on layout or
styling.
