import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Chevron SVG (replaces ▼) ──────────────────────────────────────── */
const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function CurrencySearchDropdown({ label, currencies, value, onChange }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selected = currencies.find(c => c.code === value);
  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow the input to render
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIndex(-1);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  const handleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  const handleSelect = useCallback((code) => {
    onChange(code);
    setIsOpen(false);
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          handleSelect(filtered[activeIndex].code);
        }
        break;
    }
  }, [isOpen, filtered, activeIndex, handleSelect]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className="glass w-full px-4 py-2.5 rounded-xl text-left flex justify-between items-center"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {selected ? `${selected.code} – ${selected.name}` : 'Select currency'}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 mt-1 w-full glass rounded-xl shadow-lg border border-white/20 max-h-60 overflow-y-auto"
          role="listbox"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search currency..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="input-base sticky top-0 bg-white/80 dark:bg-gray-800/80 mb-1"
            aria-label="Search currency"
          />
          <div ref={listRef}>
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
            ) : (
              filtered.map((currency, idx) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelect(currency.code)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    idx === activeIndex ? 'bg-white/10 dark:bg-white/5' : 'hover:bg-white/10'
                  }`}
                  role="option"
                  aria-selected={value === currency.code}
                >
                  {currency.code} – {currency.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}