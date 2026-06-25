import type { APIRequestContext, APIResponse } from '@playwright/test';
import { requiredEnv } from '../env';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export type ProductsResponse = {
  products: Product[];
};

export class ProductsApi {
  private readonly apiBaseUrl = requiredEnv('API_BASE_URL');

  constructor(private readonly request: APIRequestContext) {}

  async getProducts(): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/products`);
  }

  async getProductsBody(): Promise<ProductsResponse> {
    const response = await this.getProducts();

    return this.parseProductsResponse(response);
  }

  async parseProductsResponse(
    response: APIResponse,
  ): Promise<ProductsResponse> {
    return (await response.json()) as ProductsResponse;
  }
}
