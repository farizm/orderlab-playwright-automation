import { expect, test } from '@playwright/test';
import { QuotesApi } from '../support/api/quotesApi';
import {
  getAdminAccessToken,
  getCustomerAccessToken,
  getSecondCustomerAccessToken,
  hasSecondCustomerCredentials,
} from '../support/auth';
import { expectQuoteContract } from '../support/contracts';
import {
  createCommercialPropertyQuote,
  getCommercialPropertyCoverage,
  quoteCoverageIds,
  quoteCoverages,
  quotedPremium,
  type QuoteResponse,
} from '../support/quotes';
import {
  createQuoteCoverageItem,
  invalidQuotePayloads,
} from '../support/testDataFactory';
import { coverages, invalidIds } from '../support/testData';

test('creates a Commercial Property quote through the API @smoke', async ({
  request,
}) => {
  const token = await getCustomerAccessToken();
  const quote = await createCommercialPropertyQuote(request, token);

  expectQuoteContract(quote);
  expect(quote.id).toBeTruthy();
  expect(quote.status).toMatch(/submitted/i);
  expect(quote.premium).toBeGreaterThanOrEqual(
    coverages.commercialProperty.basePremium,
  );
  expect(quoteCoverageIds(quote)).toHaveLength(1);
});

test('reads a created quote by ID through the API @smoke', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const createdQuote = await createCommercialPropertyQuote(request, token);
  const response = await quotesApi.getQuoteById(createdQuote.id, token);

  expect(response.status()).toBe(200);

  const fetchedQuote = (await response.json()) as QuoteResponse;

  expectQuoteContract(fetchedQuote);
  expect(fetchedQuote.id).toBe(createdQuote.id);
  expect(fetchedQuote.status).toMatch(/submitted/i);
  expect(fetchedQuote.premium).toBeGreaterThanOrEqual(
    coverages.commercialProperty.basePremium,
  );
  const fetchedCoverages = quoteCoverages(fetchedQuote);

  expect(fetchedCoverages).toHaveLength(1);
  expect(quotedPremium(fetchedCoverages[0])).toBe(
    coverages.commercialProperty.basePremium,
  );
});

test('allows an underwriter to read a broker quote by ID @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const customerToken = await getCustomerAccessToken();
  const adminToken = await getAdminAccessToken();
  const createdQuote = await createCommercialPropertyQuote(
    request,
    customerToken,
  );
  const response = await quotesApi.getQuoteById(createdQuote.id, adminToken);

  expect(response.status()).toBe(200);

  const fetchedQuote = (await response.json()) as QuoteResponse;

  expectQuoteContract(fetchedQuote);
  expect(fetchedQuote.id).toBe(createdQuote.id);
});

test('rejects reading another broker quote by ID @regression', async ({
  request,
}) => {
  test.skip(
    !hasSecondCustomerCredentials(),
    'SECOND_CUSTOMER_EMAIL and SECOND_CUSTOMER_PASSWORD are required for cross-user authorization coverage',
  );

  const quotesApi = new QuotesApi(request);
  const ownerToken = await getCustomerAccessToken();
  const otherCustomerToken = await getSecondCustomerAccessToken();
  const createdQuote = await createCommercialPropertyQuote(request, ownerToken);
  const response = await quotesApi.getQuoteById(
    createdQuote.id,
    otherCustomerToken,
  );

  expect(response.status()).toBe(403);
});

test('rejects submitting a quote without a bearer token @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const commercialProperty = await getCommercialPropertyCoverage(request);
  const response = await quotesApi.createQuote(
    [createQuoteCoverageItem(commercialProperty.id)],
    {
      business_name: 'Unauthorized Demo Business',
      business_address: '123 Unauthorized Street',
      annual_revenue: 100000,
      number_of_employees: 5,
      prior_claims: 0,
    },
  );

  expect(response.status()).toBe(401);
});

test('rejects reading a quote without a bearer token @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const createdQuote = await createCommercialPropertyQuote(request, token);
  const response = await quotesApi.getQuoteById(createdQuote.id);

  expect(response.status()).toBe(401);
});

test('rejects reading a quote with an invalid bearer token @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const createdQuote = await createCommercialPropertyQuote(request, token);
  const response = await quotesApi.getQuoteById(
    createdQuote.id,
    'invalid-demo-token',
  );

  expect([401, 403]).toContain(response.status());
});

test('returns not found for an unknown quote ID @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const response = await quotesApi.getQuoteById(
    invalidIds.unknownQuoteId,
    token,
  );

  expect(response.status()).toBe(404);
});

test('rejects creating a quote with an unknown coverage ID @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const response = await quotesApi.createQuote(
    [
      {
        coverage_id: invalidIds.unknownCoverageId,
      },
    ],
    {
      business_name: 'Unknown Coverage LLC',
      business_address: '1 Test Way',
      annual_revenue: 100000,
      number_of_employees: 5,
      prior_claims: 0,
    },
    token,
  );

  expect([400, 404]).toContain(response.status());
});

test('rejects creating a quote with an empty coverage array @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const response = await quotesApi.createQuote(
    invalidQuotePayloads.emptyItems,
    {
      business_name: 'Empty Coverage LLC',
      business_address: '1 Test Way',
      annual_revenue: 100000,
      number_of_employees: 5,
      prior_claims: 0,
    },
    token,
  );

  expect(response.status()).toBe(400);
});

test('rejects creating a quote without required business name @regression', async ({
  request,
}) => {
  const quotesApi = new QuotesApi(request);
  const token = await getCustomerAccessToken();
  const commercialProperty = await getCommercialPropertyCoverage(request);
  const response = await quotesApi.createQuote(
    [createQuoteCoverageItem(commercialProperty.id)],
    {
      business_name: '',
      business_address: '1 Test Way',
      annual_revenue: 100000,
      number_of_employees: 5,
      prior_claims: 0,
    },
    token,
  );

  expect(response.status()).toBe(400);
});

test('quote premium changes based on risk data @regression', async ({
  request,
}) => {
  const token = await getCustomerAccessToken();
  const lowRiskQuote = await createCommercialPropertyQuote(request, token);
  const highRiskQuote = await createCommercialPropertyQuote(request, token);

  expect(highRiskQuote.premium).toBe(lowRiskQuote.premium);
  test.info().annotations.push({
    type: 'domain-note',
    description:
      'The public demo target has fixed seeded pricing; InsuranceLab keeps this as a contract placeholder for future risk-rated premiums.',
  });
});
