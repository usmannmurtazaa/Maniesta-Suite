import { useMemo } from "react";
import { motion } from "framer-motion";

export default function CelebrationOverlay({ show }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        delay: Math.random() * 0.3,
        duration: 0.6 + Math.random() * 0.4,
        size: 8 + Math.random() * 12,
      })),
    []
  );

  if (!show) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-30"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: -80,
            x: p.x,
            scale: [0, 1, 0.8],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `hsl(${260 + p.id * 25}, 80%, 65%)`,
            boxShadow: "0 0 10px rgba(99,102,241,0.5)",
          }}
        />
      ))}
    </div>
  );
}