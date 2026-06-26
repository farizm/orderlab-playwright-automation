import { expect, test } from '@playwright/test';
import { CoveragesApi } from '../support/api/coveragesApi';
import { expectCoveragesResponseContract } from '../support/contracts';
import { coverages } from '../support/testData';

test('reads the public commercial coverage catalog @smoke', async ({
  request,
}) => {
  const coveragesApi = new CoveragesApi(request);
  const response = await coveragesApi.getCoverages();

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await coveragesApi.parseCoveragesResponse(response);

  expectCoveragesResponseContract(body);
  expect(body.coverages).toHaveLength(3);

  const commercialProperty = body.coverages.find(
    (coverage) => coverage.name === coverages.commercialProperty.name,
  );

  expect(commercialProperty).toMatchObject({
    category: coverages.commercialProperty.category,
    base_premium: coverages.commercialProperty.basePremium,
    coverage_limit: coverages.commercialProperty.coverageLimit,
    deductible: coverages.commercialProperty.deductible,
  });
});
