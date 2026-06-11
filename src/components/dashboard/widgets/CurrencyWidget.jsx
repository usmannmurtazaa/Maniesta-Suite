// src/components/dashboard/widgets/CurrencyWidget.jsx
import { Link } from 'react-router-dom';

export default function CurrencyWidget({ lastCurrency }) {
  if (!lastCurrency) {
    return (
      <div className="glass-card p-5">
        <h3 className="font-semibold text-lg mb-2">💱 Last Conversion</h3>
        <p className="text-gray-500">No currency conversions yet.</p>
        <Link to="/currency-converter" className="text-brand-500 text-sm mt-2 inline-block">Convert now →</Link>
      </div>
    );
  }
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-2">💱 Last Conversion</h3>
      <p className="text-2xl font-bold">
        {lastCurrency.value} {lastCurrency.from} = {lastCurrency.result.toFixed(2)} {lastCurrency.to}
      </p>
      <p className="text-xs text-gray-400 mt-1">{new Date(lastCurrency.timestamp).toLocaleString()}</p>
      <Link to="/currency-converter" className="text-brand-500 text-sm mt-2 inline-block">New conversion →</Link>
    </div>
  );
}