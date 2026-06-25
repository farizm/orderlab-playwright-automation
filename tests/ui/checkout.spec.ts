import { expect, test } from '../fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';
import {
  checkoutCustomers,
  orderStatuses,
  products,
  uniqueAddress,
} from '../support/testData';

test('completes checkout and shows order confirmation @smoke', async ({
  customerPage,
}) => {
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);
  const ordersPage = new OrdersPage(customerPage);

  await productsPage.addProductToCart(products.classicBurger.name);

  await checkoutPage.open();
  await checkoutPage.submitOrder(
    checkoutCustomers.portfolioCustomer.name,
    uniqueAddress(checkoutCustomers.portfolioCustomer.addressPrefix),
  );

  await expect(customerPage).toHaveURL(/\/orders(\?.*)?$/);
  await expect(ordersPage.orderNumber).toBeVisible();
  await expect(ordersPage.orderStatus).toContainText(orderStatuses.pending);
});
