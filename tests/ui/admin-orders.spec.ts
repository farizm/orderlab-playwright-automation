import { expect, test } from '../fixtures';
import { AdminOrdersPage } from '../pages/AdminOrdersPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductsPage } from '../pages/ProductsPage';

test('admin updates a created order status @smoke', async ({
  adminPage,
  customerPage,
}) => {
  const productsPage = new ProductsPage(customerPage);
  const checkoutPage = new CheckoutPage(customerPage);
  const ordersPage = new OrdersPage(customerPage);

  await productsPage.addProductToCart('Classic Burger');
  await checkoutPage.open();
  await checkoutPage.submitOrder(
    'Admin Status Test Customer',
    `456 Admin Test Street ${Date.now()}`,
  );

  const orderId = (await ordersPage.orderNumber.textContent())?.trim();

  if (!orderId) {
    throw new Error('Order confirmation did not include an order ID');
  }

  const adminOrdersPage = new AdminOrdersPage(adminPage);

  await adminPage.reload();
  await expect(adminOrdersPage.orderRow(orderId)).toBeVisible();

  await adminOrdersPage.updateStatus(orderId, 'Preparing');
  await expect(adminOrdersPage.statusSelect(orderId)).toHaveValue(/preparing/i);

  await adminPage.reload();

  await expect(adminOrdersPage.orderRow(orderId)).toBeVisible();
  await expect(adminOrdersPage.statusSelect(orderId)).toHaveValue(/preparing/i);
});
