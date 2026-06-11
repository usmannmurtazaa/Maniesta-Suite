import { forwardRef, useState, useEffect } from 'react';
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

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

const Button = forwardRef(function Button(
  { children, variant = 'primary', className = '', ...props },
  ref
) {
  const baseClass = variants[variant] || variants.primary;
  const reducedMotion = usePrefersReducedMotion();

  // Default type to 'button' to prevent accidental form submissions
  const { type = 'button', ...restProps } = props;

  // Disable hover/tap animations if reduced motion is preferred
  const motionProps = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.96 },
      };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={`${baseClass} ${className}`}
      {...motionProps}
      {...restProps}
    >
      {children}
    </motion.button>
  );
});

export default Button;