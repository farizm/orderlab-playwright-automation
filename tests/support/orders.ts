import { expect, type APIRequestContext } from '@playwright/test';
import { requiredEnv } from './env';
import { products } from './testData';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

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

export async function getClassicBurger(
  request: APIRequestContext,
): Promise<Product> {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const response = await request.get(`${apiBaseUrl}/products`);
  const body = (await response.json()) as { products: Product[] };
  const classicBurger = body.products.find(
    (product) => product.name === products.classicBurger.name,
  );

  if (!classicBurger) {
    throw new Error(
      `${products.classicBurger.name} was not found in the product catalog`,
    );
  }

  return classicBurger;
}

export async function createClassicBurgerOrder(
  request: APIRequestContext,
  token: string,
): Promise<OrderResponse> {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const classicBurger = await getClassicBurger(request);
  const response = await request.post(`${apiBaseUrl}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      items: [
        {
          product_id: classicBurger.id,
          quantity: 2,
        },
      ],
    },
  });

  const responseBody = await response.text();

  expect(response.status(), responseBody).toBe(201);

  return JSON.parse(responseBody) as OrderResponse;
}

export function unitPrice(item: OrderItem): number | undefined {
  return item.unitPrice ?? item.unit_price;
}
