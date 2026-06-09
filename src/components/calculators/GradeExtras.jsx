import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── GradeProgressBar ──────────────────────────────────────────────────
export function GradeProgressBar({ gpa, scale, darkMode }) {
  const max = parseFloat(scale);
  const numericGpa = parseFloat(gpa) || 0;
  const pct = useMemo(
    () => Math.min((numericGpa / max) * 100, 100),
    [numericGpa, max],
  );

  const barColor = useMemo(() => {
    if (pct >= 70)
      return {
        bg: "from-purple-600 to-purple-400",
        shadow: "shadow-purple-500/30",
      };
    if (pct >= 40)
      return {
        bg: "from-amber-500 to-amber-300",
        shadow: "shadow-amber-500/30",
      };
    return { bg: "from-red-500 to-red-300", shadow: "shadow-red-500/30" };
  }, [pct]);

  const markers = useMemo(() => [0, max * 0.5, max * 0.75, max], [max]);

  return (
    <div
      role="progressbar"
      aria-valuenow={numericGpa}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`GPA progress: ${numericGpa.toFixed(2)} out of ${max}`}
      className="mt-6 px-1 w-full"
    >
      {/* Header row */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Progress
        </span>
        <span
          className={`text-sm font-bold ${
            pct >= 70
              ? "text-emerald-500"
              : pct >= 40
                ? "text-amber-500"
                : "text-red-500"
          }`}
          aria-live="polite"
        >
          {numericGpa.toFixed(2)} / {max} ({pct.toFixed(0)}%)
        </span>
      </div>

      {/* Markers */}
      <div
        aria-hidden="true"
        className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-1.5"
      >
        {markers.map((m, i) => (
          <span key={i}>{m.toFixed(2)}</span>
        ))}
      </div>

      {/* Track */}
      <div className="h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className={`h-full bg-gradient-to-r ${barColor.bg} rounded-full shadow-lg ${barColor.shadow}`}
        />
      </div>
    </div>
  );
}

// ── TargetGPACalculator ────────────────────────────────────────────────
export function TargetGPACalculator({ currentGPA, totalCredits, darkMode }) {
  const [targetGPA, setTargetGPA] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [requiredGPA, setRequiredGPA] = useState(null);
  const [error, setError] = useState("");

  const calculateRequired = useCallback(() => {
    setError("");
    setRequiredGPA(null);

    const current = parseFloat(currentGPA);
    const target = parseFloat(targetGPA);
    const total = parseFloat(totalCredits);
    const remaining = parseFloat(remainingCredits);

    if (
      isNaN(current) ||
      isNaN(target) ||
      isNaN(total) ||
      isNaN(remaining) ||
      targetGPA === "" ||
      remainingCredits === ""
    ) {
      setError("Please fill all fields with valid numbers.");
      return;
    }
    if (target < 0) {
      setError("Target GPA must be non‑negative.");
      return;
    }
    if (remaining <= 0) {
      setError("Remaining credits must be greater than zero.");
      return;
    }

    const required =
      (target * (total + remaining) - current * total) / remaining;
    if (required < 0) {
      setRequiredGPA("0.00 (target already reached)");
    } else {
      setRequiredGPA(required.toFixed(2));
    }
  }, [currentGPA, totalCredits, targetGPA, remainingCredits]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-6 p-5 sm:p-6 rounded-2xl glass-card border border-white/20 dark:border-white/10"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl" aria-hidden="true">
          🎯
        </span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Target GPA Calculator
        </h3>
      </div>

      <div className="grid gap-4">
        {/* Target GPA */}
        <label htmlFor="target-gpa-input" className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Target GPA
          </span>
          <input
            id="target-gpa-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 3.50"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e.target.value)}
            className="input-base focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all"
            aria-required="true"
          />
        </label>

        {/* Remaining Credits */}
        <label
          htmlFor="remaining-credits-input"
          className="flex flex-col gap-1.5"
        >
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Remaining Credits
          </span>
          <input
            id="remaining-credits-input"
            type="number"
            min="0"
            placeholder="e.g. 30"
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            className="input-base focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all"
            aria-required="true"
          />
        </label>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400 font-medium"
              role="alert"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calculate button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculateRequired}
          className="btn-primary w-full py-3.5 rounded-xl font-semibold shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 transition-all"
        >
          Calculate Required GPA
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {requiredGPA !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/5 dark:bg-white/5 text-center backdrop-blur"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Required GPA in remaining courses
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-gradient text-shadow-glow">
                {requiredGPA}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
