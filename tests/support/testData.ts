export const coverages = {
  commercialProperty: {
    coverageName: 'Commercial Property',
    businessLabel: 'Commercial Property',
    name: 'Commercial Property',
    category: 'Property',
    basePremium: 1299,
    coverageLimit: 1_000_000,
    deductible: 2_500,
    buildingValue: 750_000,
    contentsValue: 250_000,
  },
  generalLiability: {
    coverageName: 'General Liability',
    businessLabel: 'General Liability',
    name: 'General Liability',
    category: 'Liability',
    basePremium: 899,
    liabilityLimit: 2_000_000,
    deductible: 1_000,
  },
  businessOwnersPackage: {
    coverageName: 'Business Owners Package',
    businessLabel: 'Business Owners Package',
    name: 'Business Owners Package',
    category: 'Package',
    basePremium: 1899,
  },
} as const;

export const coverageFilters = {
  liability: 'Liability',
} as const;

export const quoteStatuses = {
  underwritingReview: 'Submitted',
  approvedForBind: 'Approved',
} as const;

export const invalidIds = {
  unknownQuoteId: '00000000-0000-4000-8000-000000000000',
  unknownCoverageId: 'unknown-coverage-id',
} as const;

export const insuredBusinesses = {
  demoBrokerSubmission: {
    businessName: 'Demo Test Manufacturing LLC',
    businessType: 'Manufacturing',
    annualRevenue: 1_250_000,
    numberOfEmployees: 18,
    priorClaims: 0,
    addressPrefix: '123 Demo Street',
  },
  underwritingReviewSubmission: {
    businessName: 'Admin Status Distribution Inc',
    businessType: 'Wholesale Distribution',
    annualRevenue: 2_750_000,
    numberOfEmployees: 42,
    priorClaims: 1,
    addressPrefix: '456 Admin Test Street',
  },
} as const;
