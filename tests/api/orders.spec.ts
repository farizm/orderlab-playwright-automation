import { expect, test } from '@playwright/test';
import { OrdersApi } from '../support/api/ordersApi';
import { getAdminAccessToken, getCustomerAccessToken } from '../support/auth';
import { expectOrderContract } from '../support/contracts';
import {
  createClassicBurgerOrder,
  getClassicBurger,
  type OrderResponse,
  unitPrice,
} from '../support/orders';
import { createOrderItem, invalidOrderPayloads } from '../support/testDataFactory';
import { invalidIds, products } from '../support/testData';

test('creates an order through the API @smoke', async ({ request }) => {
  const token = await getCustomerAccessToken();
  const order = await createClassicBurgerOrder(request, token);

  expectOrderContract(order);
  expect(order.id).toBeTruthy();
  expect(order.status).toMatch(/pending/i);
  expect(order.subtotal).toBe(25.98);
  expect(order.items).toHaveLength(1);
  expect(order.items[0].quantity).toBe(2);
  expect(unitPrice(order.items[0])).toBe(products.classicBurger.price);
});

test('reads a created order by ID through the API @smoke', async ({ request }) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
  const createdOrder = await createClassicBurgerOrder(request, token);
  const response = await ordersApi.getOrderById(createdOrder.id, token);

  expect(response.status()).toBe(200);

  const fetchedOrder = (await response.json()) as OrderResponse;

  expectOrderContract(fetchedOrder);
  expect(fetchedOrder.id).toBe(createdOrder.id);
  expect(fetchedOrder.status).toMatch(/pending/i);
  expect(fetchedOrder.subtotal).toBe(25.98);
  expect(fetchedOrder.items).toHaveLength(1);
  expect(fetchedOrder.items[0].quantity).toBe(2);
  expect(unitPrice(fetchedOrder.items[0])).toBe(products.classicBurger.price);
});

test('allows an admin to read a customer order by ID @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const customerToken = await getCustomerAccessToken();
  const adminToken = await getAdminAccessToken();
  const createdOrder = await createClassicBurgerOrder(request, customerToken);
  const response = await ordersApi.getOrderById(createdOrder.id, adminToken);

  expect(response.status()).toBe(200);

  const fetchedOrder = (await response.json()) as OrderResponse;

  expectOrderContract(fetchedOrder);
  expect(fetchedOrder.id).toBe(createdOrder.id);
});

test('rejects creating an order without a bearer token @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const classicBurger = await getClassicBurger(request);
  const response = await ordersApi.createOrder([
    createOrderItem(classicBurger.id),
  ]);

  expect(response.status()).toBe(401);
});

test('rejects reading an order without a bearer token @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
  const createdOrder = await createClassicBurgerOrder(request, token);
  const response = await ordersApi.getOrderById(createdOrder.id);

  expect(response.status()).toBe(401);
});

test('rejects reading an order with an invalid bearer token @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
  const createdOrder = await createClassicBurgerOrder(request, token);
  const response = await ordersApi.getOrderById(
    createdOrder.id,
    'invalid-demo-token',
  );

  expect([401, 403]).toContain(response.status());
});

test('returns not found for an unknown order ID @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
  const response = await ordersApi.getOrderById(
    invalidIds.unknownOrderId,
    token,
  );

  expect(response.status()).toBe(404);
});

test('rejects creating an order with an unknown product ID @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
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

test('rejects creating an order with an empty items array @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
  const response = await ordersApi.createOrder(
    invalidOrderPayloads.emptyItems,
    token,
  );

  expect(response.status()).toBe(400);
});

test('rejects creating an order with zero quantity @regression', async ({
  request,
}) => {
  const ordersApi = new OrdersApi(request);
  const token = await getCustomerAccessToken();
  const classicBurger = await getClassicBurger(request);
  const response = await ordersApi.createOrder(
    invalidOrderPayloads.zeroQuantity(classicBurger.id),
    token,
  );

  expect(response.status()).toBe(400);
});
