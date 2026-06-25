# OrderLab Playwright Automation Framework

[![Playwright CI](https://github.com/farizm/orderlab-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/farizm/orderlab-playwright-automation/actions/workflows/playwright.yml)

Public SDET / QA Automation framework for the
[OrderLab Demo](https://orderlab-playwright-target.lovable.app) application.

This automation framework validates the most critical OrderLab ordering and
admin workflows through UI, API, accessibility, and CI-based checks. It helps
reduce manual regression effort, catch release risks earlier, and provide clear
failure evidence when a workflow breaks.

Repository: <https://github.com/farizm/orderlab-playwright-automation>
CI workflow: <https://github.com/farizm/orderlab-playwright-automation/actions/workflows/playwright.yml>
Latest verified green run:
<https://github.com/farizm/orderlab-playwright-automation/actions/runs/28194880490>

Architecture notes: [ARCHITECTURE.md](./ARCHITECTURE.md)  
Test strategy: [TEST_STRATEGY.md](./TEST_STRATEGY.md)  
AI-assisted QA workflow: [AI_QA_WORKFLOW.md](./AI_QA_WORKFLOW.md)  
Debugging guide: [DEBUGGING.md](./DEBUGGING.md)  
Full project documentation:
[docs/PROJECT_FULL_DOCUMENTATION.md](./docs/PROJECT_FULL_DOCUMENTATION.md)  
Test data reset contract: [docs/TEST_DATA_RESET_CONTRACT.md](./docs/TEST_DATA_RESET_CONTRACT.md)  
Lovable reset implementation guide:
[docs/LOVABLE_RESET_IMPLEMENTATION.md](./docs/LOVABLE_RESET_IMPLEMENTATION.md)

## CI evidence

![GitHub Actions green run](./docs/assets/github-actions-green-run.png)

The latest verified run shows the full pipeline passing from a clean GitHub
Actions environment: TypeScript typecheck, smoke tests, API tests, UI tests, and
artifact upload.

## Business value

This framework was built as if OrderLab needed a practical regression safety
net from a single QA automation owner. The focus is on the workflows that would
hurt the business most if they broke:

- customers must be able to sign in, find products, add items to cart, and place
  orders;
- checkout validation must prevent incomplete orders;
- order totals must be calculated by the server, not trusted from the browser;
- admins must be able to see customer orders and update order status;
- customers must not be able to read another customer's order;
- protected APIs must reject missing, invalid, or malformed requests;
- test data must be resettable so CI runs are predictable;
- failures must produce enough evidence for quick triage.

The suite is intentionally focused. It does not try to automate every possible
click. It covers the release risks that would create the most manual retesting,
customer impact, or investigation cost.

## How to review this repo in 3 minutes

1. Start with the business value section above to understand the risk focus.
2. Open the coverage matrix below to see which product areas are protected.
3. Open `tests/ui/checkout.spec.ts` for the main customer order flow.
4. Open `tests/api/orders.spec.ts` for backend validation, auth, and negative
   cases.
5. Open the latest GitHub Actions run to confirm the suite runs from CI and
   publishes reports.
6. Open `docs/PROJECT_FULL_DOCUMENTATION.md` for the full implementation
   history and architecture explanation.

## Engineering decisions

This section explains the main trade-offs behind the test architecture.

- UI and API coverage are split by risk. UI tests cover the flows where browser
  behavior matters, while API tests validate server behavior faster and more
  directly.
- Page Objects are small and screen-focused. I avoided a large generic
  framework layer because the suite does not need it yet.
- API tests authenticate through a direct auth client instead of reading browser
  storage. This keeps API coverage independent from UI login.
- The reset endpoint is a deliberate testability feature. It lets CI return the
  demo app to known seeded data instead of relying on whatever previous runs
  created.
- CI is split into typecheck, smoke, API, and UI jobs. This makes failures
  easier to localize and gives reviewers clearer evidence.
- Tests run with one worker because the target is a shared public demo app with
  public demo accounts. Reliability matters more than speed here.
- Failure artifacts are part of the debugging story: HTML reports, screenshots,
  traces, and GitHub job summaries make failures reviewable without guessing.
- The framework is intentionally small. Maintainability and release confidence
  are prioritized over adding every possible tool.

## Application under test

- Public app: <https://orderlab-playwright-target.lovable.app>
- Public API base: <https://orderlab-playwright-target.lovable.app/api/public>
- Demo customer: `customer@example.com / CustomerDemo123!`
- Demo admin: `admin@example.com / AdminDemo123!`

These are public demo fixtures, not real credentials. The app contains no real
customer data, payment processing, or production business logic.

## Tech stack

- Playwright Test
- axe-core for lightweight accessibility smoke checks
- TypeScript
- npm
- GitHub Actions
- Playwright HTML report, screenshots, and traces

## Current test coverage

This is a focused v0.1 automation suite. The goal is not maximum test count; the
goal is stable coverage of the highest-value customer, admin, API, and test data
risks.

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
| Accessibility | Login and products pages have no serious WCAG A/AA violations | Core pages keep a basic accessibility quality gate | `tests/ui/accessibility.spec.ts` |

### API scenarios

| Area | Scenario | Risk covered | File |
|---|---|---|---|
| Products API | Read product catalog | Public product endpoint returns expected seed data | `tests/api/products.spec.ts` |
| Orders API | Create an order | Server calculates subtotal and snapshots item price | `tests/api/orders.spec.ts` |
| Orders API | Read a created order by ID | Authenticated customer can retrieve the created order | `tests/api/orders.spec.ts` |
| API contracts | Validate product and order response shape | API responses keep expected fields and data types | `tests/api/*.spec.ts` |
| Orders API | Reject order creation without auth | Protected order endpoint requires bearer token | `tests/api/orders.spec.ts` |
| Orders API | Admin reads a customer order | Admin role has expected cross-role visibility | `tests/api/orders.spec.ts` |
| Orders API | Reject cross-customer order reads | Customer data remains isolated between accounts | `tests/api/orders.spec.ts` |
| Orders API | Reject unauthenticated or invalid-token order reads | Protected order reads enforce bearer authentication | `tests/api/orders.spec.ts` |
| Orders API | Return not found for unknown order | Missing valid order IDs are handled clearly | `tests/api/orders.spec.ts` |
| Orders API | Reject unknown product ID | Invalid order payloads do not create orders | `tests/api/orders.spec.ts` |
| Orders API | Reject empty items and zero quantity | Malformed order payloads are rejected | `tests/api/orders.spec.ts` |
| Test data API | Reset seeded demo data when endpoint is available | Test environment can return to a known state | `tests/api/test-data.spec.ts` |

## Coverage matrix

| Feature | UI coverage | API coverage | Notes |
|---|---|---|---|
| Login | Positive and negative login checks | API auth client obtains customer bearer token | Public demo accounts only |
| Product catalog | Search and category filter | Product list and seed data validation | Uses stable product names as fixtures |
| Cart | Add item and verify cart state | Not directly covered | Cart is browser-local state |
| Checkout | Customer checkout confirmation and required-field validation | Order creation validates server-side pricing and bad product IDs | Dynamic address avoids duplicate-looking data |
| Order history | Confirmation reads order ID and status | Read created order by ID with customer/admin authorization checks | Cross-customer read test is opt-in until a second demo customer is configured |
| Admin orders | Admin updates status and verifies persistence | Admin can read customer orders by ID | API admin status update tests are planned |
| Accessibility | Login and products pages checked with axe-core | Not applicable | Transient toast notifications are excluded from page-level scans |

## Project structure

```text
tests/
  api/        API tests for public OrderLab endpoints
  fixtures.ts Authenticated customer/admin page fixtures
  pages/      Page Objects for UI screens
  support/    Environment, auth, API clients, contracts, factories, and test data helpers
  ui/         UI tests
```

The framework intentionally keeps Page Objects small and screen-specific. Shared
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
npm run test:a11y
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
SECOND_CUSTOMER_EMAIL=
SECOND_CUSTOMER_PASSWORD=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminDemo123!
TEST_API_BASE_URL=
TEST_RESET_TOKEN=
```

`.env` is ignored by Git. The committed `.env.example` uses only public demo
fixtures.

`TEST_API_BASE_URL` should point to the test reset API namespace:

```env
TEST_API_BASE_URL=https://orderlab-playwright-target.lovable.app/api/public
```

`TEST_RESET_TOKEN` is a test-only secret. Keep it in local `.env` and GitHub
Actions Secrets, not in committed files. The reset endpoint contract is
documented in
[docs/TEST_DATA_RESET_CONTRACT.md](./docs/TEST_DATA_RESET_CONTRACT.md), and the
application-side implementation notes are in
[docs/LOVABLE_RESET_IMPLEMENTATION.md](./docs/LOVABLE_RESET_IMPLEMENTATION.md).

`SECOND_CUSTOMER_EMAIL` and `SECOND_CUSTOMER_PASSWORD` are optional until a
second demo customer is available. When configured locally and in GitHub
Secrets, the API suite also verifies that one customer cannot read another
customer's order.

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

Each Playwright job uploads its own HTML report and failure artifacts so the
failed layer can be inspected quickly.

Each job also writes a short GitHub Actions summary with the command, purpose,
and artifact names. This makes the CI run easier to review without opening raw
logs first and reduces debugging time when a release check fails.

CI stores demo account passwords in GitHub Actions Secrets. Public demo emails,
URLs, and the Supabase anon key remain in the workflow because they are not
private credentials for this demo application.

## Design notes

- Page Objects are small and screen-focused.
- Customer/admin fixtures remove duplicated login setup from UI tests.
- API auth client obtains bearer tokens without depending on UI login or browser
  storage.
- API clients keep request details out of scenario-level API specs.
- API contract helpers validate response shape and important data types.
- Test data factories prepare common scenario data such as order payloads and
  checkout details.
- Test reset support is available through a token-protected endpoint so CI can
  return the demo app to deterministic seeded data.
- Accessibility smoke checks use axe-core on key pages and fail on serious or
  critical WCAG A/AA violations.
- Tests run with one worker because the target is a shared public demo app with
  public demo accounts. This favors repeatability over speed in CI.
- Locators prefer roles, labels, and stable `data-testid` attributes.
- Tests avoid fixed sleeps and use Playwright web-first assertions.
- Each order-related test creates its own order data.
- Public API routes are under `/api/public/*`, but protected order routes still
  require bearer authentication.
- API order tests obtain a customer bearer token through Supabase password grant,
  then call the HTTP API directly.
- Cross-customer authorization coverage is opt-in until a second demo customer
  exists in the app environment.
- CI enables Playwright traces for the report artifact; local runs use
  lighter retry-only traces.

## Known limitations and next improvements

This repository is intentionally scoped as a focused v0.1 automation framework.
The next improvements would be:

- keep monitoring reset-based runs for stability as more tests use seeded data;
- expand negative API checks for forbidden cross-user access;
- keep `ARCHITECTURE.md` and `docs/DECISIONS.md` updated as the framework
  evolves;
- expand order history assertions without making tests depend on old shared
  data.
