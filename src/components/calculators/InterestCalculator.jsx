import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  simpleInterest,
  compoundInterest,
  loanEMI,
} from "../../utils/calculations";

/**
 * Local hook to detect reduced‑motion preference.
 * (Can be extracted to a shared utility later.)
 */
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

const MODES = [
  {
    key: "simple",
    label: "Simple Interest",
    desc: "Interest calculated only on principal.",
    formula: "I = P × r × t",
  },
  {
    key: "compound",
    label: "Compound Interest",
    desc: "Interest on principal + accumulated interest.",
    formula: "A = P (1 + r/n)^(nt)",
    extra: "compoundFreq",
  },
  {
    key: "loan",
    label: "Loan EMI",
    desc: "Monthly payment for a fixed-rate loan.",
    formula: "EMI = P × r(1+r)^n / ((1+r)^n - 1)",
  },
];

export default function InterestCalculator() {
  const [mode, setMode] = useState("simple");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [compoundFreq, setCompoundFreq] = useState("1");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const reducedMotion = usePrefersReducedMotion();

  const activeMode = useMemo(() => MODES.find((m) => m.key === mode), [mode]);

  const validate = () => {
    const errs = {};
    const p = parseFloat(principal),
      r = parseFloat(rate),
      t = parseFloat(time);
    if (!principal || isNaN(p) || p <= 0)
      errs.principal = "Enter valid principal";
    if (!rate || isNaN(r) || r <= 0) errs.rate = "Enter valid rate";
    if (!time || isNaN(t) || t <= 0) errs.time = "Enter valid time";
    if (mode === "compound") {
      const n = parseInt(compoundFreq);
      if (!compoundFreq || isNaN(n) || n <= 0)
        errs.compoundFreq = "Must be at least 1";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const p = parseFloat(principal),
      r = parseFloat(rate),
      t = parseFloat(time);
    let res;
    switch (mode) {
      case "simple":
        res = simpleInterest(p, r, t);
        break;
      case "compound":
        res = compoundInterest(p, r, t, parseInt(compoundFreq));
        break;
      case "loan":
        res = loanEMI(p, r, t * 12);
        break;
      default:
        return;
    }
    setResult(res);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResult(null);
    setErrors({});
  };

  // Motion props
  const containerMotion = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const tabWhileHover = reducedMotion ? {} : { whileHover: { scale: 1.05 } };
  const tabWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.95 } };
  const calcWhileHover = reducedMotion ? {} : { whileHover: { scale: 1.02 } };
  const calcWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.98 } };

  // Error message component – static or animated
  const ErrorMessage = ({ field }) => {
    if (!errors[field]) return null;
    if (reducedMotion) {
      return <p className="mt-1 text-sm text-red-500">{errors[field]}</p>;
    }
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-1 text-sm text-red-500"
      >
        {errors[field]}
      </motion.p>
    );
  };

  // Formula description – static or animated
  const renderFormulaDesc = () => {
    if (!activeMode) return null;
    const content = (
      <div className="text-xs text-gray-500 bg-white/30 dark:bg-gray-800/30 rounded-lg p-3">
        <p>{activeMode.desc}</p>
        <p className="mt-1 font-mono">{activeMode.formula}</p>
      </div>
    );
    if (reducedMotion) return content;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Result display – static or animated
  const renderResult = () => {
    if (result === null) return null;
    const content = (
      <div className="p-5 bg-brand-500/10 rounded-xl text-center border border-brand-500/20 backdrop-blur">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {mode === "loan"
            ? "Monthly EMI"
            : mode === "simple"
              ? "Interest Earned"
              : "Compound Interest"}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          $
          {mode === "loan"
            ? parseFloat(result).toLocaleString()
            : parseFloat(result).toFixed(2)}
        </p>
      </div>
    );
    if (reducedMotion) return content;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <motion.div {...containerMotion} className="max-w-2xl mx-auto px-4">
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient">
            Interest Calculator
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Compute simple interest, compound growth, or monthly loan payments.
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex flex-wrap gap-2" role="tablist">
          {MODES.map((m) => (
            <motion.button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={mode === m.key}
              {...tabWhileHover}
              {...tabWhileTap}
              onClick={() => handleModeChange(m.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === m.key
                  ? "bg-gradient-brand text-white shadow-brand"
                  : "glass text-gray-600 dark:text-gray-300 hover:bg-white/40"
              }`}
            >
              {m.label}
            </motion.button>
          ))}
        </div>

        {/* Formula description */}
        {renderFormulaDesc()}

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Principal
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => {
                setPrincipal(e.target.value);
                setErrors((prev) => ({ ...prev, principal: undefined }));
              }}
              className={`input-base w-full ${errors.principal ? "input-error" : ""}`}
              placeholder="e.g. 1000"
            />
            <ErrorMessage field="principal" />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Annual Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
                setErrors((prev) => ({ ...prev, rate: undefined }));
              }}
              className={`input-base w-full ${errors.rate ? "input-error" : ""}`}
              placeholder="e.g. 5"
            />
            <ErrorMessage field="rate" />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {mode === "loan" ? "Loan Term (years)" : "Time (years)"}
            </label>
            <input
              type="number"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setErrors((prev) => ({ ...prev, time: undefined }));
              }}
              className={`input-base w-full ${errors.time ? "input-error" : ""}`}
              placeholder="e.g. 2"
            />
            <ErrorMessage field="time" />
          </div>

          {/* Compound frequency */}
          {mode === "compound" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Compounding / year
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={compoundFreq}
                onChange={(e) => {
                  setCompoundFreq(e.target.value);
                  setErrors((prev) => ({ ...prev, compoundFreq: undefined }));
                }}
                className={`input-base w-full ${
                  errors.compoundFreq ? "input-error" : ""
                }`}
                placeholder="1"
              />
              <ErrorMessage field="compoundFreq" />
            </div>
          )}
        </div>

        {/* Calculate button */}
        <motion.button
          type="button"
          {...calcWhileHover}
          {...calcWhileTap}
          onClick={handleCalculate}
          className="btn-primary w-full py-3"
        >
          Calculate
        </motion.button>

        {/* Result */}
        {renderResult()}
      </div>
    </motion.div>
  );
}
