import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import { simpleInterest, compoundInterest, loanEMI } from '../../utils/calculations';

const MODES = [
  { key: 'simple', label: 'Simple Interest', desc: 'Interest calculated only on principal.', formula: 'I = P × r × t' },
  { key: 'compound', label: 'Compound Interest', desc: 'Interest on principal + accumulated interest.', formula: 'A = P (1 + r/n)^(nt)', extra: 'compoundFreq' },
  { key: 'loan', label: 'Loan EMI', desc: 'Monthly payment for a fixed-rate loan.', formula: 'EMI = P × r(1+r)^n / ((1+r)^n - 1)' },
];

export default function InterestCalculator() {
  const [mode, setMode] = useState('simple');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compoundFreq, setCompoundFreq] = useState('1');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const activeMode = useMemo(() => MODES.find(m => m.key === mode), [mode]);

  const validate = () => {
    const errs = {};
    const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(time);
    if (!principal || isNaN(p) || p <= 0) errs.principal = 'Enter valid principal';
    if (!rate || isNaN(r) || r <= 0) errs.rate = 'Enter valid rate';
    if (!time || isNaN(t) || t <= 0) errs.time = 'Enter valid time';
    if (mode === 'compound') {
      const n = parseInt(compoundFreq);
      if (!compoundFreq || isNaN(n) || n <= 0) errs.compoundFreq = 'Must be at least 1';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(time);
    let res;
    switch (mode) {
      case 'simple': res = simpleInterest(p, r, t); break;
      case 'compound': res = compoundInterest(p, r, t, parseInt(compoundFreq)); break;
      case 'loan': res = loanEMI(p, r, t * 12); break;
      default: return;
    }
    setResult(res);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResult(null);
    setErrors({});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4">
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient">Interest Calculator</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Compute simple interest, compound growth, or monthly loan payments.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist">
          {MODES.map(m => (
            <button
              key={m.key}
              role="tab"
              aria-selected={mode === m.key}
              onClick={() => handleModeChange(m.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === m.key
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'glass text-gray-600 dark:text-gray-300 hover:bg-white/40'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {activeMode && (
          <motion.div key={mode} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-gray-500 bg-white/30 dark:bg-gray-800/30 rounded-lg p-3">
            <p>{activeMode.desc}</p>
            <p className="mt-1 font-mono">{activeMode.formula}</p>
          </motion.div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Principal" type="number" value={principal} onChange={e => { setPrincipal(e.target.value); setErrors(prev => ({ ...prev, principal: undefined })); }} error={errors.principal} />
          <Input label="Annual Rate (%)" type="number" value={rate} onChange={e => { setRate(e.target.value); setErrors(prev => ({ ...prev, rate: undefined })); }} error={errors.rate} />
          <Input label={mode === 'loan' ? 'Loan Term (years)' : 'Time (years)'} type="number" value={time} onChange={e => { setTime(e.target.value); setErrors(prev => ({ ...prev, time: undefined })); }} error={errors.time} />
          {mode === 'compound' && (
            <Input label="Compounding/year" type="number" min="1" step="1" value={compoundFreq} onChange={e => { setCompoundFreq(e.target.value); setErrors(prev => ({ ...prev, compoundFreq: undefined })); }} error={errors.compoundFreq} />
          )}
        </div>
        <Button onClick={handleCalculate} className="w-full">Calculate</Button>
        {result !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-brand-500/10 rounded-xl text-center border border-brand-500/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === 'loan' ? 'Monthly EMI' : mode === 'simple' ? 'Interest Earned' : 'Compound Interest'}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              ${mode === 'loan' ? parseFloat(result).toLocaleString() : parseFloat(result).toFixed(2)}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}