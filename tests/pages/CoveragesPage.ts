import type { Locator, Page } from '@playwright/test';

export class CoveragesPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly coverageCards: Locator;
  readonly emptyState: Locator;
  readonly quoteBuilderCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('product-search');
    this.categoryFilter = page.getByLabel('Filter by category');
    this.coverageCards = page.getByTestId('product-card');
    this.emptyState = page.getByTestId('product-empty-state');
    this.quoteBuilderCount = page.getByTestId('cart-count');
  }

  coverageCard(coverageName: string): Locator {
    return this.coverageCards.filter({ hasText: coverageName });
  }

  async searchFor(text: string): Promise<void> {
    await this.searchInput.fill(text);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption({ label: category });
  }

  async addCoverageToQuoteBuilder(coverageName: string): Promise<void> {
    await this.page
      .getByRole('button', { name: `Add ${coverageName} to cart` })
      .click();
  }
}
