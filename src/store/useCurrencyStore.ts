import { create } from 'zustand';
import { FALLBACK_CURRENCIES, CurrencyConfig } from '@/lib/currency';

interface CurrencyState {
  currentCurrency: string;
  currencies: CurrencyConfig[];
  rates: Record<string, number>;
  setCurrency: (code: string) => void;
  setCurrencies: (currencies: CurrencyConfig[]) => void;
  convert: (amountXOF: number) => number;
}

const initialRates: Record<string, number> = FALLBACK_CURRENCIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c.rateToXOF }),
  {}
);

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currentCurrency: 'XOF',
  currencies: FALLBACK_CURRENCIES,
  rates: initialRates,

  setCurrency: (code: string) => {
    const upper = code.toUpperCase();
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahugnon_currency', upper);
      document.cookie = `mahugnon_currency=${upper}; path=/; max-age=31536000; SameSite=Lax`;
    }
    set({ currentCurrency: upper });
  },

  setCurrencies: (currencies: CurrencyConfig[]) => {
    const rates = currencies.reduce((acc, c) => ({ ...acc, [c.code]: c.rateToXOF }), {});
    set({ currencies, rates });
  },

  convert: (amountXOF: number) => {
    const { currentCurrency, rates } = get();
    if (currentCurrency === 'XOF' || currentCurrency === 'XAF') {
      return amountXOF;
    }
    const rate = rates[currentCurrency] || 1.0;
    const converted = amountXOF * rate;
    if (['NGN', 'GNF'].includes(currentCurrency)) {
      return Math.round(converted);
    }
    return Math.round(converted * 100) / 100;
  },
}));
