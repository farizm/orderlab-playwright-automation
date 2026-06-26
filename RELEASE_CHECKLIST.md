# Release Checklist

Use this checklist for InsuranceLab portfolio changes. The public demo target
still exposes original OrderLab route/API names, but release risk should be
reviewed in broker, coverage, quote, application, policy, and underwriting
terms.

This checklist defines the minimum QA automation checks before merging or
deploying changes that affect the OrderLab app or the automation framework.

The goal is release confidence, not maximum ceremony. Use the smallest set of
checks that covers the risk of the change.

## 1. Identify the change risk

Before running tests, decide what the change can break:

- authentication or roles;
- product catalog search/filtering;
- cart or checkout;
- order creation, totals, or order history;
- admin order status management;
- API auth, authorization, or payload validation;
- seeded test data or reset behavior;
- accessibility on key pages;
- CI configuration, dependencies, or Playwright runtime.

## 2. Local pre-release checks

Run these for framework changes, dependency changes, or broad app changes:

```bash
npm run typecheck
npm run test:api
npm run test:smoke
npm run test:a11y
```

Run the full UI suite when the change touches browser flows, selectors, app UI,
or Playwright config:

```bash
npm run test:ui
```

Run all tests when the change is broad or risky:

```bash
npm test
```

## 3. Required CI gates

Before treating a release as safe, GitHub Actions should be green for:

1. TypeScript typecheck;
2. smoke tests;
3. API tests;
4. UI tests.

The API job should include:

- order creation;
- order read by owner;
- admin read access;
- cross-customer read rejection;
- missing/invalid token rejection;
- invalid order payload rejection;
- test data reset endpoint checks.

The UI job should include:

- login;
- product search/filter;
- cart;
- checkout;
- checkout validation;
- admin order status update;
- accessibility smoke checks.

## 4. Test data reset check

For CI stability, confirm the reset endpoint is working:

```bash
npm run test:api
```

Expected signal:

- reset with valid `x-test-token` returns `200`;
- reset without token returns `401` or `403`;
- seeded products remain available after reset;
- order-related tests still create fresh data successfully.

## 5. Artifact review on failure

If CI fails, do not guess. Open the failed job and inspect:

- GitHub Step Summary;
- `*-playwright-report`;
- `*-test-results`;
- screenshots;
- traces;
- error context.

Use the layer to triage quickly:

- `typecheck` failure means code/type issue;
- `smoke` failure means critical release risk;
- `api` failure means backend, auth, contract, or test data risk;
- `ui` failure means browser flow, selector, rendering, or accessibility risk.

## 6. Merge / deploy decision

Proceed only when:

- relevant local checks pass;
- GitHub Actions is green;
- any skipped test is intentional and documented;
- no `.env`, tokens, auth state, or private data are committed;
- changed documentation matches changed behavior;
- known limitations are acceptable for the release.

Do not proceed when:

- smoke tests fail;
- API auth or authorization tests fail;
- reset endpoint fails in CI;
- checkout/order creation fails;
- failure artifacts are missing and the failure cannot be explained.

## 7. Escalation notes

Escalate or pause the release when:

- customer order creation is broken;
- customer data isolation is broken;
- admin cannot update order status;
- API allows unauthorized access;
- reset endpoint deletes more than demo/test data;
- CI is red and the failure is not understood.

For app-side issues, fix the OrderLab app first, then rerun the automation
checks. For framework-side issues, fix the test code or configuration and rerun
the smallest failing layer before rerunning the full pipeline.
