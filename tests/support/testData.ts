export const coverages = {
  commercialProperty: {
    coverageName: 'Classic Burger',
    businessLabel: 'Commercial Property',
    name: 'Classic Burger',
    category: 'Burgers',
    price: 12.99,
    coverageLimit: 1_000_000,
    deductible: 2_500,
    buildingValue: 750_000,
    contentsValue: 250_000,
  },
  generalLiability: {
    coverageName: 'Margherita Pizza',
    businessLabel: 'General Liability',
    name: 'Margherita Pizza',
    liabilityLimit: 2_000_000,
  },
  businessOwnersPackage: {
    coverageName: 'Veggie Pizza',
    businessLabel: 'Business Owners Package',
    name: 'Veggie Pizza',
  },
} as const;

export const coverageFilters = {
  pizza: 'Pizza',
} as const;

export const quoteStatuses = {
  underwritingReview: 'Pending',
  approvedForBind: 'Preparing',
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
