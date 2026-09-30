'use client';

import { useCurrency } from '../../context/CurrencyContext.context.jsx';

export default function CurrencySelector({ className = '' }) {
  const { currency, changeCurrency, currencies, getCurrencyInfo } = useCurrency();
  const currentCurrency = getCurrencyInfo();

  return (
    <div className={`currency-selector ${className}`}>
      <label htmlFor="currency-select" className="sr-only">
        Select Currency
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => changeCurrency(e.target.value)}
        className="currency-select"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code} - {curr.name}
          </option>
        ))}
      </select>
      
      <style jsx>{`
        .currency-selector {
          display: inline-block;
        }
        
        .currency-select {
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background-color: white;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          cursor: pointer;
          transition: all 0.2s;
          appearance: none;
        }
        
        .currency-select:hover {
          border-color: #9ca3af;
        }
        
        .currency-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        @media (prefers-color-scheme: dark) {
          .currency-select {
            background-color: #1f2937;
            border-color: #374151;
            color: #f9fafb;
          }
          
          .currency-select:hover {
            border-color: #4b5563;
          }
        }
      `}</style>
    </div>
  );
}
