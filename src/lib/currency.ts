export const CURRENCIES = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        flag: '🇺🇸'
    },
    INR: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
        flag: '🇮🇳'
    }
} as const;

export const DEFAULT_CURRENCY = 'USD';

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_OPTIONS = Object.values(CURRENCIES);

export function formatCurrency(amount: number, currency: string): string {
    const currencyInfo = CURRENCIES[currency as CurrencyCode];
    if (!currencyInfo) {
        return `${amount.toFixed(2)} ${currency}`;
    }

    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
}

export function getCurrencySymbol(currency: string): string {
    const currencyInfo = CURRENCIES[currency as CurrencyCode];
    return currencyInfo?.symbol || currency;
}

export function getCurrencyName(currency: string): string {
    const currencyInfo = CURRENCIES[currency as CurrencyCode];
    return currencyInfo?.name || currency;
}

// Simple conversion rates (in a real app, you'd fetch these from an API)
export const CONVERSION_RATES = {
    USD: { USD: 1, INR: 83.5 },
    INR: { USD: 0.012, INR: 1 }
} as const;

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;

    const rates = CONVERSION_RATES[fromCurrency as CurrencyCode];
    if (!rates) return amount;

    const rate = rates[toCurrency as CurrencyCode];
    if (!rate) return amount;

    return amount * rate;
}
