import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function NotFound() {
  const reducedMotion = usePrefersReducedMotion();

  // Motion props – empty when reduced motion is preferred
  const containerProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
      };

  const headingProps = reducedMotion
    ? {}
    : {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
      };

  const textProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 },
      };

  const buttonProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4 },
      };

  // Blob animations – static if reduced motion
  const blob1 = reducedMotion
    ? {}
    : {
        animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] },
        transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      };

  const blob2 = reducedMotion
    ? {}
    : {
        animate: { scale: [1.1, 0.9, 1.1], opacity: [0.4, 0.2, 0.4] },
        transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
      };

  return (
    <motion.div
      {...containerProps}
      className="min-h-[70vh] flex items-center justify-center px-4 relative"
    >
      {/* Floating background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          {...blob1}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
          {...blob2}
        />
      </div>

      <div className="text-center glass-card p-10 md:p-16 max-w-lg w-full relative z-10">
        <motion.h1
          {...headingProps}
          className="font-hero text-7xl md:text-8xl font-extrabold text-gradient mb-4"
        >
          404
        </motion.h1>
        <motion.p
          {...textProps}
          className="text-lg text-gray-600 dark:text-gray-400 mb-8"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        <motion.div {...buttonProps}>
          <Link to="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}