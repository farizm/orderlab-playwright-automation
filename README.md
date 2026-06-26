# InsuranceLab Playwright Automation Framework

Domain-focused Playwright automation portfolio simulating P&C insurance workflows.

InsuranceLab demonstrates Commercial Property and General Liability quote and
policy management coverage using the existing Playwright + TypeScript
architecture from the original OrderLab project. It is a portfolio simulation,
not a claim of real insurance production experience.

The public demo target still exposes OrderLab routes, selectors, and API paths.
The automation domain layer maps those stable contracts to insurance concepts:
Products become Coverages, Cart becomes Quote Builder, Checkout becomes
Application Submission, Orders become Quotes / Policies, and Admin Orders become
the Underwriting Dashboard.

## Business Value

The suite focuses on workflows that matter in a P&C insurance quote journey:

- brokers can sign in, find coverages, and build a quote;
- Commercial Property and General Liability coverages are selectable;
- required application / underwriting fields are validated;
- application submission creates a quote with an underwriting status;
- underwriters can review submitted quotes and update status;
- quote and coverage API contracts validate shape, auth, and negative cases;
- reports, traces, screenshots, and CI execution remain available for review.

## Application Under Test

- Public app: <https://orderlab-playwright-target.lovable.app>
- Public API base: <https://orderlab-playwright-target.lovable.app/api/public>
- Broker fixture: `customer@example.com / CustomerDemo123!`
- Underwriter fixture: `admin@example.com / AdminDemo123!`

These are public demo fixtures. The app contains no real insured business data,
policy issuance, payments, rating engine, or production insurance logic.

## Tech Stack

- Playwright Test
- TypeScript
- Page Object Model
- npm
- axe-core accessibility smoke checks
- GitHub Actions
- Playwright HTML report, screenshots, and traces

## Current Coverage

### UI Scenarios

| Area | Scenario | File |
|---|---|---|
| Authentication | Broker login and invalid-login validation | `tests/ui/login.spec.ts` |
| Coverages | Broker searches and filters commercial coverages | `tests/ui/coverages.spec.ts` |
| Quote Builder | Broker creates a Commercial Property quote | `tests/ui/quote-builder.spec.ts` |
| Quote Builder | Broker adds General Liability coverage | `tests/ui/quote-builder.spec.ts` |
| Application | Broker submits application for underwriting | `tests/ui/application-submission.spec.ts` |
| Application | Required underwriting fields are validated | `tests/ui/application-submission.spec.ts` |
| Underwriting | Underwriter reviews quote and validates status transition | `tests/ui/underwriting-dashboard.spec.ts` |
| Accessibility | Login and coverage pages have no serious axe violations | `tests/ui/accessibility.spec.ts` |

### API Scenarios

| Area | Scenario | File |
|---|---|---|
| Coverage API | Read and validate public coverage catalog contract | `tests/api/coverages.spec.ts` |
| Quote API | Create and read Commercial Property quotes | `tests/api/quotes.spec.ts` |
| Quote API | Underwriter can read broker quote | `tests/api/quotes.spec.ts` |
| Quote API | Cross-broker quote reads are rejected when second credentials exist | `tests/api/quotes.spec.ts` |
| Quote API | Missing auth, invalid token, unknown quote, unknown coverage, empty coverage array, and zero quantity are rejected | `tests/api/quotes.spec.ts` |
| Rating Placeholder | Premium/risk-data behavior is documented against the fixed-price public demo target | `tests/api/quotes.spec.ts` |
| Test Data API | Optional reset contract remains available | `tests/api/test-data.spec.ts` |

## Project Structure

```text
tests/
  api/        API tests for coverage and quote/policy contracts
  fixtures.ts Authenticated broker/underwriter page fixtures
  pages/      Page Objects for insurance workflows
  support/    Environment, auth, API clients, contracts, factories, and test data
  ui/         Browser-based workflow tests
```

## Local Setup

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
```

Open the HTML report:

```bash
npm run report
```

## Notes For Reviewers

This repository intentionally keeps the original framework architecture:
Playwright config, fixtures, Page Objects, API clients, test data factories,
contracts, GitHub Actions, and reporting remain recognizable. The change is a
business-domain adaptation for a portfolio scenario, not a framework redesign.

Architecture notes: [ARCHITECTURE.md](./ARCHITECTURE.md)  
Test strategy: [TEST_STRATEGY.md](./TEST_STRATEGY.md)  
Debugging guide: [DEBUGGING.md](./DEBUGGING.md)  
Release checklist: [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
