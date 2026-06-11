import { useState, useCallback } from 'react';

/**
 * Custom hook that manages semester GPAs and calculates CGPA.
 * @param {number|string} scale - Maximum GPA scale (e.g., 4.0 or "4.0").
 */
export function useCGPA(scale = 4.0) {
  // Normalize scale to a number (supports strings from the UI)
  const maxScale = typeof scale === 'string' ? parseFloat(scale) : scale;

  const [sems, setSems] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Stable callback – no external dependencies needed
  const addSem = useCallback(() => {
    setSems(prev =>
      prev.length >= 8 ? prev : [...prev, { id: crypto.randomUUID(), val: '' }]
    );
  }, []);

  const removeSem = useCallback((id) => {
    setSems(prev => prev.filter(s => s.id !== id));
    setResult(null);
    setError(''); // Clear any previous error
  }, []);

  const updateSem = useCallback((id, val) => {
    setSems(prev =>
      prev.map(s => (s.id === id ? { ...s, val } : s))
    );
    setResult(null);
    setError(''); // Clear any previous error
  }, []);

  const calculate = useCallback(() => {
    setError('');
    // Validate only GPAs that are within the chosen scale
    const validGpas = sems
      .map(s => parseFloat(s.val))
      .filter(v => !isNaN(v) && v >= 0 && v <= maxScale);

    if (validGpas.length === 0) {
      setError('Enter at least one valid semester GPA.');
      return;
    }

    const total = validGpas.reduce((a, b) => a + b, 0);
    const cgpa = total / validGpas.length;
    const best = Math.max(...validGpas);

    setResult({ cgpa: cgpa.toFixed(2), sems: validGpas, total, best });
  }, [sems, maxScale]);

  return { sems, addSem, removeSem, updateSem, calculate, result, error };
}