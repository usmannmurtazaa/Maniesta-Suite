import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Safe scientific evaluator ─────────────────────────────────────── */
function preprocessScientific(expr) {
  let sanitized = expr;
  sanitized = sanitized.replace(/\^/g, "**");
  sanitized = sanitized.replace(/\b(sin|cos|tan)\(/g, "Math.$1(");
  sanitized = sanitized.replace(/\blog\(/g, "Math.log10(");
  sanitized = sanitized.replace(/\bln\(/g, "Math.log(");
  sanitized = sanitized.replace(/\bsqrt\(/g, "Math.sqrt(");
  sanitized = sanitized.replace(/π/g, "Math.PI");
  sanitized = sanitized.replace(/\be\b/g, "Math.E");
  return sanitized;
}

function evaluateScientific(expr) {
  if (!expr) return NaN;
  try {
    const processed = preprocessScientific(expr);
    const result = Function(`"use strict"; return (${processed})`)();
    if (typeof result !== "number" || !isFinite(result)) return NaN;
    return result;
  } catch {
    return NaN;
  }
}

/* ── SVG Icons (replacing emojis) ─────────────────────────────────── */
const CopyIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Local hook: reduced motion detection ──────────────────────────── */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}

/* ── Layout ───────────────────────────────────────────────────────── */
const SCIENTIFIC_LAYOUT = [
  [
    { label: "sin" },
    { label: "cos" },
    { label: "tan" },
    { label: "log" },
    { label: "ln" },
  ],
  [
    { label: "√" },
    { label: "π" },
    { label: "e" },
    { label: "(" },
    { label: ")" },
  ],
  [
    { label: "C" },
    { label: "⌫" },
    { label: "^" },
    { label: "/" },
    { label: "*" },
  ],
  [
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "-" },
    { label: "+" },
  ],
  [{ label: "4" }, { label: "5" }, { label: "6" }, { label: "=", colSpan: 1 }],
  [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "." },
    { label: "0" },
  ],
];

/* ── Keyboard mapping ─────────────────────────────────────────────── */
const KEY_MAP = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  ".": ".",
  Enter: "=",
  Backspace: "⌫",
  Delete: "C",
  c: "C",
  C: "C",
  Escape: "C",
  "(": "(",
  ")": ")",
  "^": "^",
  s: "sin",
  o: "cos",
  t: "tan",
  l: "log",
  n: "ln",
  q: "sqrt",
  p: "π",
  e: "e",
};

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);
  const [isResult, setIsResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const calcRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const handleInput = useCallback(
    (value) => {
      if (value === "C") {
        setExpression("");
        setDisplay("0");
        setIsResult(false);
      } else if (value === "⌫") {
        if (isResult) {
          setExpression("");
          setDisplay("0");
          setIsResult(false);
        } else {
          const newExp = expression.slice(0, -1);
          setExpression(newExp);
          setDisplay(newExp || "0");
        }
      } else if (value === "=") {
        if (!expression) return;
        const result = evaluateScientific(expression);
        if (!isNaN(result)) {
          const formatted = Number.isInteger(result)
            ? result.toString()
            : parseFloat(result.toFixed(10)).toString();
          setDisplay(formatted);
          setHistory((prev) => [
            { expression, result: formatted, id: Date.now() },
            ...prev.slice(0, 9),
          ]);
          setExpression(formatted);
          setIsResult(true);
        } else {
          setDisplay("Error");
          setExpression("");
          setIsResult(false);
          setTimeout(() => setDisplay("0"), 1200);
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
    },
    [expression, display, isResult],
  );

  const handleKeyDown = useCallback(
    (e) => {
      const key = KEY_MAP[e.key];
      if (key) {
        e.preventDefault();
        handleInput(key);
      }
    },
    [handleInput],
  );

  useEffect(() => {
    const ref = calcRef.current;
    ref?.addEventListener("keydown", handleKeyDown);
    return () => ref?.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const copyToClipboard = useCallback(() => {
    if (display && display !== "0" && display !== "Error") {
      navigator.clipboard.writeText(display).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [display]);

  // Motion props
  const containerMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      };

  const btnWhileHover = reducedMotion ? {} : { whileHover: { scale: 1.05 } };
  const btnWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.92 } };

  // History panel – static if reduced motion
  const historyPanel = showHistory && history.length > 0 && (
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
  );

  return (
    <motion.div
      ref={calcRef}
      tabIndex={0}
      className="max-w-md w-full mx-auto glass p-4 sm:p-5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 shadow-glass-lg"
      {...containerMotion}
      role="application"
      aria-label="Scientific Calculator"
    >
      {/* Display */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur p-3 rounded-xl mb-4 text-right overflow-hidden border border-white/20 dark:border-white/10">
        <div
          className="text-2xl sm:text-3xl font-mono font-light text-gray-900 dark:text-white truncate"
          aria-live="polite"
        >
          {display}
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-xs text-gray-500 hover:text-brand-500 transition-colors flex items-center gap-1"
            aria-label="Copy result"
          >
            {copied ? (
              <>
                <CheckIcon /> Copied
              </>
            ) : (
              <>
                <CopyIcon /> Copy
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="text-xs text-gray-500 hover:text-brand-500 transition-colors"
            aria-label="Toggle history"
          >
            {showHistory ? "Hide History" : "History"}
          </button>
        </div>
      </div>

      {/* Button grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {SCIENTIFIC_LAYOUT.flat().map((btn) => {
          const isAction = btn.label === "=";
          const isClear = btn.label === "C" || btn.label === "⌫";
          return (
            <motion.button
              key={btn.label}
              type="button"
              {...btnWhileHover}
              {...btnWhileTap}
              onClick={() => handleInput(btn.label)}
              className={`w-full h-11 sm:h-12 text-sm sm:text-base font-medium rounded-xl transition-all select-none ${
                isAction
                  ? "bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg"
                  : isClear
                    ? "glass text-red-500 hover:bg-red-500/10"
                    : "glass text-gray-800 dark:text-white hover:bg-white/20 dark:hover:bg-white/10"
              }`}
              aria-label={
                btn.label === "⌫"
                  ? "Backspace"
                  : btn.label === "C"
                    ? "Clear"
                    : btn.label === "√"
                      ? "Square root"
                      : btn.label
              }
            >
              {btn.label}
            </motion.button>
          );
        })}
      </div>

      {/* History */}
      {reducedMotion ? (
        historyPanel
      ) : (
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 300, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {historyPanel}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
