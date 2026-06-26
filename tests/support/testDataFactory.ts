import { insuredBusinesses } from './testData';

export function createQuoteCoverageItem(coverageId: string, quantity = 1) {
  return {
    product_id: coverageId,
    quantity,
  };
}

export function createCommercialPropertyQuoteItems(coverageId: string) {
  return [createQuoteCoverageItem(coverageId, 2)];
}

export function createApplicationDetails(
  insuredBusiness: keyof typeof insuredBusinesses,
) {
  const business = insuredBusinesses[insuredBusiness];

  return {
    businessName: business.businessName,
    businessType: business.businessType,
    businessAddress: `${business.addressPrefix} ${Date.now()}`,
    annualRevenue: business.annualRevenue,
    numberOfEmployees: business.numberOfEmployees,
    priorClaims: business.priorClaims,
  };
}

export const invalidQuotePayloads = {
  emptyItems: [],
  zeroQuantity: (coverageId: string) => [
    createQuoteCoverageItem(coverageId, 0),
  ],
} as const;
