// contexts/CurrencyContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Relative to base currency (KES)
}

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number) => number;
  formatCurrency: (amount: number) => string;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Available currencies with exchange rates (example rates)
const CURRENCIES: Currency[] = [
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', exchangeRate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 0.0078 },
  { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.0072 },
  { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.0062 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', exchangeRate: 0.15 },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', exchangeRate: 28.5 },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', exchangeRate: 20.1 },
];

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    // Get saved currency from localStorage or default to KES
    const saved = localStorage.getItem('preferredCurrency');
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('preferredCurrency', JSON.stringify(currency));
  };

  const convertAmount = (amount: number): number => {
    return amount * currentCurrency.exchangeRate;
  };

  const formatCurrency = (amount: number): string => {
    const convertedAmount = convertAmount(amount);
    
    if (currentCurrency.code === 'KES') {
      return `${currentCurrency.symbol} ${convertedAmount.toLocaleString()}`;
    }
    
    // For other currencies, show 2 decimal places
    return `${currentCurrency.symbol} ${convertedAmount.toFixed(2)}`;
  };

  const value = {
    currentCurrency,
    setCurrency,
    convertAmount,
    formatCurrency,
    availableCurrencies: CURRENCIES,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};