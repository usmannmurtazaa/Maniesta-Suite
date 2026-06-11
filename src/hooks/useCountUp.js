// src/hooks/useCountUp.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that animates a number from 0 to `end` over a given duration.
 *
 * Improvements:
 * - Respects `reducedMotion` option to skip animation.
 * - Uses mounted ref to prevent state updates after unmount.
 * - Stabilises `easing` via ref to avoid unnecessary re‑renders.
 * - Resets animation smoothly when `end` or `duration` changes.
 * - Cancels previous animation frames to prevent memory leaks.
 * - Uses `useCallback` for a stable `reset` function.
 * - Accepts optional `easing` function for custom curves.
 * - Formats the output with a customizable `formatter`.
 *
 * @param {number} end - Target value (must be a finite number).
 * @param {Object} options
 * @param {number} [options.duration=1.5] - Animation duration in seconds.
 * @param {number} [options.decimals=2] - Number of decimal places in the output string.
 * @param {function} [options.easing] - Easing function (t => t in [0,1]). Default easeOutCubic.
 * @param {function} [options.formatter] - Custom formatter (value, decimals) => string.
 * @param {boolean} [options.reducedMotion=false] - If true, animation is disabled.
 * @returns {{ value: string, reset: () => void }}
 */
export function useCountUp(
    end,
    {
        duration = 1.5,
        decimals = 2,
        easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        formatter = (val, dec) => val.toFixed(dec),
        reducedMotion = false,
    } = {}
) {
    const [value, setValue] = useState(() =>
        formatter(0, decimals)
    );
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const endValueRef = useRef(end);
    const mountedRef = useRef(true);
    const easingRef = useRef(easing);
    easingRef.current = easing; // keep easing stable without changing the animate callback

    // Keep end value stable in a ref to avoid recreating the effect callback
    endValueRef.current = end;

    // Animation loop – stable reference, no external state dependencies
    const animate = useCallback(
        (timestamp) => {
            if (!mountedRef.current) return;
            if (startTimeRef.current === null) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const current = easingRef.current(progress) * endValueRef.current;
            setValue(current);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // snap exactly to end
                setValue(endValueRef.current);
            }
        },
        [duration] // only depends on duration, easing is stable via ref
    );

    useEffect(() => {
        mountedRef.current = true;

        // Handle cases where end is not a valid number, or reduced motion is preferred
        if (
            typeof end !== 'number' ||
            isNaN(end) ||
            !isFinite(end) ||
            reducedMotion
        ) {
            setValue(end);
            return;
        }

        // Cancel any previous animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        // Reset starting point
        startTimeRef.current = null;
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            mountedRef.current = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [end, animate, reducedMotion]);

    // Reset function (optional – can be exposed if needed)
    const reset = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        startTimeRef.current = null;
        setValue(0);
    }, []);

    const formattedValue = formatter(value, decimals);

    return { value: formattedValue, reset };
}