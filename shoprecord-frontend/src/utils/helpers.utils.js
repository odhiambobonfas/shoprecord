import { CURRENCIES, CURRENCY_RATES, DEFAULT_CURRENCY, BASE_URL } from './constants.utils';

// Format currency with multi-currency support
export const formatCurrency = (amount, currencyCode = DEFAULT_CURRENCY) => {
  const currencyInfo = CURRENCIES.find(c => c.code === currencyCode);
  
  if (!currencyInfo) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KSH',
    }).format(amount);
  }

  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for currencies not supported by Intl
    return `${currencyInfo.symbol} ${amount.toFixed(2)}`;
  }
};

// Convert currency from USD to target currency
export const convertCurrency = (amountInUSD, toCurrency = DEFAULT_CURRENCY) => {
  const rate = CURRENCY_RATES[toCurrency] || 1;
  return amountInUSD * rate;
};

// Convert currency from source to USD
export const convertToUSD = (amount, fromCurrency = DEFAULT_CURRENCY) => {
  const rate = CURRENCY_RATES[fromCurrency] || 1;
  return amount / rate;
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate total inventory value
export const calculateTotalValue = (products) => {
  if (!products || products.length === 0) return 0;
  return products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
};

// Filter products by search term
export const filterProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term) ||
    product.category?.toLowerCase().includes(term)
  );
};

// Sort products
export const sortProducts = (products, sortBy = 'name', order = 'asc') => {
  const sorted = [...products].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Paginate array
export const paginate = (items, page, perPage) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return items.slice(startIndex, endIndex);
};

// Calculate pagination info
export const getPaginationInfo = (totalItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Get full URL for profile picture
export const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) return null;
  if (profilePicture.startsWith('http')) return profilePicture;
  return `${BASE_URL}/${profilePicture}`;
};

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
