// API Base URL
export const API_URL = process.env.API_URL || 'http://localhost:8000/api';
export const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    DETAIL: (id) => `/products/${id}`,
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Toys & Games',
  'Automotive',
  'Other',
];

// Pagination
export const ITEMS_PER_PAGE = 10;

// Toast/Alert Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Currencies
export const CURRENCIES = [
  { code: 'KSH', name: 'Kenyan Shilling', symbol: 'KSh', locale: 'en-KE' },
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', locale: 'en-NG' },
];

// Default currency
export const DEFAULT_CURRENCY = 'KSH';

// Currency conversion rates (base: USD)
// Note: In production, these should be fetched from a real-time API
export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  KSH: 129.50,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  INR: 83.12,
  AUD: 1.52,
  CAD: 1.35,
  CHF: 0.88,
  ZAR: 18.75,
  NGN: 1550.00,
};

// Storage key for currency preference
export const CURRENCY_STORAGE_KEY = 'preferred_currency';
