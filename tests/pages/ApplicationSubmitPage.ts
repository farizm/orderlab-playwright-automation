import type { Locator, Page } from '@playwright/test';

export class ApplicationSubmitPage {
  readonly page: Page;
  readonly businessNameInput: Locator;
  readonly businessAddressInput: Locator;
  readonly submitButton: Locator;
  readonly validationAlerts: Locator;
  readonly businessNameError: Locator;
  readonly businessAddressError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.businessNameInput = page.getByLabel('Customer name');
    this.businessAddressInput = page.getByLabel('Delivery address');
    this.submitButton = page.getByTestId('checkout-submit');
    this.validationAlerts = page.getByRole('alert');
    this.businessNameError = this.validationAlerts.filter({ hasText: /name/i });
    this.businessAddressError = this.validationAlerts.filter({
      hasText: /address/i,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async submitApplication(
    businessName: string,
    businessAddress: string,
  ): Promise<void> {
    await this.businessNameInput.fill(businessName);
    await this.businessAddressInput.fill(businessAddress);
    await this.submitButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.submitButton.click();
  }
}
