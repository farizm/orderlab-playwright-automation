import type { APIRequestContext, APIResponse } from '@playwright/test';
import { requiredEnv } from '../env';

export type Coverage = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export type CoveragesResponse = {
  products: Coverage[];
};

export class CoveragesApi {
  private readonly apiBaseUrl = requiredEnv('API_BASE_URL');

  constructor(private readonly request: APIRequestContext) {}

  async getCoverages(): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/products`);
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
