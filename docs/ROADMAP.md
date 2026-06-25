# Roadmap

This roadmap keeps work focused. Only one active item should be in progress at
a time.

## Completed v0.1 proof

- Playwright + TypeScript project setup.
- UI tests for login, product search/filtering, cart, checkout, and admin order
  status update.
- API tests for products, order creation, order reads, auth, invalid tokens,
  invalid payloads, and contract checks.
- Page Objects, fixtures, API clients, test data helpers, and factories.
- GitHub Actions split into typecheck, smoke, API, and UI jobs.
- CI artifacts for Playwright reports and failure evidence.
- README, architecture, test strategy, debugging guide, and AI QA workflow docs.
- Release checklist for merge/deploy quality gates.
- Full beginner-friendly project documentation.
- GitHub Secrets for demo passwords.
- Opt-in test data reset contract and tests.
- Lightweight axe-core accessibility smoke checks.
- Playwright upgraded to patched version `1.61.1` with matching CI Docker image.

## Active improvement path

### 1. Project source of truth

Goal: make project guidance self-contained and not dependent on chat history.

Acceptance criteria:

- `docs/PROJECT.md` explains scope and principles.
- `docs/ROADMAP.md` lists completed and next work.
- `docs/STATUS.md` shows the one active task and latest verification.
- `docs/DECISIONS.md` records meaningful trade-offs.
- `docs/LOVABLE_RESET_IMPLEMENTATION.md` explains the application-side reset
  endpoint work.

### 2. CI reviewer summary

Goal: make GitHub Actions easier to review like a professional SDET project.

Acceptance criteria:

- Each CI job writes a concise GitHub Step Summary.
- Summary explains command, purpose, and artifact names.
- README mentions that CI provides job summaries and report artifacts.
- Typecheck and targeted tests remain green.

### 3. Demo app reset endpoint

Goal: turn the documented reset contract into a working app capability.

Acceptance criteria:

- Demo app exposes `POST /api/test/reset`.
- Endpoint requires `x-test-token`.
- Endpoint resets demo orders and re-seeds products idempotently.
- Local and CI API reset tests run without skipping when reset variables are
  configured.
- GitHub Actions is already wired to read `TEST_RESET_TOKEN` from repository
  secrets.

### 4. Senior-level reliability evidence

Goal: show that the framework is not just written, but operated.

Acceptance criteria:

- README links to a recent green CI run.
- Debugging guide explains common failures and fixes.
- Known limitations are explicit and honest.
- No private secrets or `.env` are committed.

### 5. Dependency security upgrade

Goal: keep the automation runtime current enough for public technical review.

Acceptance criteria:

- Playwright is upgraded to a version that resolves the current audit advisory.
- CI Docker image matches the Playwright package version.
- `npm run typecheck`, `npm run test:a11y`, `npm run test:api`, and CI pass.

Status: completed for Playwright `1.61.1`.

## Parking lot

Do not start these until the active path above is done:

- Allure reporting;
- multi-browser CI;
- scheduled CI;
- Dockerized local environment;
- visual regression;
- performance checks;
- Jira-style traceability docs.
