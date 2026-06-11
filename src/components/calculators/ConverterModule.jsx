// file: src/components/calculators/ConverterModule.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../common/Dropdown";

/* ── Local reduced‑motion hook ───────────────────────────────────── */
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

/* ── Professional SVG Icons ──────────────────────────────────────── */
const LengthIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6l3-3 3 3M9 3v14M21 18l-3 3-3-3M15 21V7"
    />
  </svg>
);

const WeightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {/* Simple balance scale icon – distinct from length */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v4m0 0l-3 4h6l-3-4zm-6.5 7.5L12 10l6.5 4.5M5 15l-2 5h18l-2-5"
    />
  </svg>
);

const TemperatureIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.773l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const AreaIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v16.5h16.5V3.75H3.75zM12 6v12M6 12h12"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182"
    />
  </svg>
);

const TimeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6l4 2m-4-8a9 9 0 110 18 9 9 0 010-18z"
    />
  </svg>
);

const SpeedIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);

/* ── Swap icon (replaces ⇄) ──────────────────────────────────────── */
const SwapIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);

/* ── Conversion definitions ──────────────────────────────────────── */
const converters = {
  length: {
    label: "Length",
    icon: <LengthIcon />,
    units: ["Meter", "Kilometer", "Mile", "Foot"],
    rate: { Meter: 1, Kilometer: 0.001, Mile: 0.000621371, Foot: 3.28084 },
  },
  weight: {
    label: "Weight",
    icon: <WeightIcon />,
    units: ["Kilogram", "Gram", "Pound", "Ounce"],
    rate: { Kilogram: 1, Gram: 1000, Pound: 2.20462, Ounce: 35.274 },
  },
  temperature: {
    label: "Temperature",
    icon: <TemperatureIcon />,
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    special: true,
  },
  area: {
    label: "Area",
    icon: <AreaIcon />,
    units: ["Sq Meter", "Sq Kilometer", "Sq Mile", "Sq Foot"],
    rate: {
      "Sq Meter": 1,
      "Sq Kilometer": 1e-6,
      "Sq Mile": 3.861e-7,
      "Sq Foot": 10.7639,
    },
  },
  currency: {
    label: "Currency",
    icon: <CurrencyIcon />,
    units: ["USD", "EUR", "GBP", "PKR"],
    rate: { USD: 1, EUR: 0.92, GBP: 0.79, PKR: 278 },
  },
  time: {
    label: "Time",
    icon: <TimeIcon />,
    units: ["Second", "Minute", "Hour", "Day"],
    rate: { Second: 1, Minute: 1 / 60, Hour: 1 / 3600, Day: 1 / 86400 },
  },
  speed: {
    label: "Speed",
    icon: <SpeedIcon />,
    units: ["m/s", "km/h", "mph", "knot"],
    rate: { "m/s": 1, "km/h": 3.6, mph: 2.23694, knot: 1.94384 },
  },
};

function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  switch (from) {
    case "Celsius":
      celsius = value;
      break;
    case "Fahrenheit":
      celsius = ((value - 32) * 5) / 9;
      break;
    case "Kelvin":
      celsius = value - 273.15;
      break;
    default:
      return NaN;
  }
  switch (to) {
    case "Celsius":
      return celsius;
    case "Fahrenheit":
      return (celsius * 9) / 5 + 32;
    case "Kelvin":
      return celsius + 273.15;
    default:
      return NaN;
  }
}

export default function ConverterModule() {
  const [active, setActive] = useState("length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const reducedMotion = usePrefersReducedMotion();

  const converter = converters[active];

  const unitOptions = useMemo(
    () => converter.units.map((u) => ({ value: u, label: u })),
    [converter],
  );

  const handleCategoryChange = (key) => {
    const conv = converters[key];
    setActive(key);
    setFromUnit(conv.units[0]);
    setToUnit(conv.units[1]);
    setResult("");
    setError("");
    setValue("");
  };

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult("");
    setError("");
  }, [fromUnit, toUnit]);

  const handleConvert = useCallback(() => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError("Enter a valid number");
      setResult("");
      return;
    }
    setError("");
    let converted;
    if (converter.special && active === "temperature") {
      converted = convertTemperature(num, fromUnit, toUnit);
    } else {
      const base = num / converter.rate[fromUnit];
      converted = base * converter.rate[toUnit];
    }
    if (isNaN(converted) || !isFinite(converted)) {
      setError("Conversion error");
      setResult("");
      return;
    }
    const formatted = parseFloat(converted.toPrecision(12));
    setResult(
      formatted.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }),
    );
  }, [value, fromUnit, toUnit, active, converter]);

  const handleClear = () => {
    setValue("");
    setResult("");
    setError("");
  };

  // Common motion props – empty when reduced motion
  const containerMotion = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const tabHoverTap = reducedMotion
    ? {}
    : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  const btnHoverTap = reducedMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  const swapBtnProps = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.1, rotate: 180 },
        whileTap: { scale: 0.9 },
      };

  return (
    <motion.div {...containerMotion} className="max-w-2xl mx-auto px-4">
      <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient">
            Unit Converter
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quickly convert between common units.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2" role="tablist">
          {Object.entries(converters).map(([key, cat]) => (
            <motion.button
              key={key}
              type="button"
              role="tab"
              aria-selected={active === key}
              {...tabHoverTap}
              onClick={() => handleCategoryChange(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all ${
                active === key
                  ? "bg-gradient-brand text-white shadow-brand"
                  : "glass text-gray-600 dark:text-gray-300 hover:bg-white/40"
              }`}
            >
              <span className="text-gray-700 dark:text-gray-200">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Value input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Value
          </label>
          <input
            type="number"
            placeholder="Enter value"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult("");
              setError("");
            }}
            className="input-base w-full text-base sm:text-lg"
            aria-label="Value to convert"
          />
        </div>

        {/* From / To selection + swap */}
        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-2 items-stretch sm:items-end">
          <Dropdown
            id="from-unit"
            label="From"
            options={unitOptions}
            value={fromUnit}
            onChange={(val) => {
              setFromUnit(val);
              setResult("");
              setError("");
            }}
          />
          <div className="flex justify-center sm:justify-center items-center py-1 sm:pb-2 order-first sm:order-none">
            <motion.button
              type="button"
              {...swapBtnProps}
              onClick={handleSwap}
              className="glass w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:shadow-brand"
              aria-label="Swap units"
            >
              <SwapIcon />
            </motion.button>
          </div>
          <Dropdown
            id="to-unit"
            label="To"
            options={unitOptions}
            value={toUnit}
            onChange={(val) => {
              setToUnit(val);
              setResult("");
              setError("");
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            type="button"
            {...btnHoverTap}
            onClick={handleConvert}
            className="btn-primary flex-1 py-3"
          >
            Convert
          </motion.button>
          <motion.button
            type="button"
            {...btnHoverTap}
            onClick={handleClear}
            className="btn-secondary flex-1 py-3"
          >
            Reset
          </motion.button>
        </div>

        {/* Error */}
        {reducedMotion ? (
          error ? (
            <p className="text-red-500 text-sm text-center" role="alert">
              {error}
            </p>
          ) : null
        ) : (
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm text-center"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        )}

        {/* Result */}
        {reducedMotion ? (
          result ? (
            <div className="p-5 bg-brand-500/10 rounded-xl text-center border border-brand-500/20 backdrop-blur">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Converted Result
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 break-words">
                {value || "0"} {fromUnit} = {result} {toUnit}
              </p>
            </div>
          ) : null
        ) : (
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 bg-brand-500/10 rounded-xl text-center border border-brand-500/20 backdrop-blur"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Converted Result
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 break-words">
                  {value || "0"} {fromUnit} = {result} {toUnit}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}