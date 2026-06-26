import { expect } from '@playwright/test';
import type { QuoteCoverageItem, QuoteResponse } from './api/quotesApi';
import type { Coverage, CoveragesResponse } from './api/coveragesApi';

export function expectCoverageContract(coverage: Coverage): void {
  expect(coverage.id).toEqual(expect.any(String));
  expect(coverage.name).toEqual(expect.any(String));
  expect(coverage.category).toEqual(expect.any(String));
  expect(coverage.base_premium).toEqual(expect.any(Number));
  expect(coverage.base_premium).toBeGreaterThan(0);
  expect(
    coverage.coverage_limit === null ||
      typeof coverage.coverage_limit === 'number',
  ).toBe(true);
  expect(coverage.deductible === null || typeof coverage.deductible === 'number')
    .toBe(true);
}

export function expectCoveragesResponseContract(
  body: CoveragesResponse,
): void {
  expect(Array.isArray(body.coverages)).toBe(true);

  for (const coverage of body.coverages) {
    expectCoverageContract(coverage);
  }
}

export function expectQuoteContract(quote: QuoteResponse): void {
  expect(quote.id).toEqual(expect.any(String));
  expect(quote.status).toEqual(expect.any(String));
  expect(quote.premium).toEqual(expect.any(Number));
  expect(quote.premium).toBeGreaterThanOrEqual(0);

  if (quote.business_name !== undefined) {
    expect(quote.business_name).toEqual(expect.any(String));
  }

  const coverageItems = quote.coverages ?? [];
  const coverageIds = quote.coverage_ids ?? [];

  expect(coverageItems.length + coverageIds.length).toBeGreaterThan(0);

  for (const coverageId of coverageIds) {
    expect(coverageId).toEqual(expect.any(String));
  }

  for (const item of coverageItems) {
    expectQuoteCoverageItemContract(item);
  }
}

function expectQuoteCoverageItemContract(item: QuoteCoverageItem): void {
  const coverageId = item.coverageId ?? item.coverage_id;
  const basePremium = item.basePremium ?? item.base_premium;

  expect(coverageId).toEqual(expect.any(String));
  expect(basePremium).toEqual(expect.any(Number));
  expect(basePremium).toBeGreaterThan(0);
}
