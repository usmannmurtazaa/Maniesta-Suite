// src/components/currency/CurrencyConverter.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchExchangeRates, convertCurrency } from '../../services/currencyService';
import { useDashboard } from '../../contexts/DashboardProvider';
import CurrencySearchDropdown from './CurrencySearchDropdown';

/* ── SVG Icons (replace emojis / ⇄) ────────────────────────────────── */
const CopyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SwapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);

/* ── Reduced‑motion hook ──────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

// 150+ currencies (flags removed – replaced by SVG/icons in dropdown if needed)
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'ZAR', name: 'South African Rand' },
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
  const reducedMotion = usePrefersReducedMotion();

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

  // Container animation – disabled if reduced motion
  const containerProps = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className="glass-card p-6 md:p-8 rounded-2xl max-w-2xl mx-auto"
      {...containerProps}
    >
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient mb-2">Currency Converter</h2>
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
              type="button"
              onClick={swapCurrencies}
              className="glass w-10 h-10 rounded-full flex items-center justify-center hover:shadow-brand transition-all"
              aria-label="Swap currencies"
            >
              <SwapIcon />
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
          <button
            type="button"
            onClick={copyResult}
            className="mt-2 text-xs text-brand-500 hover:underline inline-flex items-center gap-1"
          >
            {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy result</>}
          </button>
        )}
        {lastUpdated && <p className="text-xs text-gray-400 mt-2">Rates: {lastUpdated.toLocaleTimeString()}</p>}
      </div>
    </motion.div>
  );
}