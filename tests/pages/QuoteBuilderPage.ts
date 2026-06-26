import type { Locator, Page } from '@playwright/test';

export class QuoteBuilderPage {
  readonly page: Page;
  readonly quoteBuilderCount: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quoteBuilderCount = page.getByTestId('quote-builder-count');
    this.emptyState = page.getByTestId('quote-builder-empty-state');
  }

  async open(): Promise<void> {
    await this.page.goto('/quote-builder');
  }

  coverageName(coverageName: string): Locator {
    return this.page.getByText(coverageName, { exact: true });
  }
}
