'use client';

import { useCurrency as useCurrencyContext } from '../context/CurrencyContext.context';

/**
 * Custom hook for currency operations
 * Provides easy access to currency formatting and conversion
 */
export function useCurrency() {
  return useCurrencyContext();
}
