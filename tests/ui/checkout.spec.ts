import { expect, test } from '../fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';
import {
  orderStatuses,
  products,
} from '../support/testData';
import { createCheckoutDetails } from '../support/testDataFactory';

test('completes checkout and shows order confirmation @smoke', async ({
  customerPage,
}) => {
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);
  const ordersPage = new OrdersPage(customerPage);

  await productsPage.addProductToCart(products.classicBurger.name);

  await checkoutPage.open();
  const checkoutDetails = createCheckoutDetails('demoCustomer');

  await checkoutPage.submitOrder(checkoutDetails.name, checkoutDetails.address);

  await expect(customerPage).toHaveURL(/\/orders(\?.*)?$/);
  await expect(ordersPage.orderNumber).toBeVisible();
  await expect(ordersPage.orderStatus).toContainText(orderStatuses.pending);
});

test('shows validation errors for empty checkout fields @regression', async ({
  customerPage,
}) => {
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);

  await productsPage.addProductToCart(products.classicBurger.name);

  await checkoutPage.open();
  await checkoutPage.submitEmptyForm();

  await expect(customerPage).toHaveURL(/\/checkout$/);
  await expect(checkoutPage.customerNameError).toBeVisible();
  await expect(checkoutPage.deliveryAddressError).toBeVisible();
});
