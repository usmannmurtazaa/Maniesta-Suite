import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logEvent } from "../../services/firebase";

/* ── Button layouts ───────────────────────────────────────────────── */
const NORMAL_BUTTONS = [
  ["MC", "MR", "M+", "M-"],
  ["C", "⌫", "%", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["00", "0", ".", "="],
];

const SCIENTIFIC_BUTTONS = [
  ["sin", "cos", "tan", "("],
  ["asin", "acos", "atan", ")"],
  ["√", "∛", "x²", "x³"],
  ["log", "ln", "10ˣ", "xʸ"],
  ["π", "e", "|x|", "n!"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["C", "0", ".", "+"],
  ["MC", "MR", "M+", "="],
];

/* ── Scientific helpers ───────────────────────────────────────────── */
const SCI_FUNCTIONS = {
  sin: (x, mode) =>
    mode === "deg" ? Math.sin((x * Math.PI) / 180) : Math.sin(x),
  cos: (x, mode) =>
    mode === "deg" ? Math.cos((x * Math.PI) / 180) : Math.cos(x),
  tan: (x, mode) =>
    mode === "deg" ? Math.tan((x * Math.PI) / 180) : Math.tan(x),
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  "√": Math.sqrt,
  "∛": Math.cbrt,
  "x²": (x) => Math.pow(x, 2),
  "x³": (x) => Math.pow(x, 3),
  "10ˣ": (x) => Math.pow(10, x),
  log: Math.log10,
  ln: Math.log,
  "|x|": Math.abs,
  "±": (x) => -x,
  "1/x": (x) => 1 / x,
};

export default function CalculatorPanel({ darkMode }) {
  const [mode, setMode] = useState("normal");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");
  const containerRef = useRef(null);

  /* ── Keyboard support ─────────────────────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      const key = e.key;
      if (key === "Enter") {
        e.preventDefault();
        mode === "normal" ? handleNormalClick("=") : handleScientific("=");
      } else if (key === "Escape") {
        setInput("");
        setResult("0");
      } else if (key === "Backspace") setInput((prev) => prev.slice(0, -1));
      else if (/^[0-9.]$/.test(key)) setInput((prev) => prev + key);
      else if (key === "+") setInput((prev) => prev + "+");
      else if (key === "-") setInput((prev) => prev + "-");
      else if (key === "*") setInput((prev) => prev + "*");
      else if (key === "/") setInput((prev) => prev + "/");
      else if (key === "(") setInput((prev) => prev + "(");
      else if (key === ")") setInput((prev) => prev + ")");
      else if (key === "%") setInput((prev) => prev + "%");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, input]);

  /* ── Handlers ──────────────────────────────────────────────────────── */
  const handleNormalClick = useCallback(
    (value) => {
      if (value === "C") {
        setInput("");
        setResult("0");
      } else if (value === "⌫") setInput((prev) => prev.slice(0, -1));
      else if (value === "=") {
        try {
          const safe = input.replace(/[^0-9+\-*/%.()]/g, "");
          const res = Function('"use strict";return (' + safe + ")")();
          setResult(res);
          setHistory((prev) => [`${input} = ${res}`, ...prev.slice(0, 4)]);
          setInput(res.toString());
          logEvent("calculator_operation", {
            operation: "evaluate",
            expression: input,
          });
        } catch {
          setResult("Error");
          setInput("");
        }
      } else setInput((prev) => prev + value);
    },
    [input],
  );

  const handleMemory = useCallback(
    (action) => {
      const current = parseFloat(result) || 0;
      switch (action) {
        case "MC":
          setMemory(0);
          break;
        case "MR":
          setInput((prev) => prev + memory.toString());
          break;
        case "M+":
          setMemory((m) => m + current);
          break;
        case "M-":
          setMemory((m) => m - current);
          break;
      }
      logEvent("calculator_memory", { action });
    },
    [result, memory],
  );

  const handleScientific = useCallback(
    (func) => {
      if (["π", "e", "xʸ", "(", ")"].includes(func)) {
        if (func === "xʸ") setInput((prev) => prev + "**");
        else setInput((prev) => prev + func);
        return;
      }
      const current = parseFloat(input) || 0;
      let res;
      try {
        if (func === "n!") {
          if (current < 0 || !Number.isInteger(current)) res = NaN;
          else {
            res = 1;
            for (let i = 2; i <= current; i++) res *= i;
          }
        } else {
          const fn = SCI_FUNCTIONS[func];
          if (!fn) return;
          res = fn(current, angleMode);
        }
        setResult(res);
        setInput(res.toString());
        setHistory((prev) => [
          `${func}(${current}) = ${res}`,
          ...prev.slice(0, 4),
        ]);
        logEvent("calculator_scientific", { func });
      } catch {
        setResult("Error");
        setInput("");
      }
    },
    [input, angleMode],
  );

  const handleButtonClick = useCallback(
    (btn) => {
      if (["MC", "MR", "M+", "M-"].includes(btn)) handleMemory(btn);
      else if (mode === "normal") handleNormalClick(btn);
      else if (
        Object.keys(SCI_FUNCTIONS).includes(btn) ||
        ["π", "e", "xʸ", "(", ")", "n!"].includes(btn)
      )
        handleScientific(btn);
      else handleNormalClick(btn);
    },
    [mode, handleMemory, handleNormalClick, handleScientific],
  );

  const buttonsToRender =
    mode === "normal" ? NORMAL_BUTTONS : SCIENTIFIC_BUTTONS;

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="max-w-lg mx-auto w-full space-y-4">
      {/* Angle mode toggle (scientific only) */}
      <AnimatePresence>
        {mode === "scientific" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
            role="radiogroup"
            aria-label="Angle unit"
          >
            {["deg", "rad"].map((m) => (
              <motion.button
                key={m}
                onClick={() => {
                  setAngleMode(m);
                  logEvent("calculator_angle_mode", { mode: m });
                }}
                whileTap={{ scale: 0.95 }}
                role="radio"
                aria-checked={angleMode === m}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all ${
                  angleMode === m
                    ? "bg-brand-500 text-white shadow-brand"
                    : "glass text-gray-600 dark:text-gray-300 hover:bg-white/10"
                }`}
              >
                {m}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory indicator */}
      {memory !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-mono font-medium backdrop-blur-sm border border-brand-500/20"
        >
          <span className="uppercase tracking-wider">M:</span> {memory}
        </motion.div>
      )}

      {/* Display */}
      <div
        className="p-5 rounded-2xl glass min-h-[7rem] flex flex-col justify-end border border-white/20 dark:border-white/10 shadow-glass-lg"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="text-sm text-right text-gray-500 dark:text-gray-400 font-mono break-all min-h-[1.5rem]">
          {input || "0"}
        </div>
        <div className="text-3xl sm:text-4xl font-semibold text-right text-gray-900 dark:text-white font-mono tracking-tight mt-1 break-all">
          {result}
        </div>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2" role="tablist" aria-label="Calculator mode">
        {["normal", "scientific"].map((m) => (
          <motion.button
            key={m}
            onClick={() => {
              setMode(m);
              logEvent("calculator_mode_switch", { mode: m });
            }}
            whileTap={{ scale: 0.95 }}
            role="tab"
            aria-selected={mode === m}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
              mode === m
                ? "bg-gradient-brand text-white shadow-brand"
                : "glass text-gray-600 dark:text-gray-300 hover:bg-white/10"
            }`}
          >
            {m}
          </motion.button>
        ))}
      </div>

      {/* Buttons grid */}
      <div
        className="grid grid-cols-4 gap-2"
        role="group"
        aria-label={`${mode} calculator buttons`}
      >
        {buttonsToRender.map((row, i) =>
          row.map((btn, j) => {
            const isAction = ["C", "="].includes(btn);
            const isMemory = ["MC", "MR", "M+", "M-"].includes(btn);
            return (
              <motion.button
                key={`${i}-${j}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleButtonClick(btn)}
                className={`py-3 rounded-xl text-lg font-medium transition-all select-none ${
                  isAction
                    ? "bg-gradient-brand text-white shadow-brand hover:shadow-brand-lg"
                    : isMemory
                      ? "bg-brand-500/15 border border-brand-500/20 text-brand-600 dark:text-brand-300 hover:bg-brand-500/25"
                      : "glass text-gray-800 dark:text-white hover:bg-white/30 dark:hover:bg-white/10"
                }`}
                aria-label={btn}
              >
                {btn}
              </motion.button>
            );
          }),
        )}
      </div>

      {/* History */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-4 border-t border-gray-200/20 dark:border-white/10"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Recent
              </span>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline transition-colors"
              >
                Clear
              </button>
            </div>
            {history.map((h, i) => (
              <div
                key={i}
                className="text-sm text-gray-500 dark:text-gray-400 font-mono py-1 border-b border-white/5 break-all"
              >
                {h}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
