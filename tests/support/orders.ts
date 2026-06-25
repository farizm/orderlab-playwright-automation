import { expect, type APIRequestContext } from '@playwright/test';
import {
  type OrderItem,
  type OrderResponse,
  OrdersApi,
} from './api/ordersApi';
import { type Product, ProductsApi } from './api/productsApi';
import { products } from './testData';

export type { OrderItem, OrderResponse, Product };

export async function getClassicBurger(
  request: APIRequestContext,
): Promise<Product> {
  const productsApi = new ProductsApi(request);
  const body = await productsApi.getProductsBody();
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
  const ordersApi = new OrdersApi(request);
  const classicBurger = await getClassicBurger(request);
  const response = await ordersApi.createOrder(
    [
      {
        product_id: classicBurger.id,
        quantity: 2,
      },
    ],
    token,
  );

  const responseBody = await response.text();

  expect(response.status(), responseBody).toBe(201);

  return JSON.parse(responseBody) as OrderResponse;
}

export function unitPrice(item: OrderItem): number | undefined {
  return item.unitPrice ?? item.unit_price;
}
