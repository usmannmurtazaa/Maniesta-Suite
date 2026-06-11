// src/components/dashboard/widgets/CurrencyWidget.jsx
import { Link } from "react-router-dom";

// Inline SVG – replaces 💱
const CurrencyIcon = () => (
  <svg
    className="w-5 h-5 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182" />
    <path d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182" />
  </svg>
);

export default function CurrencyWidget({ lastCurrency }) {
  if (!lastCurrency) {
    return (
      <div className="glass-card p-5">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <CurrencyIcon />
          Last Conversion
        </h3>
        <p className="text-gray-500">No currency conversions yet.</p>
        <Link
          to="/currencyconverter"
          className="text-brand-500 text-sm mt-2 inline-block"
        >
          Convert now →
        </Link>
      </div>
    );
  }
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <CurrencyIcon />
        Last Conversion
      </h3>
      <p className="text-2xl font-bold">
        {lastCurrency.value} {lastCurrency.from} ={" "}
        {lastCurrency.result.toFixed(2)} {lastCurrency.to}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(lastCurrency.timestamp).toLocaleString()}
      </p>
      <Link
        to="/currencyconverter"
        className="text-brand-500 text-sm mt-2 inline-block"
      >
        New conversion →
      </Link>
    </div>
  );
}
