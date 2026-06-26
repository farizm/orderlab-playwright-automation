# Project

InsuranceLab Playwright Automation is a domain-focused QA automation portfolio
simulating P&C insurance workflows.

The project demonstrates a practical Playwright + TypeScript automation
framework around Commercial Property and General Liability quote and policy
management:

- Page Object Model for broker and underwriter UI flows;
- reusable fixtures and support helpers;
- API tests with direct auth client usage;
- coverage and quote/policy contract checks;
- stable selectors and `data-testid` contracts;
- GitHub Actions CI with reports and artifacts;
- clear documentation for portfolio review.

## Current Scope

The automation repo targets:

- public demo app: `https://demo-order-playground.lovable.app`;
- public API base: `https://demo-order-playground.lovable.app/api/public`;
- broker and underwriter demo users;
- coverage catalog, quote builder, application submission, quote confirmation,
  quote retrieval, and underwriting status management.

The public app exposes InsuranceLab route/API names while preserving the
existing automation architecture.

This is not a real insurance product. The app uses public demo fixtures only and
must not contain real insured business data, payment logic, rating rules, policy
administration, or private credentials.

## Principles

- Reliability and explainability matter more than raw test count.
- Tests should cover user-visible or API-visible behavior.
- Prefer role, label, and text locators; use `data-testid` as an explicit test
  contract when needed.
- Keep abstractions small and useful.
- Prepare data through API helpers where possible.
- Keep CI green from a clean checkout.
- Document meaningful trade-offs so the project is easy to discuss in
  portfolio review.

## Current Release State

The project preserves the original framework foundation and now reads as an
InsuranceLab portfolio:

- UI and API suites exist and pass;
- broker, coverage, quote, application, policy, and underwriting language is
  used in domain-facing tests;
- GitHub Actions/reporting setup remains compatible;
- `.env.example` documents required variables without private secrets;
- README, architecture, test strategy, and reset contract docs explain the P&C
  insurance simulation clearly.
