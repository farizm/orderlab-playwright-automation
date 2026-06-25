import type { APIRequestContext, APIResponse } from '@playwright/test';
import { optionalEnv } from '../env';

export type TestDataResetConfig = {
  baseUrl: string;
  token: string;
};

export function getTestDataResetConfig(): TestDataResetConfig | undefined {
  const baseUrl = optionalEnv('TEST_API_BASE_URL');
  const token = optionalEnv('TEST_RESET_TOKEN');

  if (!baseUrl || !token) {
    return undefined;
  }

  return { baseUrl, token };
}

export class TestDataApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly config: TestDataResetConfig,
  ) {}

  async reset(): Promise<APIResponse> {
    return this.request.post(`${this.config.baseUrl}/test/reset`, {
      headers: {
        'x-test-token': this.config.token,
      },
    });
  }

  async resetWithoutToken(): Promise<APIResponse> {
    return this.request.post(`${this.config.baseUrl}/test/reset`);
  }
}
