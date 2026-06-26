# InsuranceLab Automation Architecture

InsuranceLab is a Playwright + TypeScript automation portfolio simulating P&C
insurance workflows for Commercial Property and General Liability quote and
policy management.

The project preserves the original Playwright automation architecture and now
targets a dedicated InsuranceLab demo app with insurance-specific routes,
selectors, and API paths.

## High-Level Structure

```text
tests/
  api/        API-level tests for coverage and quote/policy behavior
  fixtures.ts Reusable authenticated broker/underwriter page fixtures
  pages/      Page Objects for workflow screens
  support/    Shared helpers for environment, auth, API clients, contracts, factories, and test data
  ui/         Browser-based UI workflow tests
```

## Domain Mapping

| Original app contract | InsuranceLab domain |
|---|---|
| Products | Coverages |
| Product | Coverage |
| Cart | Quote Builder |
| Checkout | Application Submission |
| Orders | Quotes / Policies |
| Admin Orders | Underwriting Dashboard |
| Customer | Broker / Insured Business |
| Order Status | Quote / Policy Status |
| Product API | Coverage API |
| Order API | Quote / Policy API |

## Page Object Model

Page Objects remain small and screen-focused:

- `LoginPage`
- `CoveragesPage`
- `QuoteBuilderPage`
- `ApplicationSubmitPage`
- `PoliciesPage`
- `UnderwritingDashboardPage`

Methods describe insurance workflow actions, such as
`addCoverageToQuoteBuilder`, `submitApplication`, and `updateStatus`. Selectors
such as `product-card`, `cart-count`, and `order-number` remain unchanged
because they are the public demo target's stable test contract.

## Fixtures

The suite uses Playwright fixtures for authenticated users:

- `brokerPage` logs in with the public broker/customer fixture and starts on the
  coverage catalog.
- `underwriterPage` logs in with the public admin fixture and starts on the
  underwriting dashboard.

The project does not use persisted `storageState`; UI login remains explicit and
easy to review.

## Test Data Strategy

Insurance-shaped data lives in `tests/support/testData.ts` and includes fields
such as `businessName`, `businessType`, `businessAddress`, `annualRevenue`,
`numberOfEmployees`, `coverageName`, `coverageLimit`, `deductible`,
`buildingValue`, `contentsValue`, `liabilityLimit`, `priorClaims`,
`underwritingStatus`, `quoteId`, and `policyId` where relevant.

Because the public target has fixed seeded data, coverage display names still
map to the existing seeded items. This keeps the portfolio executable while the
test names, Page Objects, factories, and contracts communicate the insurance
domain.

## API Client Layer

HTTP details stay in small API clients:

- `CoveragesApi`
- `QuotesApi`
- `AuthApi`
- `TestDataApi`

The `CoveragesApi` client calls `/coverages`.
The `QuotesApi` client calls `/quotes`. Specs use insurance-domain names across
UI and API layers.

## CI And Reporting

The Playwright configuration and reporting setup are unchanged:

- TypeScript typecheck;
- smoke/regression tagging;
- API and UI test commands;
- Chromium project;
- one worker for shared public demo stability;
- HTML report;
- screenshots and traces on failure.

GitHub Actions should continue to work because scripts, Playwright config, and
reporting paths remain stable.

## Intentional Trade-Offs

This is a portfolio simulation, not a fake enterprise insurance platform. It
does not implement a real rating engine, policy administration system, payment
flow, agency portal, or production underwriting rules.

The suite favors a small, professional adaptation:

- preserve architecture;
- rename domain-facing files/classes/functions carefully;
- keep selectors, routes, and config stable;
- use insurance wording in tests and docs;
- avoid overengineering.
