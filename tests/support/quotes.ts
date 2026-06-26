import { expect, type APIRequestContext } from '@playwright/test';
import {
  type QuoteCoverageItem,
  type QuoteResponse,
  QuotesApi,
} from './api/quotesApi';
import { type Coverage, CoveragesApi } from './api/coveragesApi';
import { createCommercialPropertyQuoteItems } from './testDataFactory';
import { coverages } from './testData';

export type { Coverage, QuoteCoverageItem, QuoteResponse };

export async function getCommercialPropertyCoverage(
  request: APIRequestContext,
): Promise<Coverage> {
  const coveragesApi = new CoveragesApi(request);
  const body = await coveragesApi.getCoveragesBody();
  const commercialProperty = body.products.find(
    (coverage) => coverage.name === coverages.commercialProperty.name,
  );

  if (!commercialProperty) {
    throw new Error(
      `${coverages.commercialProperty.businessLabel} was not found in the coverage catalog`,
    );
  }

  return commercialProperty;
}

export async function createCommercialPropertyQuote(
  request: APIRequestContext,
  token: string,
): Promise<QuoteResponse> {
  const quotesApi = new QuotesApi(request);
  const commercialProperty = await getCommercialPropertyCoverage(request);
  const response = await quotesApi.createQuote(
    createCommercialPropertyQuoteItems(commercialProperty.id),
    token,
  );

  const responseBody = await response.text();

  expect(response.status(), responseBody).toBe(201);

  return JSON.parse(responseBody) as QuoteResponse;
}

export function quotedPremium(item: QuoteCoverageItem): number | undefined {
  return item.unitPrice ?? item.unit_price;
}
