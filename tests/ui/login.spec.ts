import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('displays the login form @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();

  await expect(loginPage.form).toBeVisible();
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});

test('shows an error for invalid credentials @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('customer@example.com', 'WrongPassword!');

  await expect(loginPage.errorMessage).toHaveText(
    'Invalid email or password',
  );
  await expect(page).toHaveURL(/\/login$/);
});

test('logs in as a broker @smoke', async ({ page }) => {
  const email = process.env.CUSTOMER_EMAIL;
  const password = process.env.CUSTOMER_PASSWORD;

  if (!email || !password) {
    throw new Error('Broker credentials are missing from .env');
  }

  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(email, password);

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByTestId('product-search')).toBeVisible();
});
