import { expect, test } from '../fixtures';
import { CartPage } from '../pages/CartPage';
import { ProductsPage } from '../pages/ProductsPage';

test('adds a product to the cart @smoke', async ({ customerPage }) => {
  const productsPage = new ProductsPage(customerPage);
  const cartPage = new CartPage(customerPage);

  await expect(productsPage.cartCount).toContainText('0');

  await productsPage.addProductToCart('Classic Burger');

  await expect(productsPage.cartCount).toContainText('1');

  await cartPage.open();

  await expect(cartPage.emptyState).toBeHidden();
  await expect(cartPage.productName('Classic Burger')).toBeVisible();
});
