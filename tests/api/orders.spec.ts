import { expect, test, type APIRequestContext } from '@playwright/test';
import { getCustomerAccessToken } from '../support/auth';
import { requiredEnv } from '../support/env';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type OrderItem = {
  productId?: string;
  product_id?: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
};

type OrderResponse = {
  id: string;
  status: string;
  subtotal: number;
  items: OrderItem[];
};

async function getClassicBurger(request: APIRequestContext): Promise<Product> {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const response = await request.get(`${apiBaseUrl}/products`);
  const body = (await response.json()) as { products: Product[] };
  const classicBurger = body.products.find(
    (product) => product.name === 'Classic Burger',
  );

  if (!classicBurger) {
    throw new Error('Classic Burger was not found in the product catalog');
  }

  return classicBurger;
}

async function createClassicBurgerOrder(
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

function unitPrice(item: OrderItem): number | undefined {
  return item.unitPrice ?? item.unit_price;
}

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
  expect(unitPrice(order.items[0])).toBe(12.99);
});

test('reads a created order by ID through the API @smoke', async ({
  browser,
  request,
}) => {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const token = await getCustomerAccessToken(browser);
  const createdOrder = await createClassicBurgerOrder(request, token);
  const response = await request.get(`${apiBaseUrl}/orders/${createdOrder.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(200);

  const fetchedOrder = (await response.json()) as OrderResponse;

  expect(fetchedOrder.id).toBe(createdOrder.id);
  expect(fetchedOrder.status).toMatch(/pending/i);
  expect(fetchedOrder.subtotal).toBe(25.98);
  expect(fetchedOrder.items).toHaveLength(1);
  expect(fetchedOrder.items[0].quantity).toBe(2);
  expect(unitPrice(fetchedOrder.items[0])).toBe(12.99);
});

test('rejects creating an order without a bearer token @regression', async ({
  request,
}) => {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const classicBurger = await getClassicBurger(request);
  const response = await request.post(`${apiBaseUrl}/orders`, {
    data: {
      items: [
        {
          product_id: classicBurger.id,
          quantity: 1,
        },
      ],
    },
  });

  expect(response.status()).toBe(401);
});

test('returns not found for an unknown order ID @regression', async ({
  browser,
  request,
}) => {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const token = await getCustomerAccessToken(browser);
  const unknownOrderId = '00000000-0000-4000-8000-000000000000';
  const response = await request.get(
    `${apiBaseUrl}/orders/${unknownOrderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  expect(response.status()).toBe(404);
});

test('rejects creating an order with an unknown product ID @regression', async ({
  browser,
  request,
}) => {
  const apiBaseUrl = requiredEnv('API_BASE_URL');
  const token = await getCustomerAccessToken(browser);
  const response = await request.post(`${apiBaseUrl}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      items: [
        {
          product_id: 'unknown-product-id',
          quantity: 1,
        },
      ],
    },
  });

  expect([400, 404]).toContain(response.status());
});
