import { expect, test } from '../fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';

test('completes checkout and shows order confirmation @smoke', async ({
  customerPage,
}) => {
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);
  const ordersPage = new OrdersPage(customerPage);

  await productsPage.addProductToCart('Classic Burger');

  await checkoutPage.open();
  await checkoutPage.submitOrder(
    'Portfolio Test Customer',
    `123 Demo Street ${Date.now()}`,
  );

  await expect(customerPage).toHaveURL(/\/orders(\?.*)?$/);
  await expect(ordersPage.orderNumber).toBeVisible();
  await expect(ordersPage.orderStatus).toContainText('Pending');
});
