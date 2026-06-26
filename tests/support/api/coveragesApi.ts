import type { APIRequestContext, APIResponse } from '@playwright/test';
import { requiredEnv } from '../env';

export type Coverage = {
  id: string;
  name: string;
  category: string;
  base_premium: number;
  coverage_limit: number | null;
  deductible: number | null;
};

export type CoveragesResponse = {
  coverages: Coverage[];
};

export class CoveragesApi {
  private readonly apiBaseUrl = requiredEnv('API_BASE_URL');

  constructor(private readonly request: APIRequestContext) {}

  async getCoverages(): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/coverages`);
  }

  async getCoveragesBody(): Promise<CoveragesResponse> {
    const response = await this.getCoverages();

    return this.parseCoveragesResponse(response);
  }

  async parseCoveragesResponse(
    response: APIResponse,
  ): Promise<CoveragesResponse> {
    return (await response.json()) as CoveragesResponse;
  }
}
