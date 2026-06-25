export const products = {
  classicBurger: {
    name: 'Classic Burger',
    category: 'Burgers',
    price: 12.99,
  },
  margheritaPizza: {
    name: 'Margherita Pizza',
  },
  veggiePizza: {
    name: 'Veggie Pizza',
  },
} as const;

export const productFilters = {
  pizza: 'Pizza',
} as const;

export const orderStatuses = {
  pending: 'Pending',
  preparing: 'Preparing',
} as const;

export const invalidIds = {
  unknownOrderId: '00000000-0000-4000-8000-000000000000',
  unknownProductId: 'unknown-product-id',
} as const;

export const checkoutCustomers = {
  demoCustomer: {
    name: 'Demo Test Customer',
    addressPrefix: '123 Demo Street',
  },
  adminStatusCustomer: {
    name: 'Admin Status Test Customer',
    addressPrefix: '456 Admin Test Street',
  },
} as const;
