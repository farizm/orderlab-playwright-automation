import { expect, test } from '@playwright/test';
import { OrdersApi } from '../support/api/ordersApi';
import { getCustomerAccessToken } from '../support/auth';
import {
  createClassicBurgerOrder,
  getClassicBurger,
  type OrderResponse,
  unitPrice,
} from '../support/orders';
import { invalidIds, products } from '../support/testData';

test('creates an order through the API @smoke', async ({
  browser,
  request,
}) => {
  const token = await getCustomerAccessToken(browser);
  const order = await createClassicBurgerOrder(request, token);

  expect(order.id).toBeTruthy();
  expect(order.status).toMatch(/pending/i);
  expect(order.subtotal).toBe(25.98);
  expect(order.items).toHaveLength(1);
  expect(order.items[0].quantity).toBe(2);
  expect(unitPrice(order.items[0])).toBe(products.classicBurger.price);
});

test('reads a created order by ID through the API @smoke', async ({
  browser,
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken(browser);
  const createdOrder = await createClassicBurgerOrder(request, token);
  const response = await ordersApi.getOrderById(createdOrder.id, token);

  expect(response.status()).toBe(200);

  const fetchedOrder = (await response.json()) as OrderResponse;

  expect(fetchedOrder.id).toBe(createdOrder.id);
  expect(fetchedOrder.status).toMatch(/pending/i);
  expect(fetchedOrder.subtotal).toBe(25.98);
  expect(fetchedOrder.items).toHaveLength(1);
  expect(fetchedOrder.items[0].quantity).toBe(2);
  expect(unitPrice(fetchedOrder.items[0])).toBe(products.classicBurger.price);
});

test('rejects creating an order without a bearer token @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const classicBurger = await getClassicBurger(request);
  const response = await ordersApi.createOrder([
    {
      product_id: classicBurger.id,
      quantity: 1,
    },
  ]);

  expect(response.status()).toBe(401);
});

test('returns not found for an unknown order ID @regression', async ({
  browser,
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken(browser);
  const response = await ordersApi.getOrderById(
    invalidIds.unknownOrderId,
    token,
  );

  expect(response.status()).toBe(404);
});

test('rejects creating an order with an unknown product ID @regression', async ({
  browser,
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken(browser);
  const response = await ordersApi.createOrder(
    [
      {
        product_id: invalidIds.unknownProductId,
        quantity: 1,
      },
    ],
    token,
  );

  expect([400, 404]).toContain(response.status());
});
