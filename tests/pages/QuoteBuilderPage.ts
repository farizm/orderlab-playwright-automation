import type { Locator, Page } from '@playwright/test';

export class QuoteBuilderPage {
  readonly page: Page;
  readonly quoteBuilderCount: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quoteBuilderCount = page.getByTestId('cart-count');
    this.emptyState = page.getByTestId('cart-empty-state');
  }

  async open(): Promise<void> {
    await this.page.goto('/cart');
  }

  coverageName(coverageName: string): Locator {
    return this.page.getByText(coverageName, { exact: true });
  }
}
