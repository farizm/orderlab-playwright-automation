import { expect, test as base, type Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { requiredEnv } from './support/env';

type AuthFixtures = {
  brokerPage: Page;
  underwriterPage: Page;
};

async function loginAsBroker(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(
    requiredEnv('CUSTOMER_EMAIL'),
    requiredEnv('CUSTOMER_PASSWORD'),
  );
  await expect(page).toHaveURL(/\/products$/);
}

async function loginAsAdmin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(requiredEnv('ADMIN_EMAIL'), requiredEnv('ADMIN_PASSWORD'));
  await expect(page).toHaveURL(/\/admin\/orders$/);
}

export const test = base.extend<AuthFixtures>({
  brokerPage: async ({ page }, use) => {
    await loginAsBroker(page);
    await use(page);
  },

  underwriterPage: async ({ browser }, use) => {
    const baseURL = requiredEnv('BASE_URL');
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    try {
      await loginAsAdmin(page);
      await use(page);
    } finally {
      await context.close();
    }
  },
});

export { expect };
