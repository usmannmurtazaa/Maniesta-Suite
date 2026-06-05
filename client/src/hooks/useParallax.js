// src/hooks/useParallax.js
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for smooth, performant parallax effects.
 *
 * Improvements:
 * - Uses `requestAnimationFrame` for silky‑smooth 60fps updates.
 * - Adds optional `throttle` (ms) to limit update frequency.
 * - Automatically pauses when the element is not visible (IntersectionObserver).
 * - Cleanly cancels all animations on unmount.
 * - Exposes a `reset` function to manually set offset to 0.
 *
 * @param {number} [speed=0.5] - Multiplier for the scroll position.
 * @param {Object} [options]
 * @param {number} [options.throttle=0] - Minimum time between updates (ms). 0 = every frame.
 * @param {boolean} [options.horizontal=false] - If true, parallax shifts horizontally.
 * @returns {{ ref: React.RefObject, offset: number, reset: () => void }}
 */
export function useParallax(speed = 0.5, { throttle = 0, horizontal = false } = {}) {
    const ref = useRef(null);
    const [offset, setOffset] = useState(0);
    const rafIdRef = useRef(null);
    const lastUpdateRef = useRef(0);
    const isVisibleRef = useRef(true);

    // Reset function
    const reset = useCallback(() => setOffset(0), []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // IntersectionObserver to pause parallax when element is off‑screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );
        observer.observe(element);

        const handleScroll = () => {
            if (!isVisibleRef.current) return;

            const now = performance.now();
            if (throttle > 0 && now - lastUpdateRef.current < throttle) {
                // Schedule a check for the next frame
                rafIdRef.current = requestAnimationFrame(handleScroll);
                return;
            }
            lastUpdateRef.current = now;

            const rect = element.getBoundingClientRect();
            const scrolled = window.scrollY;
            const elementTop = rect.top + scrolled;
            const scrollPosition = scrolled - elementTop + window.innerHeight;
            const newOffset = scrollPosition * speed;
            setOffset(horizontal ? newOffset : 0);
            // For horizontal, you'd typically use translateX; we just expose the offset number.

            rafIdRef.current = requestAnimationFrame(handleScroll);
        };

        // Kick off the animation loop
        rafIdRef.current = requestAnimationFrame(handleScroll);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            observer.disconnect();
        };
    }, [speed, throttle, horizontal]);

    return { ref, offset, reset };
}