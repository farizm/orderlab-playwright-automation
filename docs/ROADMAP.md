# Roadmap

This roadmap keeps work focused. Only one active item should be in progress at
a time.

## Completed Foundation

- Playwright + TypeScript project setup.
- Page Objects, fixtures, API clients, test data helpers, and factories.
- GitHub Actions split into typecheck, smoke, API, and UI jobs.
- CI artifacts for Playwright reports and failure evidence.
- Opt-in test data reset contract and tests.
- Lightweight axe-core accessibility smoke checks.
- Playwright upgraded to patched version `1.61.1`.

## Completed InsuranceLab Adaptation

- Domain mapping from OrderLab to InsuranceLab.
- UI tests for broker login, coverage search/filtering, quote builder,
  application submission, required underwriting fields, and underwriting status
  review.
- API tests for coverage catalog, quote creation/readback, underwriter access,
  broker isolation, auth failures, unknown IDs, and invalid quote payloads.
- Insurance-shaped test data fields for insured businesses, coverage limits,
  deductibles, revenue, employees, prior claims, and quote/policy status.
- README, architecture, and test strategy rewritten for P&C insurance portfolio
  review.

## Active Improvement Path

### 1. Keep CI reviewer evidence current

Acceptance criteria:

- README links to a recent green CI run when available.
- Typecheck and full Playwright suite remain green.
- HTML report and failure artifacts are uploaded by CI.

### 2. Demo app reset endpoint

Acceptance criteria:

- Demo app exposes `POST /api/test/reset`.
- Endpoint requires `x-test-token`.
- Endpoint resets demo quotes/orders and re-seeds coverages/products
  idempotently.
- Local and CI API reset tests run when reset variables are configured.

### 3. Future domain depth without overengineering

Acceptance criteria:

- Add only executable behavior that the public target can support.
- Keep selectors, fixtures, Playwright config, and reporting stable.
- Document limitations honestly when the public target has fixed demo behavior,
  such as non-real risk-based pricing.

## Parking Lot

Do not start these unless they support a clear portfolio goal:

- Allure reporting;
- multi-browser CI;
- scheduled CI;
- Dockerized local environment;
- visual regression;
- performance checks;
- fake complex insurance administration features.
