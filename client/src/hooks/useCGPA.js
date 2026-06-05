import { useState, useCallback } from 'react';

/**
 * Custom hook that manages semester GPAs and calculates CGPA.
 * @param {number} scale - Maximum GPA scale (e.g., 4.0).
 */
export function useCGPA(scale = 4.0) {
  const [sems, setSems] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const addSem = useCallback(() => {
    if (sems.length >= 8) return;
    setSems(prev => [...prev, { id: crypto.randomUUID(), val: '' }]);
  }, [sems.length]);

  const removeSem = useCallback((id) => {
    setSems(prev => prev.filter(s => s.id !== id));
    setResult(null);
  }, []);

  const updateSem = useCallback((id, val) => {
    setSems(prev =>
      prev.map(s => (s.id === id ? { ...s, val } : s))
    );
    setResult(null);
  }, []);

  const calculate = useCallback(() => {
    setError('');
    const validGpas = sems
      .map(s => parseFloat(s.val))
      .filter(v => !isNaN(v) && v >= 0 && v <= scale);

    if (validGpas.length === 0) {
      setError('Enter at least one valid semester GPA.');
      return;
    }

    const total = validGpas.reduce((a, b) => a + b, 0);
    const cgpa = total / validGpas.length;
    const best = Math.max(...validGpas);

    setResult({ cgpa: cgpa.toFixed(2), sems: validGpas, total, best });
  }, [sems, scale]);

  return { sems, addSem, removeSem, updateSem, calculate, result, error };
}