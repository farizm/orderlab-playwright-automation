# OrderLab Playwright Automation

[![Playwright CI](https://github.com/farizm/orderlab-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/farizm/orderlab-playwright-automation/actions/workflows/playwright.yml)

Public SDET / QA Automation portfolio project for the
[OrderLab Demo](https://orderlab-playwright-target.lovable.app) application.

The goal is to show a small but realistic automation framework: Playwright,
TypeScript, Page Object Model, UI tests, API tests, CI, HTML reporting, and
failure artifacts.

Repository: <https://github.com/farizm/orderlab-playwright-automation>
CI workflow: <https://github.com/farizm/orderlab-playwright-automation/actions/workflows/playwright.yml>

Architecture notes: [ARCHITECTURE.md](./ARCHITECTURE.md)  
Test strategy: [TEST_STRATEGY.md](./TEST_STRATEGY.md)  
AI-assisted QA workflow: [AI_QA_WORKFLOW.md](./AI_QA_WORKFLOW.md)

## How to review this repo in 3 minutes

1. Start with the coverage matrix below to see which product risks are covered.
2. Open `tests/ui/checkout.spec.ts` for a readable UI happy path + validation
   example.
3. Open `tests/api/orders.spec.ts` for API positive, negative, and contract
   checks.
4. Open `tests/support/api/` to see the API client layer.
5. Open the latest GitHub Actions run to confirm the suite runs from CI and
   publishes reports.

## Application under test

- Public app: <https://orderlab-playwright-target.lovable.app>
- Public API base: <https://orderlab-playwright-target.lovable.app/api/public>
- Demo customer: `customer@example.com / CustomerDemo123!`
- Demo admin: `admin@example.com / AdminDemo123!`

These are public demo fixtures, not real credentials. The app contains no real
customer data, payment processing, or production business logic.

## Tech stack

- Playwright Test
- TypeScript
- npm
- GitHub Actions
- Playwright HTML report, screenshots, and traces

## Current test coverage

This is a focused v0.1 portfolio suite. The goal is not maximum test count; the
goal is stable coverage of the highest-value customer and admin flows.

### UI scenarios

| Area | Scenario | Risk covered | File |
|---|---|---|---|
| Authentication | Login form renders | Login page is reachable and testable | `tests/ui/login.spec.ts` |
| Authentication | Invalid login displays an error | User receives clear validation feedback | `tests/ui/login.spec.ts` |
| Authentication | Customer logs in successfully | Happy-path customer authentication works | `tests/ui/login.spec.ts` |
| Catalog | Customer searches and filters products | Product discovery controls return expected results | `tests/ui/products.spec.ts` |
| Cart | Customer adds a product to the cart | Cart state updates from product actions | `tests/ui/cart.spec.ts` |
| Checkout | Customer completes checkout and sees confirmation | End-to-end order creation works from UI | `tests/ui/checkout.spec.ts` |
| Checkout | Empty checkout fields show validation errors | Required customer details are enforced before order creation | `tests/ui/checkout.spec.ts` |
| Admin | Admin updates a created order status | Admin workflow can manage real customer orders | `tests/ui/admin-orders.spec.ts` |

### API scenarios

| Area | Scenario | Risk covered | File |
|---|---|---|---|
| Products API | Read product catalog | Public product endpoint returns expected seed data | `tests/api/products.spec.ts` |
| Orders API | Create an order | Server calculates subtotal and snapshots item price | `tests/api/orders.spec.ts` |
| Orders API | Read a created order by ID | Authenticated customer can retrieve the created order | `tests/api/orders.spec.ts` |
| API contracts | Validate product and order response shape | API responses keep expected fields and data types | `tests/api/*.spec.ts` |
| Orders API | Reject order creation without auth | Protected order endpoint requires bearer token | `tests/api/orders.spec.ts` |
| Orders API | Return not found for unknown order | Missing valid order IDs are handled clearly | `tests/api/orders.spec.ts` |
| Orders API | Reject unknown product ID | Invalid order payloads do not create orders | `tests/api/orders.spec.ts` |
| Orders API | Reject empty items and zero quantity | Malformed order payloads are rejected | `tests/api/orders.spec.ts` |

## Coverage matrix

| Feature | UI coverage | API coverage | Notes |
|---|---|---|---|
| Login | Positive and negative login checks | API auth client obtains customer bearer token | Public demo accounts only |
| Product catalog | Search and category filter | Product list and seed data validation | Uses stable product names as fixtures |
| Cart | Add item and verify cart state | Not directly covered | Cart is browser-local state |
| Checkout | Customer checkout confirmation and required-field validation | Order creation validates server-side pricing and bad product IDs | Dynamic address avoids duplicate-looking data |
| Order history | Confirmation reads order ID and status | Read created order by ID | Deeper history checks are planned |
| Admin orders | Admin updates status and verifies persistence | Not directly covered | API admin status tests are planned |

## Project structure

```text
tests/
  api/        API tests for public OrderLab endpoints
  fixtures.ts Authenticated customer/admin page fixtures
  pages/      Page Objects for UI screens
  support/    Environment, auth, API clients, contracts, factories, and test data helpers
  ui/         UI tests
```

The suite intentionally keeps Page Objects small and screen-specific. Shared
helpers live under `tests/support/` only when they are reused by more than one
test area. Authenticated UI setup lives in `tests/fixtures.ts` so customer and
admin login steps are reusable without hiding the behavior under heavy
framework layers.
API clients live under `tests/support/api/` so specs can focus on behavior
instead of repeating request URLs, headers, and payload shapes.

## Local setup

Requirements:

- Node.js 20+
- npm

Install dependencies and Playwright Chromium:

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Run checks:

```bash
npm run typecheck
npm test
```

Useful targeted commands:

```bash
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api
npm run test:headed
```

Open the last HTML report:

```bash
npm run report
```

## Environment variables

The framework reads configuration from environment variables. For local runs,
copy `.env.example` to `.env`.

```env
BASE_URL=https://orderlab-playwright-target.lovable.app
API_BASE_URL=https://orderlab-playwright-target.lovable.app/api/public
SUPABASE_URL=https://fqrhjmkqntfenmsnownl.supabase.co
SUPABASE_ANON_KEY=public-demo-anon-key
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=CustomerDemo123!
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminDemo123!
```

`.env` is ignored by Git. The committed `.env.example` uses only public demo
fixtures.

## CI

GitHub Actions workflow:

```text
.github/workflows/playwright.yml
```

The pipeline runs on push and pull request using split jobs:

1. `typecheck` — TypeScript validation.
2. `smoke` — tagged smoke tests and the first functional quality gate.
3. `api` — API tests and contract checks, after smoke is green.
4. `ui` — browser UI tests, after smoke is green.

Each Playwright job uploads its own HTML report and failure artifacts so
reviewers can inspect the exact layer that failed.

## Design notes

- Page Objects are small and screen-focused.
- Customer/admin fixtures remove duplicated login setup from UI tests.
- API auth client obtains bearer tokens without depending on UI login or browser
  storage.
- API clients keep request details out of scenario-level API specs.
- API contract helpers validate response shape and important data types.
- Test data factories prepare common scenario data such as order payloads and
  checkout details.
- Tests run with one worker because the target is a shared public demo app with
  public demo accounts. This favors repeatability over speed for portfolio CI.
- Locators prefer roles, labels, and stable `data-testid` attributes.
- Tests avoid fixed sleeps and use Playwright web-first assertions.
- Each order-related test creates its own order data.
- Public API routes are under `/api/public/*`, but protected order routes still
  require bearer authentication.
- API order tests obtain a customer bearer token through Supabase password grant,
  then call the HTTP API directly.
- CI enables Playwright traces for the portfolio report artifact; local runs use
  lighter retry-only traces.

## Known limitations and next improvements

This repository is intentionally scoped as a public v0.1 portfolio proof. The
next improvements would be:

- add a dedicated test data reset or cleanup endpoint;
- expand negative API checks for forbidden cross-user access;
- add a public `ARCHITECTURE.md` decision log as the framework evolves;
- expand order history assertions without making tests depend on old shared
  data.
