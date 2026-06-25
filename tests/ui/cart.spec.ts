import { expect, test } from '../fixtures';
import { CartPage } from '../pages/CartPage';
import { ProductsPage } from '../pages/ProductsPage';
import { products } from '../support/testData';

test('adds a product to the cart @smoke', async ({ customerPage }) => {
  const productsPage = new ProductsPage(customerPage);
  const cartPage = new CartPage(customerPage);

  await expect(productsPage.cartCount).toContainText('0');

  await productsPage.addProductToCart(products.classicBurger.name);

  await expect(productsPage.cartCount).toContainText('1');

  await cartPage.open();

  await expect(cartPage.emptyState).toBeHidden();
  await expect(cartPage.productName(products.classicBurger.name)).toBeVisible();
});
