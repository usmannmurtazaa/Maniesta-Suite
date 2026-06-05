import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const converters = {
  length: {
    label: 'Length', icon: '📏',
    units: ['Meter', 'Kilometer', 'Mile', 'Foot'],
    rate: { Meter: 1, Kilometer: 0.001, Mile: 0.000621371, Foot: 3.28084 },
  },
  weight: {
    label: 'Weight', icon: '⚖️',
    units: ['Kilogram', 'Gram', 'Pound', 'Ounce'],
    rate: { Kilogram: 1, Gram: 1000, Pound: 2.20462, Ounce: 35.274 },
  },
  temperature: {
    label: 'Temperature', icon: '🌡️',
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    special: true,
  },
  area: {
    label: 'Area', icon: '📐',
    units: ['Sq Meter', 'Sq Kilometer', 'Sq Mile', 'Sq Foot'],
    rate: { 'Sq Meter': 1, 'Sq Kilometer': 1e-6, 'Sq Mile': 3.861e-7, 'Sq Foot': 10.7639 },
  },
  currency: {
    label: 'Currency', icon: '💵',
    units: ['USD', 'EUR', 'GBP', 'PKR'],
    rate: { USD: 1, EUR: 0.92, GBP: 0.79, PKR: 278 },
  },
  time: {
    label: 'Time', icon: '⏱️',
    units: ['Second', 'Minute', 'Hour', 'Day'],
    rate: { Second: 1, Minute: 1 / 60, Hour: 1 / 3600, Day: 1 / 86400 },
  },
  speed: {
    label: 'Speed', icon: '🚀',
    units: ['m/s', 'km/h', 'mph', 'knot'],
    rate: { 'm/s': 1, 'km/h': 3.6, mph: 2.23694, knot: 1.94384 },
  },
};

function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  switch (from) {
    case 'Celsius': celsius = value; break;
    case 'Fahrenheit': celsius = (value - 32) * 5 / 9; break;
    case 'Kelvin': celsius = value - 273.15; break;
    default: return NaN;
  }
  switch (to) {
    case 'Celsius': return celsius;
    case 'Fahrenheit': return (celsius * 9) / 5 + 32;
    case 'Kelvin': return celsius + 273.15;
    default: return NaN;
  }
}

export default function ConverterModule() {
  const [active, setActive] = useState('length');
  const [fromUnit, setFromUnit] = useState('Meter');
  const [toUnit, setToUnit] = useState('Kilometer');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const converter = converters[active];

  const handleCategoryChange = (key) => {
    const conv = converters[key];
    setActive(key);
    setFromUnit(conv.units[0]);
    setToUnit(conv.units[1]);
    setResult('');
    setError('');
    setValue('');
  };

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult('');
    setError('');
  }, [fromUnit, toUnit]);

  const handleConvert = useCallback(() => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Enter a valid number');
      setResult('');
      return;
    }
    setError('');
    let converted;
    if (converter.special && active === 'temperature') {
      converted = convertTemperature(num, fromUnit, toUnit);
    } else {
      const base = num / converter.rate[fromUnit];
      converted = base * converter.rate[toUnit];
    }
    if (isNaN(converted) || !isFinite(converted)) {
      setError('Conversion error');
      setResult('');
      return;
    }
    const formatted = parseFloat(converted.toPrecision(12));
    setResult(formatted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }));
  }, [value, fromUnit, toUnit, active, converter]);

  const handleClear = () => {
    setValue('');
    setResult('');
    setError('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4">
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient">Unit Converter</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quickly convert between common units.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist">
          {Object.entries(converters).map(([key, cat]) => (
            <button
              key={key}
              role="tab"
              aria-selected={active === key}
              onClick={() => handleCategoryChange(key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === key
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'glass text-gray-600 dark:text-gray-300 hover:bg-white/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
        <Input
          type="number"
          label="Value"
          placeholder="Enter value"
          value={value}
          onChange={e => { setValue(e.target.value); setResult(''); setError(''); }}
        />
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
          <Select
            label="From"
            options={converter.units.map(u => ({ value: u, label: u }))}
            value={fromUnit}
            onChange={e => { setFromUnit(e.target.value); setResult(''); setError(''); }}
          />
          <div className="flex items-center pb-2">
            <button onClick={handleSwap} className="glass w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform" aria-label="Swap units">
              ⇄
            </button>
          </div>
          <Select
            label="To"
            options={converter.units.map(u => ({ value: u, label: u }))}
            value={toUnit}
            onChange={e => { setToUnit(e.target.value); setResult(''); setError(''); }}
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleConvert} className="flex-1">Convert</Button>
          <Button variant="secondary" onClick={handleClear}>Reset</Button>
        </div>
        {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-brand-500/10 rounded-xl text-center border border-brand-500/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Converted Result</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {value} {fromUnit} = {result} {toUnit}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}