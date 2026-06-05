import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'info', onClose, darkMode }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-[999] px-6 py-3 rounded-xl border backdrop-blur-md shadow-lg ${bgMap[type]}`}
          role="alert"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="text-lg leading-none opacity-60 hover:opacity-100">&times;</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}