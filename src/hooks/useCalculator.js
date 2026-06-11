import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Shared logic for any calculator (normal, scientific, etc.)
 * @param {Function} evaluator - function that takes an expression string and returns a number or NaN
 * @returns {object} { display, expression, history, handleInput, clearHistory }
 */
export function useCalculator(evaluator) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [isResult, setIsResult] = useState(false);

  // Refs for managing cleanup and unique IDs
  const errorTimeoutRef = useRef(null);
  const idCounterRef = useRef(0);

  // Clear any pending error timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleInput = useCallback((value) => {
    // Clear previous error timeout before setting a new one
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    if (value === 'C') {
      setExpression('');
      setDisplay('0');
      setIsResult(false);
    } else if (value === '⌫') {
      if (isResult) {
        setExpression('');
        setDisplay('0');
        setIsResult(false);
      } else {
        const newExp = expression.slice(0, -1);
        setExpression(newExp);
        setDisplay(newExp || '0');
      }
    } else if (value === '=') {
      if (!expression) return;
      const result = evaluator(expression);
      if (!isNaN(result)) {
        const formatted = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(10)).toString();
        setDisplay(formatted);
        setHistory(prev => [
          { expression, result: formatted, id: ++idCounterRef.current },
          ...prev.slice(0, 9)
        ]);
        setExpression(formatted);
        setIsResult(true);
      } else {
        setDisplay('Error');
        setExpression('');
        setIsResult(false);
        // Schedule a timeout to reset the display
        errorTimeoutRef.current = setTimeout(() => {
          setDisplay('0');
          errorTimeoutRef.current = null;
        }, 1200);
      }
    } else {
      if (isResult) {
        if (/[0-9.]/.test(value)) {
          setExpression(value);
          setDisplay(value);
        } else {
          setExpression(display + value);
          setDisplay(display + value);
        }
        setIsResult(false);
      } else {
        const newExp = expression + value;
        setExpression(newExp);
        setDisplay(newExp);
      }
    }
  }, [expression, display, isResult, evaluator]);

  const clearHistory = useCallback(() => setHistory([]), []);

  return {
    display,
    expression,
    history,
    isResult,
    handleInput,
    setDisplay,
    setExpression,
    setHistory,
    clearHistory,
  };
}