# Test Strategy

This project tests a small demo order-management app from the point of view of a
QA Automation / SDET portfolio. The goal is not to automate everything. The goal
is to cover the most important risks with tests that are stable, readable, and
easy to explain.

## What we test

The suite focuses on the main user journeys:

- customer login;
- product search and filtering;
- cart behavior;
- checkout and order confirmation;
- admin order status management;
- product and order API behavior;
- important negative cases such as invalid login, missing auth, unknown orders,
  and invalid product IDs.

## What we do not test in v0.1

This is a portfolio demo, not a production system. For v0.1 we intentionally do
not cover:

- real payments;
- real customer data;
- large cross-browser matrix;
- visual regression;
- performance testing;
- complex database reset flows;
- every possible validation message.

Those can be added later if they support a clear testing goal.

## Test levels

### UI tests

UI tests cover flows where browser behavior matters: login, catalog search,
cart, checkout, and admin order updates.

UI tests use:

- Playwright web-first assertions;
- Page Objects for screen-level behavior;
- role, label, text, and `data-testid` locators;
- no fixed sleeps;
- authenticated fixtures for customer/admin setup.

### API tests

API tests cover backend behavior directly and faster than the UI:

- product catalog response;
- order creation;
- reading an order by ID;
- auth and invalid-data negative cases.

API tests are useful because they check server behavior without depending on
the browser UI.

## Test data approach

Test data is simple and predictable:

- public demo accounts come from environment variables;
- seeded products are stable and safe to use in tests;
- order tests create fresh orders during the run;
- dynamic addresses use timestamps so repeated runs are easy to distinguish;
- shared constants live in `tests/support/testData.ts`.

The next improvement would be a reset/seed endpoint so every test run starts
from a fully known state.

## Locator strategy

Preferred locator order:

1. user-facing roles and labels;
2. meaningful visible text;
3. stable `data-testid` attributes for explicit test contracts.

Avoid:

- XPath;
- long CSS chains;
- selectors based on styling or layout;
- fixed waits.

## CI and reporting

Every push and pull request runs:

1. dependency install;
2. Playwright Chromium install;
3. TypeScript typecheck;
4. full Playwright suite;
5. HTML report and failure artifact upload.

This gives reviewers proof that the project works from a clean checkout.

## Definition of done for a test

A test is acceptable when it:

- verifies user-visible or API-visible behavior;
- has a clear reason to exist;
- can run independently;
- does not depend on old shared order data;
- uses stable locators;
- passes locally and in CI;
- is readable enough to explain in an interview.

## Practical priorities

When improving the suite, prefer this order:

1. improve reliability;
2. improve readability;
3. improve test data control;
4. add meaningful negative coverage;
5. only then add more test count.

More tests are not automatically better. A smaller stable suite is more valuable
than a large flaky one.
