// src/components/common/Modal.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared reduced‑motion hook ─────────────────────────────────── */
// (You can extract this to a shared utility later)
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

/* ── Focus trap (Tab / Shift+Tab loop) ──────────────────────────── */
function useFocusTrap(ref, isOpen) {
  const previousFocusRef = useRef(null);

  // Move focus into modal on open
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    // Small delay to let the modal mount / animate
    const timer = setTimeout(() => {
      const el = ref.current;
      if (!el) return;

      const focusable = el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) focusable.focus({ preventScroll: true });
      else el.focus({ preventScroll: true });
    }, 80);

    return () => clearTimeout(timer);
  }, [isOpen, ref]);

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Loop Tab / Shift+Tab inside the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key !== "Tab") return;

      const container = ref.current;
      if (!container) return;

      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, ref]);
}

/* ── Main Modal ─────────────────────────────────────────────────── */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  titleId,
  className = "",
}) {
  const modalRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useFocusTrap(modalRef, isOpen);

  // Lock body scroll & compensate for scrollbar disappearance
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  // Close on overlay click (not on content click)
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose?.();
    },
    [onClose],
  );

  // ── Styling constants ──────────────────────────────────────────
  const overlayBase = `fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm`;

  const modalBase = `glass relative w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[50vw]
    max-w-[640px] max-h-[85vh] max-h-[85dvh]
    rounded-2xl sm:rounded-3xl
    overflow-hidden flex flex-col
    shadow-glass-lg border border-white/20 dark:border-white/10
    pb-[env(safe-area-inset-bottom,0px)]`;

  const headerBase = `shrink-0 flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3
    border-b border-white/10 dark:border-white/10`;

  const closeButtonBase = `w-10 h-10 flex items-center justify-center rounded-full
    text-gray-500 dark:text-gray-400
    hover:bg-gray-200/40 dark:hover:bg-gray-700/40
    transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500`;

  const contentScroll = `flex-1 min-h-0 overflow-y-auto overscroll-contain
    p-4 sm:p-5 md:p-6`;

  // ── Shared close button ───────────────────────────────────────
  const CloseButton = (
    <button
      type="button"
      onClick={onClose}
      className={closeButtonBase}
      aria-label="Close dialog"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );

  // ── Reduced motion: static version ────────────────────────────
  if (reducedMotion) {
    return isOpen ? (
      <div
        className={overlayBase}
        onClick={handleOverlayClick}
        aria-modal="true"
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={!title ? (titleId || "Dialog") : undefined}
          className={`${modalBase} ${className}`}
        >
          <div className={headerBase}>
            {title ? (
              <h2
                id={titleId}
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
            ) : (
              <div /> // spacer
            )}
            {CloseButton}
          </div>

          <div className={contentScroll}>{children}</div>
        </div>
      </div>
    ) : null;
  }

  // ── Animated version ──────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={overlayBase}
          onClick={handleOverlayClick}
          aria-modal="true"
        >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={!title ? (titleId || "Dialog") : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={`${modalBase} ${className}`}
          >
            <div className={headerBase}>
              {title ? (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {title}
                </h2>
              ) : (
                <div />
              )}
              {CloseButton}
            </div>

            <div className={contentScroll}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}