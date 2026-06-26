import type { APIRequestContext, APIResponse } from '@playwright/test';
import { requiredEnv } from '../env';

export type QuoteCoverageItem = {
  coverage_id?: string;
  coverageId?: string;
  base_premium?: number;
  basePremium?: number;
  coverages?: {
    name?: string;
  };
};

export type QuoteResponse = {
  id: string;
  status: string;
  premium: number;
  business_name?: string;
  coverage_ids?: string[];
  coverages?: QuoteCoverageItem[];
};

type CreateQuoteCoverageItem = {
  coverage_id: string;
};

type CreateQuoteDetails = {
  business_name: string;
  business_type?: string | null;
  business_address: string;
  annual_revenue: number;
  number_of_employees: number;
  building_value?: number | null;
  contents_value?: number | null;
  liability_limit?: number | null;
  prior_claims: number;
};

export class QuotesApi {
  private readonly apiBaseUrl = requiredEnv('API_BASE_URL');

  constructor(private readonly request: APIRequestContext) {}

  async createQuote(
    coverageItems: readonly CreateQuoteCoverageItem[],
    details: CreateQuoteDetails,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.post(`${this.apiBaseUrl}/quotes`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      data: {
        coverage_ids: coverageItems.map((item) => item.coverage_id),
        ...details,
      },
    });
  }

  async getQuoteById(quoteId: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/quotes/${quoteId}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  }
}
