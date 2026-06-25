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
| Admin | Admin updates a created order status | Admin workflow can manage real customer orders | `tests/ui/admin-orders.spec.ts` |

### API scenarios

| Area | Scenario | Risk covered | File |
|---|---|---|---|
| Products API | Read product catalog | Public product endpoint returns expected seed data | `tests/api/products.spec.ts` |
| Orders API | Create an order | Server calculates subtotal and snapshots item price | `tests/api/orders.spec.ts` |
| Orders API | Read a created order by ID | Authenticated customer can retrieve the created order | `tests/api/orders.spec.ts` |
| Orders API | Reject order creation without auth | Protected order endpoint requires bearer token | `tests/api/orders.spec.ts` |
| Orders API | Return not found for unknown order | Missing valid order IDs are handled clearly | `tests/api/orders.spec.ts` |
| Orders API | Reject unknown product ID | Invalid order payloads do not create orders | `tests/api/orders.spec.ts` |

## Coverage matrix

| Feature | UI coverage | API coverage | Notes |
|---|---|---|---|
| Login | Positive and negative login checks | Token acquisition used by API helpers | Public demo accounts only |
| Product catalog | Search and category filter | Product list and seed data validation | Uses stable product names as fixtures |
| Cart | Add item and verify cart state | Not directly covered | Cart is browser-local state |
| Checkout | Customer checkout confirmation | Order creation validates server-side pricing and bad product IDs | Dynamic address avoids duplicate-looking data |
| Order history | Confirmation reads order ID and status | Read created order by ID | Deeper history checks are planned |
| Admin orders | Admin updates status and verifies persistence | Not directly covered | API admin status tests are planned |

## Project structure

```text
tests/
  api/        API tests for public OrderLab endpoints
  fixtures.ts Authenticated customer/admin page fixtures
  pages/      Page Objects for UI screens
  support/    Environment, auth, and API data helpers
  ui/         UI tests
```

The suite intentionally keeps Page Objects small and screen-specific. Shared
helpers live under `tests/support/` only when they are reused by more than one
test area. Authenticated UI setup lives in `tests/fixtures.ts` so customer and
admin login steps are reusable without hiding the behavior under heavy
framework layers.

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

The pipeline runs on push and pull request:

1. Check out the repository.
2. Install Node.js 20.
3. Run `npm ci`.
4. Install Playwright Chromium.
5. Run `npm run typecheck`.
6. Run `npm test`.
7. Upload `playwright-report/` and `test-results/` artifacts.

CI keeps Playwright traces in the HTML report so reviewers can inspect test
execution from the GitHub Actions artifact.

## Design notes

- Page Objects are small and screen-focused.
- Customer/admin fixtures remove duplicated login setup from UI tests.
- API helpers keep setup details out of scenario-level API specs.
- Locators prefer roles, labels, and stable `data-testid` attributes.
- Tests avoid fixed sleeps and use Playwright web-first assertions.
- Each order-related test creates its own order data.
- Public API routes are under `/api/public/*`, but protected order routes still
  require bearer authentication.
- API order tests obtain a customer bearer token through the public demo login
  flow, then call the HTTP API directly.
- CI enables Playwright traces for the portfolio report artifact; local runs use
  lighter retry-only traces.

## Known limitations and next improvements

This repository is intentionally scoped as a public v0.1 portfolio proof. The
next improvements would be:

- add a dedicated test data reset or seed endpoint;
- expand negative API checks for malformed payloads and forbidden access;
- add a public `ARCHITECTURE.md` decision log as the framework evolves;
- expand order history assertions without making tests depend on old shared
  data.
