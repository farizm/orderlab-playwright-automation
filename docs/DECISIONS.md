# Decisions

This file records meaningful project decisions and trade-offs. It is meant to
support interview explanation, not to document every small edit.

## 2026-06-25 — Keep the framework small and explainable

Decision:

- Keep the project as a focused Playwright + TypeScript automation framework
  instead of adding many tools at once.

Reason:

- The strongest signal for this stage is stable UI/API coverage, clean
  structure, green CI, and clear documentation.

Trade-off:

- The project intentionally delays Docker, Allure, visual regression,
  multi-browser CI, and other optional infrastructure until the core suite stays
  reliably green.

## 2026-06-25 — API tests should not depend on UI login

Decision:

- API tests use a direct auth client for bearer tokens instead of reading token
  values from browser storage.

Reason:

- API tests should be independent from UI login flow and easier to explain as a
  separate test layer.

Trade-off:

- The auth helper depends on public demo Supabase configuration, which is
  acceptable for this demo app but should not be copied into a real production
  framework without secure secret management.

## 2026-06-25 — Test reset is an opt-in contract until the app supports it

Decision:

- The automation repo documents and tests the proposed `POST /api/test/reset`
  endpoint, but skips reset tests unless reset environment variables are
  provided.

Reason:

- This keeps CI green today while clearly defining the next testability
  improvement for the demo app.

Trade-off:

- The framework is ready for deterministic reset, but full reset coverage is
  blocked until the application implements the endpoint.

## 2026-06-25 — Restore source-of-truth docs

Decision:

- Add `docs/PROJECT.md`, `docs/ROADMAP.md`, `docs/STATUS.md`, and
  `docs/DECISIONS.md` because `AGENTS.md` requires them before work sessions.

Reason:

- The project should be guided by repo documentation, not by scattered chat
  history.

Trade-off:

- This is documentation work, not new test coverage, but it improves
  maintainability and focus for future work.

## 2026-06-25 — Add GitHub Actions job summaries

Decision:

- Each CI job writes a short GitHub Actions Step Summary with its purpose,
  command, and artifact names.

Reason:

- Hiring managers and reviewers should be able to understand the CI signal
  without reading raw logs first.

Trade-off:

- This does not add test coverage, but it improves the professional review
  experience and makes the pipeline easier to debug.

## 2026-06-25 — Pre-wire reset endpoint variables in CI

Decision:

- Add `TEST_API_BASE_URL` and `TEST_RESET_TOKEN` wiring to GitHub Actions before
  the Lovable reset endpoint exists.

Reason:

- Once the application endpoint is deployed, enabling reset coverage should only
  require adding the `TEST_RESET_TOKEN` repository secret.

Trade-off:

- Reset tests continue to skip while the secret is missing or the app endpoint
  is not implemented. This keeps CI green while making the next testability step
  explicit.

## 2026-06-25 — Use public API namespace for the reset endpoint

Decision:

- Configure reset tests to call
  `https://orderlab-playwright-target.lovable.app/api/public/test/reset`.

Reason:

- The Lovable platform exposes the implemented route under the public API
  namespace, and this path was verified with a real `200` response.

Trade-off:

- The endpoint is still protected by `x-test-token`, but the URL itself is
  publicly reachable. This is acceptable for the demo because the token is
  stored in local `.env` and GitHub Secrets, and no real customer data exists.

## 2026-06-25 — Add lightweight accessibility smoke checks

Decision:

- Add axe-core smoke checks for the login page and authenticated products page.
- Fail only on serious or critical WCAG A/AA violations.
- Exclude transient toast notifications from page-level scans.

Reason:

- Accessibility is a meaningful quality signal for an SDET framework, but the
  first iteration should stay small and stable.

Trade-off:

- This is not a full accessibility audit. It is a lightweight automated gate
  that catches obvious serious issues while avoiding noisy failures from
  short-lived third-party UI elements.

## 2026-06-25 — Upgrade Playwright for security maintenance

Decision:

- Upgrade `@playwright/test` from `1.53.0` to pinned version `1.61.1`.
- Update GitHub Actions to use `mcr.microsoft.com/playwright:v1.61.1-noble`.

Reason:

- `npm audit` reported a high-severity advisory for Playwright versions below
  `1.55.1`. Keeping the automation runtime patched is part of treating the test
  framework as production-quality tooling.

Trade-off:

- Browser/runtime upgrades can introduce behavior changes, so the upgrade is
  verified with typecheck, API tests, smoke tests, accessibility smoke tests,
  and GitHub Actions.
