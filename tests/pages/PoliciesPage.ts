import type { Locator, Page } from '@playwright/test';

export class PoliciesPage {
  readonly page: Page;
  readonly confirmationBanner: Locator;
  readonly quoteId: Locator;
  readonly quoteStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmationBanner = page.getByRole('status');
    this.quoteId = this.confirmationBanner.getByTestId('quote-number');
    this.quoteStatus = this.confirmationBanner.getByTestId('quote-status');
  }
}
