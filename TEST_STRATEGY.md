# Test Strategy

InsuranceLab is a domain-focused Playwright automation portfolio simulating P&C
insurance workflows. It demonstrates how a QA automation suite can cover
Commercial Property and General Liability quote and policy management without
claiming real insurance production experience.

## What We Test

The suite focuses on the main broker and underwriter journeys:

- broker login;
- coverage search and filtering;
- Commercial Property quote creation;
- General Liability coverage selection;
- required underwriting/application field validation;
- application submission for underwriting;
- quote/policy status validation;
- underwriter review and status update;
- coverage and quote API contracts;
- auth, authorization, unknown ID, and malformed payload cases;
- lightweight accessibility smoke checks.

## What We Do Not Test

This is a public demo simulation, not a production insurance platform. The
suite intentionally does not cover:

- real rating algorithms;
- real policy issuance or binding;
- real insured business data;
- payments or billing;
- claims handling;
- document generation;
- agency management integrations;
- large cross-browser or performance matrices.

## UI Tests

UI tests cover flows where browser behavior matters:

- authentication;
- coverage catalog search/filter behavior;
- quote builder state;
- application submission validation;
- quote confirmation;
- underwriting dashboard review and status transition.

The tests use Page Objects, Playwright web-first assertions, roles, labels,
visible text, and stable `data-testid` selectors.

## API Tests

API tests validate server-visible behavior more directly:

- coverage catalog response contract;
- quote creation and readback;
- underwriter access to broker quote;
- cross-broker access rejection when second credentials are configured;
- missing/invalid token handling;
- unknown quote and coverage IDs;
- empty coverage arrays and zero coverage quantity;
- a documented placeholder for risk-based premium behavior.

The public demo target currently has fixed seeded pricing, so the risk-premium
test records that limitation instead of pretending a real rating engine exists.

## Test Data

Shared data and factories keep the domain readable:

- `tests/support/testData.ts` stores coverages, quote statuses, invalid IDs, and
  insured business fixtures.
- `tests/support/testDataFactory.ts` creates quote coverage payloads and
  application details.
- `tests/support/quotes.ts` creates reusable API quote setup.

Dynamic business addresses use timestamps so repeated runs remain easy to
distinguish.

## Locator Strategy

Preferred locator order:

1. user-facing roles and labels;
2. meaningful visible text;
3. stable `data-testid` attributes for explicit test contracts.

The suite avoids XPath, long CSS chains, selectors based on styling, and fixed
waits.

## CI And Reporting

The existing Playwright commands remain:

```bash
npm run typecheck
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api
npm run test:a11y
```

The suite runs with one worker because it targets a shared public demo app and
public demo accounts. HTML reports, traces, and screenshots provide reviewable
failure evidence.

## Definition Of Done

A test is acceptable when it:

- verifies user-visible or API-visible behavior;
- has a clear insurance-domain reason to exist;
- can run independently;
- uses stable locators and factories;
- keeps TypeScript strict and readable;
- passes locally and in CI;
- can be explained clearly as portfolio automation.
