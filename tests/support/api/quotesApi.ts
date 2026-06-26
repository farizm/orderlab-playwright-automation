import type { APIRequestContext, APIResponse } from '@playwright/test';
import { requiredEnv } from '../env';

export type QuoteCoverageItem = {
  productId?: string;
  product_id?: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
};

export type QuoteResponse = {
  id: string;
  status: string;
  subtotal: number;
  items: QuoteCoverageItem[];
};

type CreateQuoteCoverageItem = {
  product_id: string;
  quantity: number;
};

export class QuotesApi {
  private readonly apiBaseUrl = requiredEnv('API_BASE_URL');

  constructor(private readonly request: APIRequestContext) {}

  async createQuote(
    items: readonly CreateQuoteCoverageItem[],
    token?: string,
  ): Promise<APIResponse> {
    return this.request.post(`${this.apiBaseUrl}/orders`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      data: {
        items,
      },
    });
  }

  async getQuoteById(quoteId: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/orders/${quoteId}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  }
}
