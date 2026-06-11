import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * AnimatedNumber – Smoothly transitions between numeric values using cubic ease‑out.
 *
 * Features:
 * - Fully ref‑based animation (no state inside rAF) – zero flicker / jumps.
 * - Customisable decimals, duration, and grouping.
 * - Accessible via `aria-label` and live region; limits announcements during animation.
 * - Respects `reducedMotion` prop – skips animation and shows final value immediately.
 * - Handles negatives, NaN, and extremely fast value changes.
 *
 * @param {number|string} value - The target numeric value.
 * @param {number} decimals - Decimal places to display.
 * @param {number} duration - Animation duration in milliseconds.
 * @param {boolean} useGrouping - Whether to format with thousands separators.
 * @param {boolean} reducedMotion - If true, animation is disabled.
 */
export default function AnimatedNumber({
  value,
  decimals = 2,
  duration = 800,
  useGrouping = true,
  reducedMotion = false,
}) {
  const [display, setDisplay] = useState(() =>
    formatNumber(parseFloat(value) || 0, decimals, useGrouping),
  );
  // Track animation running state to control aria-live
  const [animating, setAnimating] = useState(false);

  // Refs for animation state (no stale closures)
  const rafIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(parseFloat(value) || 0);
  const targetValueRef = useRef(parseFloat(value) || 0);
  const currentAnimatedRef = useRef(parseFloat(value) || 0);

  // Main effect: react to value or reducedMotion changes
  useEffect(() => {
    const newTarget = parseFloat(value) || 0;

    // If reduced motion is preferred, show final value instantly
    if (reducedMotion) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      currentAnimatedRef.current = newTarget;
      targetValueRef.current = newTarget;
      setDisplay(formatNumber(newTarget, decimals, useGrouping));
      setAnimating(false);
      return;
    }

    // Animate only if target changed
    if (newTarget !== targetValueRef.current) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      startValueRef.current = currentAnimatedRef.current;
      targetValueRef.current = newTarget;
      startTimeRef.current = null;
      setAnimating(true);
      rafIdRef.current = requestAnimationFrame(animate);
    }
  }, [value, decimals, useGrouping, reducedMotion]); // include reducedMotion

  // Animation loop – pure refs, no external dependencies
  const animate = useCallback(
    (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // cubic ease‑out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current =
        startValueRef.current +
        (targetValueRef.current - startValueRef.current) * eased;

      currentAnimatedRef.current = current;
      setDisplay(formatNumber(current, decimals, useGrouping));

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        currentAnimatedRef.current = targetValueRef.current;
        setDisplay(formatNumber(targetValueRef.current, decimals, useGrouping));
        setAnimating(false);
        rafIdRef.current = null;
      }
    },
    [duration, decimals, useGrouping],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Memoize the exact target for aria-label
  const ariaValue = useMemo(
    () => parseFloat(value).toFixed(decimals),
    [value, decimals],
  );

  return (
    <span
      aria-label={ariaValue}
      role="status"
      aria-live={animating ? "off" : "polite"}
      style={{ whiteSpace: "nowrap" }}
    >
      {display}
    </span>
  );
}

// ── Helper ─────────────────────────────────────────────────────────
function formatNumber(num, decimals, grouping) {
  if (grouping) {
    try {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      // fallback to fixed
    }
  }
  return num.toFixed(decimals);
}
