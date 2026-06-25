import { expect, test } from '../fixtures';
import { ProductsPage } from '../pages/ProductsPage';

test('searches and filters products @regression', async ({ customerPage }) => {
  const productsPage = new ProductsPage(customerPage);

  await productsPage.searchFor('classic');
  await expect(productsPage.productCard('Classic Burger')).toBeVisible();
  await expect(productsPage.productCard('Margherita Pizza')).toBeHidden();

  await productsPage.searchFor('');
  await productsPage.filterByCategory('Pizza');

  await expect(productsPage.productCard('Margherita Pizza')).toBeVisible();
  await expect(productsPage.productCard('Veggie Pizza')).toBeVisible();
  await expect(productsPage.productCard('Classic Burger')).toBeHidden();
});
