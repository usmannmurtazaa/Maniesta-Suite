// src/components/ai-chat/ChatButton.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

export default function ChatButton({ onClick, isOpen }) {
  const reducedMotion = usePrefersReducedMotion();

  const motionProps = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
      };

  return (
    <motion.button
      type="button"
      {...motionProps}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-brand text-white shadow-brand-lg flex items-center justify-center hover:shadow-xl transition-all"
      aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </motion.button>
  );
}