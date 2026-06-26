# Debugging Guide

InsuranceLab is a domain-focused Playwright automation portfolio simulating P&C
insurance workflows. Some debugging notes still mention the original OrderLab
target names because the public demo app keeps those route/API contracts.

This guide explains how to debug the most common failures in the OrderLab
Playwright automation project.

## Start with the failing layer

Use the smallest command that reproduces the problem:

```bash
npm run typecheck
npm run test:api
npm run test:smoke
npm run test:ui
npm run test:a11y
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

For cross-customer authorization coverage, also check:

```bash
SECOND_CUSTOMER_EMAIL
SECOND_CUSTOMER_PASSWORD
```

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

The current strategy combines isolation and reset:

- tests create fresh orders;
- tests use predictable seeded products;
- tests do not depend on old order history;
- a token-protected reset endpoint returns demo data to a known state.

If order-related tests become noisy, verify the reset endpoint before adding
complex cleanup logic to the test framework.

## Test reset endpoint fails or is skipped

The reset contract tests need both variables:

```bash
TEST_API_BASE_URL
TEST_RESET_TOKEN
```

See `docs/TEST_DATA_RESET_CONTRACT.md` before enabling them in CI.

Expected behavior:

- valid token returns `200`;
- missing token returns `401` or `403`;
- seeded products remain available after reset.

## GitHub Actions annotation about Node 20

GitHub may show a non-blocking annotation that an action targets Node.js 20
while GitHub forces it to run on Node.js 24. This is currently an annotation,
not a failing check. Treat it as a maintenance note unless the job starts
failing.

## Locator issues

Prefer this order:

1. role and accessible name;
2. label;
3. stable visible text;
4. `data-testid` as an explicit test contract.

Avoid XPath, fixed sleeps, long CSS chains, and selectors based on layout or
styling.
