# Project

OrderLab Playwright Automation is a public SDET / QA Automation portfolio
project for the OrderLab demo application.

The project demonstrates a practical automation framework around a small order
management app:

- Playwright with TypeScript;
- Page Object Model for UI flows;
- reusable fixtures and support helpers;
- API tests with direct auth client usage;
- stable selectors and `data-testid` contracts;
- GitHub Actions CI with reports and artifacts;
- clear documentation for interview review.

## Current scope

The automation repo targets:

- public demo app: `https://orderlab-playwright-target.lovable.app`;
- public API base: `https://orderlab-playwright-target.lovable.app/api/public`;
- customer and admin demo users;
- product catalog, cart, checkout, order confirmation, order retrieval, and
  admin order status management.

This is not a real business product. The app uses public demo fixtures only and
must not contain real customer data, payment logic, or private credentials.

## Principles

- Reliability and explainability matter more than raw test count.
- Tests should cover user-visible or API-visible behavior.
- Prefer role, label, and text locators; use `data-testid` as an explicit test
  contract when needed.
- Keep abstractions small and useful.
- Prepare data through API helpers where possible.
- Keep CI green from a clean checkout.
- Document meaningful trade-offs so the project is easy to discuss in
  interviews.

## Current release state

The project has passed the original `v0.1` release gate:

- public app is reachable;
- UI and API suites exist and pass;
- GitHub Actions has a verified green run;
- reports and artifacts are uploaded by CI;
- `.env.example` documents required variables without private secrets;
- README, architecture, test strategy, debugging, and AI workflow docs exist.

The current focus is improving the repo from strong `v0.1` portfolio proof
toward a more mature SDET-style project without overengineering.
