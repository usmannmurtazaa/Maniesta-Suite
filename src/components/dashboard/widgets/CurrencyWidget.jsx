import { Link } from "react-router-dom";
import { CurrencyIcon } from '../../icons';

export default function CurrencyWidget({ lastCurrency }) {
  if (!lastCurrency) {
    return (
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-lg mb-2 flex items-center gap-2">
          <CurrencyIcon className="w-5 h-5 text-brand-500" />
          Last Conversion
        </h3>
        <p className="text-gray-500">No currency conversions yet.</p>
        <Link
          to="/currencyconverter"
          className="text-brand-500 text-sm mt-2 inline-block hover:underline"
        >
          Convert now →
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-lg mb-2 flex items-center gap-2">
        <CurrencyIcon className="w-5 h-5 text-brand-500" />
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
        className="text-brand-500 text-sm mt-2 inline-block hover:underline"
      >
        New conversion →
      </Link>
    </div>
  );
}