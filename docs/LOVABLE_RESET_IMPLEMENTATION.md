# Lovable Reset Endpoint Implementation

This is the next application-side task for making the automation framework more
deterministic.

The automation repo already contains opt-in tests for this endpoint:

```text
tests/api/test-data.spec.ts
```

Those tests are skipped until both environment variables exist:

```env
TEST_API_BASE_URL=https://orderlab-playwright-target.lovable.app/api/public
TEST_RESET_TOKEN=<test-only-token>
```

## What to do in Lovable

Open the OrderLab Lovable project and paste this prompt:

```text
Add a test-only API endpoint POST /api/test/reset.

Purpose:
Make the OrderLab demo app deterministic for Playwright automation.

Security:
- Require header x-test-token.
- Token value must come from an environment variable TEST_RESET_TOKEN.
- If token is missing or invalid, return 401 or 403.
- Do not expose service role keys or private secrets to the client.
- This endpoint is for the demo/test environment only.

Behavior:
- Delete demo/test orders and related order_items.
- Re-seed the predictable product catalog idempotently.
- Keep demo customer/admin accounts usable.
- Do not touch real customer data, payments, or production business logic.

Response:
Return JSON:
{
  "ok": true,
  "ordersDeleted": number,
  "productsSeeded": number
}

Testability:
- Route should be reachable at /api/test/reset.
- It should support CORS preflight if needed.
- It should be safe to call multiple times.
```

## Lovable environment variable

Add this environment variable in Lovable:

```text
TEST_RESET_TOKEN=<generate-a-random-test-token>
```

Use a random value. Do not reuse a personal password or real production secret.

## After Lovable deploys

1. Add the same token locally in `.env`:

   ```env
   TEST_API_BASE_URL=https://orderlab-playwright-target.lovable.app/api/public
   TEST_RESET_TOKEN=<same-token>
   ```

2. Add the token to GitHub Actions Secrets:

   ```bash
   gh secret set TEST_RESET_TOKEN --repo farizm/orderlab-playwright-automation
   ```

3. Run:

   ```bash
   npm run test:api
   ```

Expected result:

- reset tests no longer show as skipped;
- reset with valid token returns `200`;
- reset without token returns `401` or `403`;
- existing API tests still pass.

## Why this matters for SDET portfolio quality

This shows that the automation project does not only “click through the UI”.
It also defines testability requirements for the app:

- deterministic test data;
- controlled reset mechanism;
- token-protected test-only endpoint;
- CI-ready environment configuration.
