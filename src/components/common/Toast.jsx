import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export default function Toast({ message, type = 'info', onClose, darkMode }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;
    setProgress(100);
    const duration = 4000;
    const interval = 50; // update progress every 50ms
    const steps = duration / interval;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setProgress(100 - (step / steps) * 100);
      if (step >= steps) {
        clearInterval(timer);
        onClose?.();
      }
    }, interval);
    return () => clearInterval(timer);
  }, [message, onClose]);

  const bgMap = {
    success: 'bg-green-500/20 border-green-500/50 text-green-800 dark:text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-800 dark:text-red-200',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-800 dark:text-blue-200',
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed top-4 right-4 z-[999] px-5 py-3 rounded-xl border backdrop-blur-md shadow-glass-lg min-w-[280px] max-w-md ${bgMap[type]}`}
          role="alert"
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0">{icons[type]}</span>
            <span className="text-sm font-medium flex-1">{message}</span>
            <button
              onClick={onClose}
              className="text-lg leading-none opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-current opacity-40 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}