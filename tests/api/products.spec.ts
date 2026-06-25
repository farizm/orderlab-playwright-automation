import { expect, test } from '@playwright/test';
import { ProductsApi } from '../support/api/productsApi';
import { products } from '../support/testData';

test('reads the public product catalog @smoke', async ({ request }) => {
  const productsApi = new ProductsApi(request);
  const response = await productsApi.getProducts();

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await productsApi.parseProductsResponse(response);

  expect(body.products).toHaveLength(6);

  const classicBurger = body.products.find(
    (product) => product.name === products.classicBurger.name,
  );

  expect(classicBurger).toMatchObject({
    category: products.classicBurger.category,
    price: products.classicBurger.price,
  });
});
