import type { APIRequestContext, APIResponse } from '@playwright/test';
import { requiredEnv } from '../env';

export type OrderItem = {
  productId?: string;
  product_id?: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
};

export type OrderResponse = {
  id: string;
  status: string;
  subtotal: number;
  items: OrderItem[];
};

type CreateOrderItem = {
  product_id: string;
  quantity: number;
};

export class OrdersApi {
  private readonly apiBaseUrl = requiredEnv('API_BASE_URL');

  constructor(private readonly request: APIRequestContext) {}

  async createOrder(
    items: readonly CreateOrderItem[],
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

  async getOrderById(orderId: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseUrl}/orders/${orderId}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  }
}
