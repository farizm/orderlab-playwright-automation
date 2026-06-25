# Test Data Reset Contract

This document defines the proposed test-only reset endpoint for the OrderLab
demo app.

The endpoint is not a production business feature. It exists only to make
automated tests deterministic and easy to explain.

## Endpoint

```text
POST /api/test/reset
```

Suggested base URL:

```text
https://orderlab-playwright-target.lovable.app/api
```

Automation variable:

```env
TEST_API_BASE_URL=https://orderlab-playwright-target.lovable.app/api
TEST_RESET_TOKEN=stored-in-github-secrets
```

## Authentication

Require a test-only header:

```http
x-test-token: <token>
```

Expected behavior:

- valid token returns `200`;
- missing token returns `401` or `403`;
- invalid token returns `401` or `403`;
- token must not be reused for real production systems.

## Reset behavior

The endpoint should:

- delete orders created in the demo/test environment;
- delete related order items first if needed;
- re-seed the predictable product catalog;
- keep demo customer/admin accounts usable;
- avoid real customer data, real payments, and production business logic.

## Expected response

```json
{
  "ok": true,
  "ordersDeleted": 12,
  "productsSeeded": 6
}
```

The exact counts may vary. The response shape should remain stable.

## Automation coverage

The automation repo already contains opt-in tests in:

```text
tests/api/test-data.spec.ts
```

These tests run only when both variables are provided:

```env
TEST_API_BASE_URL
TEST_RESET_TOKEN
```

This keeps the current public CI green while documenting and enforcing the next
testability contract once the demo app endpoint exists.

## Lovable implementation prompt

Use this prompt in Lovable:

```text
Add a test-only API endpoint POST /api/test/reset.

Purpose:
Make the OrderLab demo app deterministic for Playwright automation.

Security:
- Require header x-test-token.
- Token value must come from an environment variable TEST_RESET_TOKEN.
- If token is missing or invalid, return 401 or 403.
- Do not expose service role keys or private secrets to the client.

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
