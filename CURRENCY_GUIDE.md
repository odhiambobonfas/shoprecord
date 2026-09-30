# Multi-Currency Support Guide

## Overview
Your ShopRecord application now supports multiple currencies including:
- 💵 **USD** (US Dollar) - Default
- 💶 **EUR** (Euro)
- 🇰🇪 **KSH** (Kenyan Shilling)
- 💷 **GBP** (British Pound)
- 💴 **JPY** (Japanese Yen)
- 💴 **CNY** (Chinese Yuan)
- 💰 **INR** (Indian Rupee)
- 🦘 **AUD** (Australian Dollar)
- 🍁 **CAD** (Canadian Dollar)
- 🇨🇭 **CHF** (Swiss Franc)
- 🇿🇦 **ZAR** (South African Rand)
- 🇳🇬 **NGN** (Nigerian Naira)

## Features

### 1. Currency Selector
- Located in the top navigation bar
- Allows users to switch between currencies in real-time
- Selection is saved to browser localStorage
- Persists across page reloads and sessions

### 2. Automatic Currency Conversion
All prices throughout the application are automatically converted to the selected currency:
- Product prices
- Inventory values
- Sale amounts
- Dashboard statistics

### 3. Proper Currency Formatting
Each currency displays with:
- Correct symbol (€, $, KSh, etc.)
- Proper decimal formatting
- Locale-specific number formatting

## Technical Implementation

### Backend Changes

#### User Model (`User.model.js`)
Added `preferredCurrency` field to store user's currency preference:
```javascript
preferredCurrency: {
  type: String,
  enum: ['USD', 'EUR', 'KSH', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'CHF', 'ZAR', 'NGN'],
  default: 'USD',
}
```

### Frontend Changes

#### 1. Currency Constants (`constants.utils.js`)
- `CURRENCIES`: Array of all supported currencies with locale info
- `DEFAULT_CURRENCY`: Default currency (USD)
- `CURRENCY_RATES`: Exchange rates (base: USD)
- `CURRENCY_STORAGE_KEY`: LocalStorage key for saving preference

#### 2. Currency Context (`CurrencyContext.context.jsx`)
Provides global currency state and methods:
- `currency`: Current selected currency code
- `changeCurrency(code)`: Change the active currency
- `convertAmount(amount, toCurrency)`: Convert from USD to target currency
- `convertToUSD(amount, fromCurrency)`: Convert to USD
- `formatAmount(amount, currency)`: Format amount with currency symbol
- `getCurrencyInfo(code)`: Get currency details
- `currencies`: List of all available currencies

#### 3. Currency Selector Component (`CurrencySelector.ui.jsx`)
Dropdown component to select currency:
- Displays all available currencies
- Shows currency symbol, code, and name
- Auto-saves selection to localStorage
- Styled with hover and focus states

#### 4. Updated Helper Functions (`helpers.utils.js`)
Enhanced currency utilities:
- `formatCurrency(amount, currencyCode)`: Multi-currency formatting
- `convertCurrency(amountInUSD, toCurrency)`: Currency conversion
- `convertToUSD(amount, fromCurrency)`: Reverse conversion

## Usage Examples

### Using the Currency Context

```javascript
import { useCurrency } from '@/context/CurrencyContext.context';

function MyComponent() {
  const { formatAmount, currency, changeCurrency } = useCurrency();
  
  return (
    <div>
      <p>Current: {currency}</p>
      <p>Price: {formatAmount(100)}</p>
      <button onClick={() => changeCurrency('EUR')}>
        Switch to EUR
      </button>
    </div>
  );
}
```

### Formatting Prices

```javascript
import { useCurrency } from '@/context/CurrencyContext.context';

function ProductCard({ product }) {
  const { formatAmount } = useCurrency();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Price: {formatAmount(product.price)}</p>
    </div>
  );
}
```

### Converting Currencies

```javascript
import { useCurrency } from '@/context/CurrencyContext.context';

function PriceConverter() {
  const { convertAmount, convertToUSD } = useCurrency();
  
  const priceInUSD = 100;
  const priceInEUR = convertAmount(priceInUSD, 'EUR');
  const backToUSD = convertToUSD(priceInEUR, 'EUR');
  
  return (
    <div>
      <p>USD: ${priceInUSD}</p>
      <p>EUR: €{priceInEUR.toFixed(2)}</p>
    </div>
  );
}
```

## Important Notes

### Exchange Rates
⚠️ **Note**: The current implementation uses static exchange rates defined in `constants.utils.js`. 

For production use, you should:
1. Integrate a real-time currency API (e.g., exchangerate-api.com, fixer.io)
2. Update rates periodically (e.g., daily)
3. Cache rates for performance

Example API integration:
```javascript
async function fetchExchangeRates() {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await response.json();
  return data.rates;
}
```

### Database Storage
All prices are stored in USD in the database. Conversion happens on the frontend in real-time based on the user's selected currency. This ensures:
- Consistent data storage
- Easy currency switching
- Simplified backend logic

### Adding New Currencies

To add a new currency:

1. Update `CURRENCIES` array in `constants.utils.js`:
```javascript
{ code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' }
```

2. Add exchange rate to `CURRENCY_RATES`:
```javascript
BRL: 5.12
```

3. Update User model enum in `User.model.js`:
```javascript
enum: ['USD', 'EUR', 'KSH', ..., 'BRL']
```

## Testing

### Test Currency Switching
1. Open the application
2. Click the currency selector in the navbar
3. Select different currencies
4. Verify all prices update correctly
5. Refresh the page - selection should persist

### Test Currency Formatting
- Check that each currency displays correct symbol
- Verify decimal places (2 for most, 0 for JPY)
- Confirm locale-specific thousand separators

### Test Conversion Accuracy
- Switch to different currencies
- Verify conversions match expected rates
- Check that values are consistent across components

## Troubleshooting

### Currency not persisting
- Check browser localStorage
- Ensure CurrencyProvider wraps the app
- Verify localStorage key matches CURRENCY_STORAGE_KEY

### Incorrect formatting
- Check currency locale configuration
- Verify browser supports Intl.NumberFormat
- Fallback styling should appear for unsupported currencies

### Components not updating
- Ensure components use `useCurrency()` hook
- Verify CurrencyProvider is in layout hierarchy
- Check that components re-render on currency change

## Future Enhancements

1. **API Integration**: Connect to real-time exchange rate API
2. **Rate Caching**: Cache rates with TTL for performance
3. **Historical Rates**: Track historical exchange rates
4. **Multi-Currency Transactions**: Allow transactions in different currencies
5. **Currency Preferences per User**: Save to database instead of localStorage
6. **Cryptocurrency Support**: Add BTC, ETH, etc.
7. **Auto-detect Currency**: Based on user's location/IP
8. **Currency Comparison**: Show prices in multiple currencies simultaneously

## Support

For issues or questions:
1. Check this documentation
2. Review the implementation in source files
3. Test with browser DevTools
4. Check console for errors

---

**Last Updated**: February 2026  
**Version**: 1.0.0
