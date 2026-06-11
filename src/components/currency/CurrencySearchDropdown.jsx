// src/components/currency/CurrencySearchDropdown.jsx
import { useState, useRef, useEffect } from 'react';

export default function CurrencySearchDropdown({ label, currencies, value, onChange }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = currencies.find(c => c.code === value);
  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass w-full px-4 py-2.5 rounded-xl text-left flex justify-between items-center"
      >
        <span>{selected?.flag} {selected?.code} – {selected?.name}</span>
        <span className="text-gray-400">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full glass rounded-xl shadow-lg border border-white/20 max-h-60 overflow-y-auto">
          <input
            type="text"
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base sticky top-0 bg-white/80 dark:bg-gray-800/80 mb-1"
          />
          {filtered.map(currency => (
            <button
              key={currency.code}
              onClick={() => { onChange(currency.code); setIsOpen(false); setSearch(''); }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors"
            >
              {currency.flag} {currency.code} – {currency.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}