// Supported Currencies Configuration & Formatting Helpers

export const SUPPORTED_CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar ($)',
    flag: '🇺🇸',
    rateToUSD: 1.0,
    decimals: 2,
    placeholderMonthlyIncome: 4500
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    label: 'Singapore Dollar (S$)',
    flag: '🇸🇬',
    rateToUSD: 0.74, // 1 SGD = ~0.74 USD
    decimals: 2,
    placeholderMonthlyIncome: 5500
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    label: 'Indonesian Rupiah (Rp)',
    flag: '🇮🇩',
    rateToUSD: 0.000062, // 1 IDR = ~0.000062 USD
    decimals: 0,
    placeholderMonthlyIncome: 15000000
  }
};

/**
 * Format raw number amount into locale currency string
 */
export function formatCurrency(amount, currencyCode = 'IDR') {
  const curr = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.IDR;
  const num = Number(amount) || 0;

  if (curr.code === 'IDR') {
    return `Rp ${Math.round(num).toLocaleString('id-ID')}`;
  } else if (curr.code === 'SGD') {
    return `S$ ${num.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Convert an amount from one currency to target currency
 */
export function convertCurrency(amount, fromCode = 'USD', toCode = 'IDR') {
  const fromCurr = SUPPORTED_CURRENCIES[fromCode] || SUPPORTED_CURRENCIES.USD;
  const toCurr = SUPPORTED_CURRENCIES[toCode] || SUPPORTED_CURRENCIES.IDR;
  
  if (fromCode === toCode) return Number(amount) || 0;

  // Convert to USD baseline then to target currency
  const amountInUSD = Number(amount) * fromCurr.rateToUSD;
  const converted = amountInUSD / toCurr.rateToUSD;
  return toCurr.decimals === 0 ? Math.round(converted) : Number(converted.toFixed(2));
}
