import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Local hook to detect reduced‑motion preference.
 * (Can be extracted to a shared utility later.)
 */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) {
  const reducedMotion = usePrefersReducedMotion();

  // Determine the underlying component (div or button)
  const Comp = onClick ? motion.button : motion.div;

  // Only apply motion effects if the card is interactive and motion is allowed
  const motionProps =
    hoverable && !reducedMotion
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        }
      : {};

  // The "hoverable" CSS class – exclude translate animation when reduced motion
  const hoverClass =
    hoverable && !reducedMotion
      ? 'cursor-pointer hover:shadow-glass-lg hover:-translate-y-0.5'
      : hoverable
        ? 'cursor-pointer'
        : '';

  return (
    <Comp
      // Prevent accidental form submission when used as a button
      type={Comp === motion.button ? 'button' : undefined}
      className={`glass-card p-6 ${hoverClass} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}