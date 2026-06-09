// src/hooks/useCountUp.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that animates a number from 0 to `end` over a given duration.
 *
 * Improvements:
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
 * @returns {{ value: string, reset: () => void }}
 */
export function useCountUp(
    end,
    {
        duration = 1.5,
        decimals = 2,
        easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        formatter = (val, dec) => val.toFixed(dec),
    } = {}
) {
    const [value, setValue] = useState(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const endValueRef = useRef(end);

    // Keep end value stable in a ref to avoid recreating the effect callback
    endValueRef.current = end;

    const animate = useCallback(
        (timestamp) => {
            if (startTimeRef.current === null) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const current = easing(progress) * endValueRef.current;
            setValue(current);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setValue(endValueRef.current); // snap exactly to end
            }
        },
        [duration, easing]
    );

    useEffect(() => {
        // Handle cases where end is not a valid number
        if (typeof end !== 'number' || isNaN(end) || !isFinite(end)) {
            setValue(0);
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
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [end, animate]);

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