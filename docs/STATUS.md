# Status

## Active milestone

Mature the repository from strong `v0.1` portfolio proof toward a more
professional SDET portfolio project.

## Active task

Add lightweight accessibility smoke coverage with axe-core.

## Acceptance criteria

- Add a small axe-core Playwright test.
- Cover at least the login page and authenticated products page.
- Fail only on serious or critical WCAG A/AA violations to keep the gate useful
  and stable.
- Document the accessibility strategy and any intentional exclusions.
- `npm run test:a11y` and `npm run typecheck` pass locally.

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

## Blockers

- None.

## Focused time

- Current session: source-of-truth documentation recovery and CI reviewer
  summary completed; reset endpoint handoff, CI variable wiring, and local API
  reset verification completed; GitHub Actions verified green; README
  engineering decisions section added; accessibility smoke coverage added.

## Next task

Upgrade Playwright to a patched version and verify local + CI stability.
