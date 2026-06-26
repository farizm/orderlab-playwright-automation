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
  expect(body.products).toHaveLength(6);

  const commercialProperty = body.products.find(
    (coverage) => coverage.name === coverages.commercialProperty.name,
  );

  expect(commercialProperty).toMatchObject({
    category: coverages.commercialProperty.category,
    price: coverages.commercialProperty.price,
  });
});
