import { useState } from 'react';
import { motion } from 'framer-motion';
import NormalCalculator from '../components/calculators/NormalCalculator';
import ScientificCalculator from '../components/calculators/ScientificCalculator';

export default function CalculatorPage() {
  const [mode, setMode] = useState('normal');
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-center gap-4">
        {['normal', 'scientific'].map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-6 py-2.5 rounded-full font-medium transition-all ${mode === m ? 'bg-brand-500 text-white' : 'glass'}`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {mode === 'normal' ? <NormalCalculator /> : <ScientificCalculator />}
      </motion.div>
    </div>
  );
}