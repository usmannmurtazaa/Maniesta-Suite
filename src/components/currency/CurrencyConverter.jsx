// src/components/currency/CurrencyConverter.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchExchangeRates, convertCurrency } from '../../services/currencyService';
import { useDashboard } from '../../contexts/DashboardProvider';
import CurrencySearchDropdown from './CurrencySearchDropdown';

// 150+ currencies (sample – expand to full list)
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  // Add remaining currencies as needed (up to 150+)
];

export default function CurrencyConverter() {
  const { saveCurrency } = useDashboard();
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [copied, setCopied] = useState(false);

  const performConversion = useCallback(async () => {
    if (!amount || isNaN(amount)) return;
    setLoading(true);
    try {
      const converted = await convertCurrency(amount, fromCurrency, toCurrency);
      setResult(converted);
      saveCurrency({
        from: fromCurrency,
        to: toCurrency,
        value: amount,
        result: converted,
        timestamp: Date.now(),
      });
      // Update timestamp from API
      const rates = await fetchExchangeRates(fromCurrency);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, saveCurrency]);

  useEffect(() => {
    const timeout = setTimeout(() => performConversion(), 300);
    return () => clearTimeout(timeout);
  }, [amount, fromCurrency, toCurrency, performConversion]);

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result.toFixed(2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 rounded-2xl max-w-2xl mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">Currency Converter</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Live exchange rates – updated every 24h</p>

      <div className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="input-base w-full"
          />
        </div>

        {/* Currency selection row with swap button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-end">
          <div className="flex-1">
            <CurrencySearchDropdown
              label="From"
              currencies={CURRENCIES}
              value={fromCurrency}
              onChange={setFromCurrency}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="glass w-10 h-10 rounded-full flex items-center justify-center hover:shadow-brand transition-all"
              aria-label="Swap currencies"
            >
              ⇄
            </button>
          </div>
          <div className="flex-1">
            <CurrencySearchDropdown
              label="To"
              currencies={CURRENCIES}
              value={toCurrency}
              onChange={setToCurrency}
            />
          </div>
        </div>
      </div>

      {/* Result section */}
      <div className="mt-6 p-5 bg-brand-500/10 rounded-xl text-center border border-brand-500/20 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 rounded-xl">
            <div className="spinner w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">Converted Amount</p>
        <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1 break-words">
          {result !== null ? `${result.toFixed(2)} ${toCurrency}` : '—'}
        </p>
        {result !== null && (
          <button onClick={copyResult} className="mt-2 text-xs text-brand-500 hover:underline">
            {copied ? '✓ Copied' : '📋 Copy result'}
          </button>
        )}
        {lastUpdated && <p className="text-xs text-gray-400 mt-2">Rates: {lastUpdated.toLocaleTimeString()}</p>}
      </div>
    </motion.div>
  );
}