import { expect, test } from '../fixtures';
import { ProductsPage } from '../pages/ProductsPage';
import { productFilters, products } from '../support/testData';

test('searches and filters products @regression', async ({ customerPage }) => {
  const productsPage = new ProductsPage(customerPage);

  await productsPage.searchFor('classic');
  await expect(
    productsPage.productCard(products.classicBurger.name),
  ).toBeVisible();
  await expect(
    productsPage.productCard(products.margheritaPizza.name),
  ).toBeHidden();

  await productsPage.searchFor('');
  await productsPage.filterByCategory(productFilters.pizza);

  await expect(
    productsPage.productCard(products.margheritaPizza.name),
  ).toBeVisible();
  await expect(productsPage.productCard(products.veggiePizza.name)).toBeVisible();
  await expect(
    productsPage.productCard(products.classicBurger.name),
  ).toBeHidden();
});
