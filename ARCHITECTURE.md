# OrderLab Automation Architecture

This document explains the public automation design for the OrderLab project.
It is written for interview and code-review discussion: what the suite
tests, why it is structured this way, and what trade-offs are intentional.

## Goal

OrderLab is a demo order-management application used as a stable target for a
Playwright + TypeScript automation framework.

The automation project is designed to demonstrate:

- maintainable UI automation;
- API testing of core backend behavior;
- Page Object Model structure;
- stable selectors and accessible locators;
- CI execution with reports and traces;
- practical test data handling.
- lightweight accessibility smoke coverage.

The goal is not to imitate a large enterprise framework. The goal is a small,
clear, reliable framework that can be explained in an interview.

## High-level structure

```text
tests/
  api/        API-level tests for public HTTP endpoints
  fixtures.ts Reusable authenticated customer/admin page fixtures
  pages/      Page Objects for user-facing screens
  support/    Shared helpers for environment, auth, API clients, contracts, factories, and test data
  ui/         Browser-based UI tests
```

## Locator strategy

The project uses Playwright locators in this order of preference:

1. User-facing roles, labels, and accessible names.
2. Stable `data-testid` attributes where the UI element is part of the test
   contract.
3. Text locators only when the text is meaningful user-facing behavior.

The suite avoids XPath, fixed CSS chains, and implementation-dependent DOM
selectors because those make tests fragile during normal UI refactoring.

## Page Object Model

Page Objects are screen-focused:

- `LoginPage`
- `ProductsPage`
- `CartPage`
- `CheckoutPage`
- `OrdersPage`
- `AdminOrdersPage`

Each Page Object exposes meaningful user actions and important locators for
assertions. The project intentionally avoids a large generic `BasePage` because
that would add abstraction before the suite needs it.

Good Page Object methods in this project describe behavior, for example:

- `login(email, password)`
- `searchFor(term)`
- `filterByCategory(category)`
- `addProductToCart(productName)`
- `submitOrder(name, address)`
- `updateStatus(orderId, status)`

## Fixtures

The suite uses Playwright fixtures for authenticated customer and admin pages.
This removes duplicated login setup from UI tests while keeping the setup easy
to understand.

Current authenticated fixtures:

- `customerPage` logs in with the public demo customer and starts on the product
  catalog.
- `adminPage` logs in with the public demo admin and starts on the admin orders
  page.

The project does not use persisted `storageState` yet. For this v0.1 framework,
logging in through the UI keeps the setup explicit and interview-friendly. A
future optimization could replace repeated UI login with generated storage state
if test runtime becomes a real problem.

## Test data strategy

The current v0.1 suite uses public demo accounts and predictable seeded
products. Order-related tests create fresh orders during the test run instead of
depending on old order history.

Current approach:

- product data is predictable;
- demo customer/admin accounts are public test fixtures;
- checkout tests use dynamic delivery addresses with timestamps;
- API order tests create an order before reading it back;
- API order setup is shared through `tests/support/orders.ts`;
- order payloads and checkout details are created through
  `tests/support/testDataFactory.ts`;
- admin status tests create a real customer order before changing its status.
- API authorization tests use separate customer and admin bearer tokens to make
  role expectations explicit.
- test reset support is implemented as an opt-in API contract until the demo app
  exposes `POST /api/test/reset`.

Planned improvement:

- add a dedicated reset/seed/cleanup mechanism so every test run can start from
  a known clean state and remove created data when needed.

## UI and API split

UI tests cover the browser flows that a real user would perform:

- login;
- product search and filtering;
- cart behavior;
- checkout validation and submission;
- admin order status update.
- accessibility smoke checks on high-value pages.

API tests cover backend behavior more directly:

- product catalog response;
- order creation;
- reading a created order.
- negative cases for missing authentication, unknown orders, and invalid product
  IDs.
- authorization checks for admin access to customer orders and invalid bearer
  tokens.

This split keeps the UI suite focused on critical journeys while using API tests
for faster validation of server behavior.

## Accessibility checks

The suite includes a small axe-core smoke layer for key pages. These checks fail
on serious or critical WCAG A/AA violations.

The goal is not to replace a full accessibility review. The goal is to add a
low-cost quality gate that catches obvious issues and demonstrates that
accessibility is part of the test strategy.

Transient toast notifications are excluded from page-level scans because they
are short-lived third-party UI elements. They can be covered with a separate
focused test if they become a higher product risk.

## API client layer

HTTP request details are kept in small API client classes:

- `ProductsApi`
- `OrdersApi`

The clients know endpoint paths, headers, and payload shape. Specs use those
clients to describe behavior at a higher level. Scenario setup helpers, such as
creating a Classic Burger order, stay in `tests/support/orders.ts`.

This keeps the framework readable without turning it into a large custom
abstraction layer.

## API authentication

API tests use a small `AuthApi` client to obtain a customer bearer token through
the public demo Supabase password grant. This keeps API tests independent from
UI login and avoids reading browser storage.

The UI login flow is still tested separately in `tests/ui/login.spec.ts`.

## API contract checks

The API tests include lightweight contract assertions for product and order
responses. These checks verify important fields, data types, arrays, and numeric
values without adding a schema-validation dependency.

This gives the suite a practical contract-testing signal while keeping the
project small enough to explain clearly.

## CI and reporting

GitHub Actions runs on push and pull request.

The pipeline:

1. installs dependencies;
2. installs Playwright Chromium;
3. runs TypeScript typecheck;
4. runs Playwright tests;
5. uploads the Playwright HTML report;
6. uploads failure artifacts such as traces and screenshots.

The HTML report is useful for review because it gives visible proof of
test execution, timings, retries, traces, and failure context.

## Intentional trade-offs

For v0.1, reliability and readability are more important than feature count.

Intentional choices:

- one browser project, Chromium, to keep CI focused and stable;
- one test worker because the current target is a shared public demo app with
  public demo accounts;
- small Page Objects instead of heavy framework layers;
- public demo credentials only, no real secrets;
- minimal shared helpers until duplication becomes meaningful;
- stable smoke/regression tags for focused execution;
- no Docker or custom reporting yet.

These choices keep the project understandable for interviews and easy to extend
later.

## Next architecture improvements

The next useful improvements are:

- test data reset or seed endpoint;
- additional negative API coverage for malformed payloads and forbidden access;
- broader order history assertions;
- accessibility smoke checks;
- multi-browser or scheduled CI only after the core suite remains stable.
