import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "../common/Confetti";

/**
 * Local hook to detect reduced‑motion preference.
 * (Can be extracted to a shared utility later.)
 */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}

export default function CelebrationOverlay({ show }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Do not render anything if motion is disabled or the overlay is not triggered
  if (!show || reducedMotion) return null;

  return (
    <>
      <Confetti active={showConfetti} duration={2000} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: -100 - Math.random() * 60,
              x: (Math.random() - 0.5) * 200,
              scale: [0, 1.2, 0.8],
            }}
            transition={{
              delay: Math.random() * 0.4,
              duration: 0.8 + Math.random() * 0.5,
              ease: "easeOut",
            }}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 10 + Math.random() * 16,
              height: 10 + Math.random() * 16,
              background: `hsl(${240 + i * 12}, 80%, 65%)`,
              boxShadow: "0 0 15px rgba(99,102,241,0.6)",
            }}
          />
        ))}
      </div>
    </>
  );
}