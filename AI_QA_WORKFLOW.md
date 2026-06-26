# AI-Assisted QA Workflow

Current domain: InsuranceLab, a portfolio simulation for P&C insurance quote
and policy workflows. Historical examples may use the original OrderLab target
names where the public demo app contract still does.

This project uses AI as a QA thinking assistant, not as a replacement for test
design judgment.

The goal of the workflow is to move from a feature requirement to a small,
risk-based automation set that is understandable in code review and in an
interview.

## Workflow

```text
Requirement
  → Product risk
  → Test scenarios
  → Automation candidates
  → Implemented tests
  → CI evidence
```

## Example: broker application submission

### Requirement

A broker can add coverage to the quote builder, submit application details, and
receive a quote confirmation.

### Product risks

- Application submission might create a quote with missing business details.
- Quote builder contents might not be included in the quote.
- The quote confirmation might not show a reliable quote ID or status.
- The backend might calculate the wrong premium/subtotal.

### Test scenarios

| Scenario | Level | Reason |
|---|---|---|
| Broker submits application successfully | UI | Verifies the real user journey |
| Empty underwriting fields show validation errors | UI | Verifies user-facing validation |
| API creates a quote with expected premium/subtotal | API | Verifies server-side pricing |
| API rejects unknown coverage ID | API | Verifies invalid payload handling |
| API rejects empty items and zero quantity | API | Verifies malformed payload handling |
| Quote response matches expected contract | API | Verifies important response shape |

### Automation choices

- UI tests cover what the user sees and does.
- API tests cover backend behavior faster and more directly.
- Page Objects keep UI actions readable.
- API clients keep HTTP details out of scenario-level tests.
- API auth client obtains bearer tokens without browser storage.
- Shared test data keeps seeded demo values in one place.
- Test data factories keep quote payloads and application data reusable.

### Implemented evidence

- `tests/ui/application-submission.spec.ts`
- `tests/api/quotes.spec.ts`
- `tests/support/api/quotesApi.ts`
- `tests/support/api/authApi.ts`
- `tests/support/contracts.ts`
- `tests/support/testDataFactory.ts`
- GitHub Actions HTML report artifact

## Example: underwriting quote status

### Requirement

An underwriter can view broker-submitted quotes and update quote status.

### Product risks

- Underwriter might not see newly submitted broker quotes.
- Status updates might not persist after reload.
- Broker and underwriter flows might accidentally share browser state.

### Test scenarios

| Scenario | Level | Reason |
|---|---|---|
| Broker creates a quote, underwriter updates status | UI | Verifies cross-role workflow |
| Status remains after reload | UI | Verifies persistence |

### Automation choices

- The test uses separate broker/underwriter authenticated pages.
- The quote is created during the test run instead of relying on old data.
- The underwriting page reloads before checking the quote to avoid stale list state.

### Implemented evidence

- `tests/ui/underwriting-dashboard.spec.ts`
- `tests/fixtures.ts`
- `tests/pages/UnderwritingDashboardPage.ts`

## How AI fits into this process

AI can help with:

- brainstorming risks;
- turning requirements into test ideas;
- reviewing whether coverage is too happy-path heavy;
- drafting Page Objects and helpers;
- spotting duplication;
- improving documentation.

Human review is still required for:

- deciding what risk matters;
- choosing what not to automate;
- validating selectors and test data;
- checking whether a test is stable;
- explaining trade-offs in an interview.

## Guardrails

- Do not add tests only to increase the count.
- Do not hide flaky behavior behind retries.
- Do not use brittle selectors when accessible locators or `data-testid` exist.
- Do not commit real secrets, real customer data, or production credentials.
- Keep the framework small enough to explain.

## Current improvement backlog

| Improvement | Why it matters |
|---|---|
| Test data reset/seed endpoint | Makes every run start from a known state |
| Cleanup endpoint for created orders | Allows destructive cleanup instead of isolation-only cleanup |
| Forbidden cross-user API checks | Improves authorization risk coverage |
| Accessibility smoke checks | Adds user-centered quality signal |
