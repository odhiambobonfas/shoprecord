'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, DEFAULT_CURRENCY, CURRENCY_STORAGE_KEY, CURRENCY_RATES } from '../utils/constants.utils';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    
    // If saved currency is EUR or USD, reset to KSH (new default)
    if (savedCurrency === 'EUR' || savedCurrency === 'USD') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, 'KSH');
      setCurrency('KSH');
    } else if (savedCurrency && CURRENCIES.find(c => c.code === savedCurrency)) {
      setCurrency(savedCurrency);
    }
    setIsLoading(false);
  }, []);

  // Save currency preference to localStorage when it changes
  const changeCurrency = (newCurrency) => {
    if (CURRENCIES.find(c => c.code === newCurrency)) {
      setCurrency(newCurrency);
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
    }
  };

  // Convert amount from USD to selected currency
  const convertAmount = (amountInUSD, toCurrency = currency) => {
    const rate = CURRENCY_RATES[toCurrency] || 1;
    return amountInUSD * rate;
  };

  // Convert amount from selected currency to USD
  const convertToUSD = (amount, fromCurrency = currency) => {
    const rate = CURRENCY_RATES[fromCurrency] || 1;
    return amount / rate;
  };

  // Format amount in selected currency
  const formatAmount = (amount, currencyCode = currency) => {
    const currencyInfo = CURRENCIES.find(c => c.code === currencyCode);
    
    if (!currencyInfo) {
      return `${amount.toFixed(2)}`;
    }

    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currencies
      return `${currencyInfo.symbol} ${amount.toFixed(2)}`;
    }
  };

  // Get currency info
  const getCurrencyInfo = (currencyCode = currency) => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  };

  const value = {
    currency,
    changeCurrency,
    convertAmount,
    convertToUSD,
    formatAmount,
    getCurrencyInfo,
    currencies: CURRENCIES,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
