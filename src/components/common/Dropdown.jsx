import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  label,
  id,
  className = "",
  optionClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      const idx = options.findIndex((opt) => opt.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside, options, value]);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (["Enter", " ", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          onChange(options[activeIndex].value);
          setIsOpen(false);
        }
        break;
    }
  };

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  // Chevron icon – static rotation when reduced motion
  const Chevron = reducedMotion ? (
    <svg
      className="w-4 h-4 text-gray-400 shrink-0 ml-2"
      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ) : (
    <motion.svg
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="w-4 h-4 text-gray-400 shrink-0 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </motion.svg>
  );

  // Checkmark – static when reduced motion
  const renderCheckmark = () => {
    const icon = (
      <svg
        className="w-4 h-4 text-brand-500 ml-2 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    );
    if (reducedMotion) return icon;
    return (
      <motion.svg
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-4 h-4 text-brand-500 ml-2 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 13l4 4L19 7" />
      </motion.svg>
    );
  };

  // Options list – static or animated
  const renderDropdownList = () => {
    if (!isOpen) return null;
    if (reducedMotion) {
      return (
        <div
          className="absolute z-50 mt-2 w-full glass shadow-glass-lg rounded-xl overflow-hidden border border-white/20 dark:border-white/10"
          role="listbox"
          aria-label={label || "Select option"}
        >
          <ul
            ref={listRef}
            className="max-h-52 overflow-y-auto py-1"
            role="presentation"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${optionClassName} ${
                    isSelected
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium"
                      : isActive
                        ? "bg-white/10 dark:bg-white/5 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-white/5"
                  }`}
                >
                  {opt.icon && <span className="mr-2 text-lg">{opt.icon}</span>}
                  <span className="flex-1">{opt.label}</span>
                  {opt.sub && (
                    <span className="text-xs text-gray-400 ml-2">
                      {opt.sub}
                    </span>
                  )}
                  {isSelected && renderCheckmark()}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute z-50 mt-2 w-full glass shadow-glass-lg rounded-xl overflow-hidden border border-white/20 dark:border-white/10"
          role="listbox"
          aria-label={label || "Select option"}
        >
          <ul
            ref={listRef}
            className="max-h-52 overflow-y-auto py-1"
            role="presentation"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${optionClassName} ${
                    isSelected
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium"
                      : isActive
                        ? "bg-white/10 dark:bg-white/5 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-white/5"
                  }`}
                >
                  {opt.icon && <span className="mr-2 text-lg">{opt.icon}</span>}
                  <span className="flex-1">{opt.label}</span>
                  {opt.sub && (
                    <span className="text-xs text-gray-400 ml-2">
                      {opt.sub}
                    </span>
                  )}
                  {isSelected && renderCheckmark()}
                </li>
              );
            })}
          </ul>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
        >
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={
            selectedOption ? "text-gray-900 dark:text-white" : "text-gray-400"
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>
        {Chevron}
      </button>

      {renderDropdownList()}
    </div>
  );
}
