import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Safe expression evaluator ─────────────────────────────────────── */
function evaluateExpression(expr) {
  const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
  if (!sanitized) return NaN;
  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (typeof result !== 'number' || !isFinite(result)) return NaN;
    return result;
  } catch {
    return NaN;
  }
}

/* ── Layout ───────────────────────────────────────────────────────── */
const BUTTON_LAYOUT = [
  ['C', '⌫', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.'],
];

/* ── Keyboard mapping ─────────────────────────────────────────────── */
const KEY_MAP = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '+': '+', '-': '-', '*': '*', '/': '/',
  '.': '.', 'Enter': '=', 'Backspace': '⌫', 'Delete': 'C',
  'c': 'C', 'C': 'C', 'Escape': 'C',
};

export default function NormalCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [isResult, setIsResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const calcRef = useRef(null);

  const handleInput = useCallback((value) => {
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
      const result = evaluateExpression(expression);
      if (!isNaN(result)) {
        const formatted = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(10)).toString();
        setDisplay(formatted);
        setHistory(prev => [{ expression, result: formatted, id: Date.now() }, ...prev.slice(0, 9)]);
        setExpression(formatted);
        setIsResult(true);
      } else {
        setDisplay('Error');
        setExpression('');
        setIsResult(false);
        setTimeout(() => setDisplay('0'), 1200);
      }
    } else {
      if (isResult) {
        if (/[0-9]/.test(value)) {
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
  }, [expression, display, isResult]);

  const handleKeyDown = useCallback((e) => {
    const key = KEY_MAP[e.key];
    if (key) {
      e.preventDefault();
      handleInput(key);
    }
  }, [handleInput]);

  useEffect(() => {
    const ref = calcRef.current;
    ref?.addEventListener('keydown', handleKeyDown);
    return () => ref?.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const copyToClipboard = useCallback(() => {
    if (display && display !== '0' && display !== 'Error') {
      navigator.clipboard.writeText(display).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [display]);

  return (
    <motion.div
      ref={calcRef}
      tabIndex={0}
      className="max-w-xs w-full mx-auto glass p-4 sm:p-5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 shadow-glass-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="application"
      aria-label="Normal Calculator"
    >
      {/* Display */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur p-3 rounded-xl mb-4 text-right overflow-hidden border border-white/20 dark:border-white/10">
        <div
          className="text-3xl sm:text-4xl font-mono font-light text-gray-900 dark:text-white truncate"
          aria-live="polite"
        >
          {display}
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={copyToClipboard}
            className="text-xs text-gray-500 hover:text-brand-500 transition-colors"
            aria-label="Copy result"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button
            onClick={() => setShowHistory(prev => !prev)}
            className="text-xs text-gray-500 hover:text-brand-500 transition-colors"
            aria-label="Toggle history"
          >
            {showHistory ? 'Hide History' : 'History'}
          </button>
        </div>
      </div>

      {/* Button grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {BUTTON_LAYOUT.flat().map((btn) => {
          const isAction = btn === '=';
          const isClear = btn === 'C' || btn === '⌫';
          return (
            <motion.button
              key={btn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleInput(btn)}
              className={`w-full h-12 sm:h-14 text-lg sm:text-xl font-medium rounded-xl transition-all select-none ${
                isAction
                  ? 'bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg'
                  : isClear
                    ? 'glass text-red-500 hover:bg-red-500/10'
                    : 'glass text-gray-800 dark:text-white hover:bg-white/20 dark:hover:bg-white/10'
              }`}
              aria-label={
                btn === '⌫' ? 'Backspace' :
                btn === 'C' ? 'Clear' :
                btn
              }
            >
              {btn}
            </motion.button>
          );
        })}
      </div>

      {/* History */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-gray-200/30 dark:border-white/10 pt-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                History
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-1">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between text-xs text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 p-1 rounded transition-colors"
                  >
                    <span className="truncate mr-2">{h.expression}</span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      = {h.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}