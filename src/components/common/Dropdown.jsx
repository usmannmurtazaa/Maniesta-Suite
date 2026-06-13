// src/components/common/Dropdown.jsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

/* ── Stable unique ID generator ─────────────────────────────────── */
let uidCounter = 0;
const nextUid = () => `dropdown-${++uidCounter}`;

/* ── Reduced‑motion hook ────────────────────────────────────────── */
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

/* ── Icons ──────────────────────────────────────────────────────── */
const Chevron = ({ open }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.15, ease: "easeInOut" }}
    className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </motion.svg>
);

const CheckIcon = () => (
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

/* ── Positioning utility (viewport coordinates) ─────────────────── */
function computePortalPosition(triggerRect, listHeight = 280, margin = 4) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceBelow = vh - triggerRect.bottom - margin;
  const spaceAbove = triggerRect.top - margin;

  let top, maxHeight;

  if (spaceBelow >= 200 || spaceBelow >= spaceAbove) {
    top = triggerRect.bottom + margin;
    maxHeight = Math.min(listHeight, spaceBelow);
  } else {
    maxHeight = Math.min(listHeight, spaceAbove);
    top = triggerRect.top - maxHeight - margin;
  }

  if (top < margin) {
    maxHeight -= margin - top;
    top = margin;
  }
  maxHeight = Math.max(44, Math.floor(maxHeight));

  let left = triggerRect.left;
  let width = triggerRect.width;

  if (left + width + margin > vw) {
    left = vw - width - margin;
    if (left < margin) {
      left = margin;
      width = vw - margin * 2;
    }
  }

  return { top, left, width: Math.max(width, 0), maxHeight };
}

/* ── Main component ─────────────────────────────────────────────── */
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
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, maxHeight: 0 });

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const portalRef = useRef(null);

  const uid = useRef(id || nextUid());
  const buttonId = `${uid.current}-button`;
  const listboxId = `${uid.current}-listbox`;

  const reducedMotion = usePrefersReducedMotion();

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value]
  );

  // ── Position updater ──────────────────────────────────────────
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos(computePortalPosition(rect));
  }, []);

  // ── Close & focus return ──────────────────────────────────────
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // ── Outside click / focus ─────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inside =
        containerRef.current?.contains(e.target) ||
        portalRef.current?.contains(e.target);
      if (!inside) close();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("focusin", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("focusin", handler);
    };
  }, [open, close]);

  // ── Reposition on scroll / resize / button size change ─────────
  useEffect(() => {
    if (!open) return;
    updatePosition();
    const ro = new ResizeObserver(updatePosition);
    ro.observe(buttonRef.current);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // ── Active index init ─────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  // ── Scroll active option into view ────────────────────────────
  useEffect(() => {
    if (open && activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex];
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleSelect = useCallback(
    (val) => {
      onChange(val);
      close();
    },
    [onChange, close]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!open) {
        if (["Enter", " ", "ArrowDown"].includes(e.key)) {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((p) => Math.min(p + 1, options.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((p) => Math.max(p - 1, 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (options[activeIndex]) handleSelect(options[activeIndex].value);
          break;
      }
    },
    [open, options, activeIndex, handleSelect, close]
  );

  const getOptionId = useCallback(
    (idx) => `${listboxId}-option-${idx}`,
    [listboxId]
  );

  // ── Animation variants (super fast, no stagger) ────────────────
  const dropdownVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.98, y: -4 },
        animate: { opacity: 1, scale: 1, y: 0 },
      };

  // ── Portal content ────────────────────────────────────────────
  const dropdownContent = open ? (
    <motion.div
      ref={portalRef}
      role="listbox"
      aria-label={label || "Select option"}
      className="glass rounded-xl overflow-hidden"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: pos.width || "auto",
        maxHeight: pos.maxHeight,
        zIndex: 9999,
      }}
      variants={dropdownVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <ul
        ref={listRef}
        className="relative overflow-y-auto py-1"
        role="presentation"
      >
        {options.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-400 italic">
            No options available
          </li>
        ) : (
          options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <li key={opt.value} role="presentation">
                <button
                  id={getOptionId(idx)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors duration-75 ${optionClassName} ${
                    isSelected
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium"
                      : isActive
                        ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && <CheckIcon />}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </motion.div>
  ) : null;

  // ── Render ────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={buttonId}
          className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
        >
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        onClick={() => setOpen((p) => !p)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open && activeIndex >= 0 ? getOptionId(activeIndex) : undefined
        }
      >
        <span
          className={
            selectedOption
              ? "text-gray-900 dark:text-white truncate"
              : "text-gray-400 truncate"
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <Chevron open={open} />
      </button>

      {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
    </div>
  );
}