import type { Locator, Page } from '@playwright/test';

export class UnderwritingDashboardPage {
  readonly page: Page;
  readonly quoteRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quoteRows = page.getByTestId('admin-order-row');
  }

  quoteRow(quoteId: string): Locator {
    return this.quoteRows.filter({ hasText: quoteId });
  }

  statusSelect(quoteId: string): Locator {
    return this.quoteRow(quoteId).getByRole('combobox');
  }

  async updateStatus(quoteId: string, status: string): Promise<void> {
    await this.statusSelect(quoteId).selectOption({ label: status });
  }
}
