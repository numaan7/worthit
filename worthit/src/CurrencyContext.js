import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

// Supported currencies with their symbols and codes
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
];

export const CurrencyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currency, setCurrencyState] = useState('USD');
  const [loading, setLoading] = useState(true);

  // Load currency preference from Firestore
  useEffect(() => {
    const loadCurrency = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'userSettings', currentUser.uid));
        if (userDoc.exists() && userDoc.data().currency) {
          setCurrencyState(userDoc.data().currency);
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      }
      setLoading(false);
    };

    loadCurrency();
  }, [currentUser]);

  // Save currency preference to Firestore
  const setCurrency = async (newCurrency) => {
    setCurrencyState(newCurrency);
    
    if (currentUser) {
      try {
        await setDoc(
          doc(db, 'userSettings', currentUser.uid),
          { currency: newCurrency, updatedAt: new Date() },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving currency preference:', error);
      }
    }
  };

  // Format currency helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const value = {
    currency,
    setCurrency,
    formatCurrency,
    currencies: CURRENCIES,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
