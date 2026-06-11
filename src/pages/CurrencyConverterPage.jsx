// src/pages/CurrencyConverter.jsx
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

// List of major currencies with emoji flags and display names
const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
];

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch exchange rates (with localStorage caching)
  const fetchRates = useCallback(async () => {
    // Check cache first
    const cached = localStorage.getItem("currency_rates");
    if (cached) {
      try {
        const { rates: cachedRates, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRates(cachedRates);
          setLastUpdated(new Date(timestamp));
          setError(null);
          return;
        }
      } catch (e) {
        // ignore cache parse error
      }
    }

    setLoading(true);
    setError(null);
    try {
      // Using free exchangerate-api.com (no API key required)
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
      );
      if (!response.ok) throw new Error("Failed to fetch exchange rates");
      const data = await response.json();
      const newRates = data.rates;
      setRates(newRates);
      const now = Date.now();
      setLastUpdated(new Date(now));
      localStorage.setItem(
        "currency_rates",
        JSON.stringify({ rates: newRates, timestamp: now }),
      );
    } catch (err) {
      console.error(err);
      setError("Unable to fetch live exchange rates. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Compute conversion whenever amount, currencies, or rates change
  useEffect(() => {
    if (rates && amount !== null && !isNaN(amount) && amount !== "") {
      const rateFrom = rates[fromCurrency];
      const rateTo = rates[toCurrency];
      if (rateFrom && rateTo) {
        const converted = (amount / rateFrom) * rateTo;
        setResult(converted);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : parseFloat(value));
  };

  return (
    <>
      <SEO
        title="Currency Converter"
        description="Convert world currencies instantly with live exchange rates. Free, fast and accurate currency converter tool for students and travellers."
        keywords={[
          "currency converter",
          "exchange rates",
          "USD to EUR",
          "live rates",
          "money converter",
        ]}
        canonicalUrl="https://maniestasuite.netlify.app/currencyconverter"
      />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2 text-center">
            Currency Converter
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Live exchange rates – convert any major currency instantly
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm text-center">
              ⚠️ {error}
              <button
                onClick={fetchRates}
                className="ml-3 underline hover:no-underline font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {loading && !rates && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {rates && (
            <div className="space-y-6">
              {/* Amount input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="input-base w-full text-lg"
                  placeholder="Enter amount"
                  step="any"
                />
              </div>

              {/* From / To row with swap button */}
              <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="input-base w-full appearance-none bg-no-repeat bg-[center_right_1rem]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    }}
                  >
                    {currencies.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.flag} {cur.code} – {cur.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center pb-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwap}
                    className="glass w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all hover:shadow-brand"
                    aria-label="Swap currencies"
                  >
                    ⇄
                  </motion.button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="input-base w-full appearance-none bg-no-repeat bg-[center_right_1rem]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    }}
                  >
                    {currencies.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.flag} {cur.code} – {cur.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result display */}
              <div className="mt-6 p-6 text-center bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Converted Amount
                </p>
                {result !== null && !isNaN(result) ? (
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                    {result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {toCurrency}
                  </p>
                ) : (
                  <p className="text-xl text-gray-500 mt-2">—</p>
                )}
              </div>

              {/* Last updated */}
              {lastUpdated && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  Exchange rates updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Back to home link */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <a
              href="/"
              className="btn-secondary inline-flex items-center gap-2"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
