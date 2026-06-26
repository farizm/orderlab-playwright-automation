import type { Locator, Page } from '@playwright/test';

export class ApplicationSubmitPage {
  readonly page: Page;
  readonly businessNameInput: Locator;
  readonly businessAddressInput: Locator;
  readonly annualRevenueInput: Locator;
  readonly numberOfEmployeesInput: Locator;
  readonly priorClaimsInput: Locator;
  readonly submitButton: Locator;
  readonly validationAlerts: Locator;
  readonly businessNameError: Locator;
  readonly businessAddressError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.businessNameInput = page.getByLabel(/Business name/i);
    this.businessAddressInput = page.getByLabel(/Business address/i);
    this.annualRevenueInput = page.getByLabel(/Annual revenue/i);
    this.numberOfEmployeesInput = page.getByLabel(/Number of employees/i);
    this.priorClaimsInput = page.getByLabel(/Prior claims/i);
    this.submitButton = page.getByTestId('application-submit');
    this.validationAlerts = page.getByRole('alert');
    this.businessNameError = this.validationAlerts.filter({ hasText: /name/i });
    this.businessAddressError = this.validationAlerts.filter({
      hasText: /address/i,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/application');
  }

  async submitApplication(
    businessName: string,
    businessAddress: string,
    annualRevenue: number,
    numberOfEmployees: number,
    priorClaims: number,
  ): Promise<void> {
    await this.businessNameInput.fill(businessName);
    await this.businessAddressInput.fill(businessAddress);
    await this.annualRevenueInput.fill(String(annualRevenue));
    await this.numberOfEmployeesInput.fill(String(numberOfEmployees));
    await this.priorClaimsInput.fill(String(priorClaims));
    await this.submitButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.submitButton.click();
  }
}
