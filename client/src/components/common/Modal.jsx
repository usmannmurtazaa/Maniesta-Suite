import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', handleKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            className="glass w-full max-w-lg p-6 sm:p-8 rounded-3xl max-h-[90vh] overflow-y-auto relative"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}