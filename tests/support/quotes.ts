import { expect, type APIRequestContext } from '@playwright/test';
import {
  type QuoteCoverageItem,
  type QuoteResponse,
  QuotesApi,
} from './api/quotesApi';
import { type Coverage, CoveragesApi } from './api/coveragesApi';
import { createCommercialPropertyQuoteItems } from './testDataFactory';
import { coverages, insuredBusinesses } from './testData';

export type { Coverage, QuoteCoverageItem, QuoteResponse };

export async function getCommercialPropertyCoverage(
  request: APIRequestContext,
): Promise<Coverage> {
  const coveragesApi = new CoveragesApi(request);
  const body = await coveragesApi.getCoveragesBody();
  const commercialProperty = body.coverages.find(
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
  const business = insuredBusinesses.demoBrokerSubmission;
  const response = await quotesApi.createQuote(
    createCommercialPropertyQuoteItems(commercialProperty.id),
    {
      business_name: `${business.businessName} ${Date.now()}`,
      business_type: business.businessType,
      business_address: `${business.addressPrefix} ${Date.now()}`,
      annual_revenue: business.annualRevenue,
      number_of_employees: business.numberOfEmployees,
      building_value: coverages.commercialProperty.buildingValue,
      contents_value: coverages.commercialProperty.contentsValue,
      liability_limit: coverages.generalLiability.liabilityLimit,
      prior_claims: business.priorClaims,
    },
    token,
  );

  const responseBody = await response.text();

  expect(response.status(), responseBody).toBe(201);

  return JSON.parse(responseBody) as QuoteResponse;
}

export function quotedPremium(item: QuoteCoverageItem): number | undefined {
  return item.basePremium ?? item.base_premium;
}

export function quoteCoverageIds(quote: QuoteResponse): string[] {
  if (quote.coverage_ids) {
    return quote.coverage_ids;
  }

  return (quote.coverages ?? [])
    .map((coverage) => coverage.coverageId ?? coverage.coverage_id)
    .filter((coverageId): coverageId is string => Boolean(coverageId));
}

export function quoteCoverages(quote: QuoteResponse): QuoteCoverageItem[] {
  return quote.coverages ?? [];
}
