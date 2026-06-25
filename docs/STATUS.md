# Status

## Active milestone

Mature the repository from strong `v0.1` portfolio proof toward a more
professional SDET portfolio project.

## Active task

Choose the next focused senior-level improvement after reset endpoint enablement.

## Acceptance criteria

- Pick one next task from `docs/ROADMAP.md` or Parking Lot.
- Prefer the highest portfolio impact with the least overengineering.
- Define acceptance criteria before implementation.

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

## Blockers

- None.

## Focused time

- Current session: source-of-truth documentation recovery and CI reviewer
  summary completed; reset endpoint handoff, CI variable wiring, and local API
  reset verification completed; GitHub Actions verified green.

## Next task

Decide the next small senior-level improvement. Good candidates:

- add a lightweight accessibility smoke check;
- add one forbidden cross-user API test if the app can support a second
  customer;
- improve README with a short “interview talking points” section.
