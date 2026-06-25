import { expect, test } from '@playwright/test';
import {
  getTestDataResetConfig,
  TestDataApi,
} from '../support/api/testDataApi';

test.describe('test data reset contract @regression', () => {
  test.skip(
    !getTestDataResetConfig(),
    'Test reset endpoint is optional until the demo app exposes /api/test/reset',
  );

  test('resets seeded demo data with a test token', async ({ request }) => {
    const config = getTestDataResetConfig();

    if (!config) {
      throw new Error('TEST_API_BASE_URL and TEST_RESET_TOKEN are required');
    }

    const testDataApi = new TestDataApi(request, config);
    const response = await testDataApi.reset();

    expect(response.status()).toBe(200);

    const body = (await response.json()) as {
      ok?: boolean;
      productsSeeded?: number;
      ordersDeleted?: number;
    };

    expect(body.ok).toBe(true);
    expect(body.productsSeeded).toEqual(expect.any(Number));
    expect(body.ordersDeleted).toEqual(expect.any(Number));
  });

  test('rejects reset requests without a test token', async ({ request }) => {
    const config = getTestDataResetConfig();

    if (!config) {
      throw new Error('TEST_API_BASE_URL and TEST_RESET_TOKEN are required');
    }

    const testDataApi = new TestDataApi(request, config);
    const response = await testDataApi.resetWithoutToken();

    expect([401, 403]).toContain(response.status());
  });
});
