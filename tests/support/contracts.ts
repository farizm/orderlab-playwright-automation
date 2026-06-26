import { expect } from '@playwright/test';
import type { QuoteCoverageItem, QuoteResponse } from './api/quotesApi';
import type { Coverage, CoveragesResponse } from './api/coveragesApi';

export function expectCoverageContract(coverage: Coverage): void {
  expect(coverage.id).toEqual(expect.any(String));
  expect(coverage.name).toEqual(expect.any(String));
  expect(coverage.category).toEqual(expect.any(String));
  expect(coverage.price).toEqual(expect.any(Number));
  expect(coverage.price).toBeGreaterThan(0);
}

export function expectCoveragesResponseContract(
  body: CoveragesResponse,
): void {
  expect(Array.isArray(body.products)).toBe(true);

  for (const coverage of body.products) {
    expectCoverageContract(coverage);
  }
}

export function expectQuoteContract(quote: QuoteResponse): void {
  expect(quote.id).toEqual(expect.any(String));
  expect(quote.status).toEqual(expect.any(String));
  expect(quote.subtotal).toEqual(expect.any(Number));
  expect(quote.subtotal).toBeGreaterThanOrEqual(0);
  expect(Array.isArray(quote.items)).toBe(true);

  for (const item of quote.items) {
    expectQuoteCoverageItemContract(item);
  }
}

function expectQuoteCoverageItemContract(item: QuoteCoverageItem): void {
  const productId = item.productId ?? item.product_id;
  const unitPrice = item.unitPrice ?? item.unit_price;

  expect(productId).toEqual(expect.any(String));
  expect(item.quantity).toEqual(expect.any(Number));
  expect(item.quantity).toBeGreaterThan(0);
  expect(unitPrice).toEqual(expect.any(Number));
  expect(unitPrice).toBeGreaterThan(0);
}
