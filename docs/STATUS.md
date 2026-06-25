# Status

## Active milestone

Mature the repository from strong `v0.1` automation proof toward a more
professional SDET framework.

## Active task

Add a release checklist that connects test coverage to merge/deploy decisions.

## Acceptance criteria

- Add `RELEASE_CHECKLIST.md`.
- Cover local checks, CI gates, reset checks, artifact review, merge/deploy
  decision criteria, and escalation notes.
- Link the checklist from README.
- Update debugging guidance where it was outdated.
- Run a small verification command.

## Latest evidence

- Source-of-truth docs restored:
  - `docs/PROJECT.md`
  - `docs/ROADMAP.md`
  - `docs/STATUS.md`
  - `docs/DECISIONS.md`
- `npm run typecheck` passed locally on 2026-06-25.
- GitHub Actions Step Summary sections added for typecheck, smoke, API, and UI
  jobs.
- README now explains that CI includes job summaries plus report/failure
  artifacts.
- `npm run typecheck` passed locally after CI summary changes on 2026-06-25.
- GitHub Actions is pre-wired with:
  - `TEST_API_BASE_URL=https://orderlab-playwright-target.lovable.app/api`
  - `TEST_RESET_TOKEN=${{ secrets.TEST_RESET_TOKEN }}`
- Added `docs/LOVABLE_RESET_IMPLEMENTATION.md` with the exact Lovable prompt and
  enablement checklist.
- `npm run typecheck` passed locally after reset enablement docs and workflow
  wiring on 2026-06-25.
- Lovable endpoint was reported as implemented:
  - `POST /api/test/reset`
  - gated by `x-test-token`
  - uses `TEST_RESET_TOKEN`
  - clears `order_items` and `orders`
  - upserts seed catalog by name
  - returns `{ ok, ordersDeleted, productsSeeded }`
  - supports CORS preflight for the custom header.
- Local targeted reset test currently skips because `TEST_RESET_TOKEN` is not
  present in local `.env`.
- Added local reset variables to `.env`.
- Added `TEST_RESET_TOKEN` to GitHub Actions Secrets.
- `npm run test:api` now runs reset tests instead of skipping them, but reset
  coverage fails because the published app returns `404` for reset route:
  - `POST https://orderlab-playwright-target.lovable.app/api/test/reset` -> 404
  - `POST https://orderlab-playwright-target.lovable.app/api/public/test/reset`
    -> 404
  - control check: `GET /api/public/products` -> 200.
- Lovable route was republished and verified:
  - `POST https://orderlab-playwright-target.lovable.app/api/public/test/reset`
    -> 200 with `{ ok, ordersDeleted, productsSeeded }`
  - `GET https://orderlab-playwright-target.lovable.app/api/public/products`
    -> 200.
- Updated local and CI reset base URL to
  `https://orderlab-playwright-target.lovable.app/api/public`.
- `npm run test:api` passed locally with 13 passed and 0 skipped on 2026-06-25.
- `npm run typecheck` passed locally on 2026-06-25.
- Pushed commit `898cf17` to `main`.
- GitHub Actions run passed on 2026-06-25:
  `https://github.com/farizm/orderlab-playwright-automation/actions/runs/28179730738`
  - TypeScript typecheck passed.
  - Smoke tests passed.
  - API tests passed with reset coverage enabled.
  - UI tests passed.
  - Job summaries and Playwright artifacts were uploaded.
- README now includes an “Engineering decisions” section for technical review.
- README reset documentation was updated to reflect that reset coverage is
  enabled and token-protected.
- README wording was refined to focus on architecture trade-offs instead of
  recruiter-facing talking points.
- Added `@axe-core/playwright`.
- Added `tests/ui/accessibility.spec.ts`.
- Added `npm run test:a11y`.
- `npm run test:a11y` passed locally with 2 tests on 2026-06-25.
- `npm run typecheck` passed locally after adding accessibility coverage on
  2026-06-25.
- README, TEST_STRATEGY, and ARCHITECTURE now document the accessibility smoke
  layer.
- `npm audit` reports a high-severity advisory for Playwright `<1.55.1`; this
  existed before the a11y work and should be handled as the next focused
  dependency upgrade task.
- Pushed commit `f592d1e` to `main`.
- GitHub Actions run passed on 2026-06-25:
  `https://github.com/farizm/orderlab-playwright-automation/actions/runs/28181526145`
  - TypeScript typecheck passed.
  - Smoke tests passed.
  - API tests passed.
  - UI tests passed, including accessibility smoke coverage.
- Checked current npm version for `@playwright/test`: `1.61.1`.
- Upgraded `@playwright/test` to pinned version `1.61.1`.
- Updated GitHub Actions Playwright Docker image to
  `mcr.microsoft.com/playwright:v1.61.1-noble`.
- Reinstalled local Chromium with `npx playwright install chromium`.
- `npm audit --omit=optional` passed with 0 vulnerabilities on 2026-06-25.
- `npm run typecheck` passed locally on 2026-06-25.
- `npm run test:api` passed locally with 13 passed on 2026-06-25.
- `npm run test:smoke` passed locally with 9 passed on 2026-06-25.
- `npm run test:a11y` passed locally with 2 passed on 2026-06-25.
- `npm run test:ui` passed locally with 10 passed on 2026-06-25.
- Pushed commit `1d0eb4b` to `main`.
- GitHub Actions run passed on 2026-06-25:
  `https://github.com/farizm/orderlab-playwright-automation/actions/runs/28182368442`
  - TypeScript typecheck passed.
  - Smoke tests passed.
  - API tests passed.
  - UI tests passed.
- GitHub currently shows a non-blocking `actions/upload-artifact@v5` Node 20
  deprecation annotation while forcing Node 24. The pipeline still passes.
- Added `docs/PROJECT_FULL_DOCUMENTATION.md` with full beginner-friendly
  documentation of structure, tools, methods, architecture, and commit history.
- Renamed README title to “OrderLab Playwright Automation Framework”.
- Removed job-search wording from README and main documentation.
- Linked full documentation from README.
- `rg` check confirmed the removed wording no longer appears in README, docs,
  package metadata, or test code.
- `npm run typecheck` passed locally on 2026-06-25.
- Targeted checkout tests passed locally with 2 passed on 2026-06-25.
- Pushed commit `71391e7` to `main`.
- GitHub Actions run passed on 2026-06-25:
  `https://github.com/farizm/orderlab-playwright-automation/actions/runs/28194101322`
  - TypeScript typecheck passed.
  - Smoke tests passed.
  - API tests passed.
  - UI tests passed.
- README intro was rewritten to focus on reducing manual regression effort,
  catching release risks earlier, and providing failure evidence.
- Added a dedicated “Business value” section.
- Adjusted review guidance and engineering decision wording to read like a real
  QA automation deliverable.
- Removed stale README wording that described reset support and Playwright
  upgrade as future work.
- Added optional second-customer environment variables:
  `SECOND_CUSTOMER_EMAIL` and `SECOND_CUSTOMER_PASSWORD`.
- Added second-customer auth helper support.
- Added opt-in API regression test for cross-customer order read isolation.
- README, TEST_STRATEGY, and ARCHITECTURE now document the cross-user
  authorization coverage.
- `npm run typecheck` passed locally on 2026-06-25.
- `npm run test:api` passed locally on 2026-06-25 with 13 passed and 1 skipped.
  The skipped test is the expected cross-user authorization check waiting for
  second-customer credentials.
- Pushed commit `3ac4a86` to `main`.
- GitHub Actions run passed on 2026-06-25:
  `https://github.com/farizm/orderlab-playwright-automation/actions/runs/28194880490`
  - TypeScript typecheck passed.
  - Smoke tests passed.
  - API tests passed with the cross-user test skipped until second-customer
    credentials are configured.
  - UI tests passed.
- Verified `customer2@example.com` can authenticate through Supabase password
  grant.
- Added second-customer credentials to local `.env`.
- Added `SECOND_CUSTOMER_EMAIL` and `SECOND_CUSTOMER_PASSWORD` to GitHub
  Actions Secrets.
- Wired second-customer secrets into GitHub Actions workflow env.
- `npm run test:api` passed locally on 2026-06-25 with 14 passed and 0 skipped.
  The cross-user authorization test now runs for real.
- Pushed commit `f696f7e` to `main`.
- GitHub Actions run passed on 2026-06-25:
  `https://github.com/farizm/orderlab-playwright-automation/actions/runs/28198070751`
  - TypeScript typecheck passed.
  - Smoke tests passed.
  - API tests passed with cross-user authorization coverage enabled.
  - UI tests passed.
- Added `RELEASE_CHECKLIST.md` with local checks, CI gates, reset verification,
  artifact review, merge/deploy criteria, and escalation notes.
- Linked the checklist from README.
- Updated `DEBUGGING.md` to reflect current reset strategy, a11y command,
  second-customer credentials, and the non-blocking GitHub Actions Node
  annotation.

## Blockers

- None.

## Focused time

- Current session: source-of-truth documentation recovery and CI reviewer
  summary completed; reset endpoint handoff, CI variable wiring, and local API
  reset verification completed; GitHub Actions verified green; README
  engineering decisions section added; accessibility smoke coverage added.

## Next task

Run verification, commit, push, and confirm the checklist is available from
README.
