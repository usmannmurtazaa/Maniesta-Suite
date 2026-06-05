import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../common/Input';

export function GradeProgressBar({ gpa, scale }) {
  const max = scale === 'mit' ? 5.0 : 4.0;
  const percent = Math.min((parseFloat(gpa) / max) * 100, 100);
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>0.0</span>
        <span>{max.toFixed(1)}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="h-full bg-gradient-to-r from-brand-500 to-purple-400 rounded-full"
        />
      </div>
    </div>
  );
}

export function TargetGPACalculator({ currentGPA, totalCredits }) {
  const [target, setTarget] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');
  const [needed, setNeeded] = useState(null);

  const calcNeeded = () => {
    const targetGpa = parseFloat(target);
    const remain = parseFloat(remainingCredits);
    if (isNaN(targetGpa) || isNaN(remain) || remain <= 0) return;
    const currentPoints = parseFloat(currentGPA) * totalCredits;
    const requiredPoints = targetGpa * (totalCredits + remain) - currentPoints;
    const requiredGpa = requiredPoints / remain;
    setNeeded(requiredGpa.toFixed(2));
  };

  return (
    <div className="glass p-5 rounded-2xl mt-6">
      <h3 className="text-lg font-semibold mb-3">Target GPA Calculator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Target GPA"
          type="number"
          step="0.01"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <Input
          label="Remaining Credits"
          type="number"
          value={remainingCredits}
          onChange={e => setRemainingCredits(e.target.value)}
        />
      </div>
      <button
        onClick={calcNeeded}
        className="mt-4 bg-brand-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
      >
        Calculate
      </button>
      {needed && (
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
          You need a GPA of <span className="font-mono font-bold text-brand-500">{needed}</span> in the remaining courses.
        </p>
      )}
    </div>
  );
}