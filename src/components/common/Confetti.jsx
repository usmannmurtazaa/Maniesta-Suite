import { useEffect, useRef, useState } from "react";

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

export default function Confetti({ active, duration = 2000 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!active || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 120;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: 6 + Math.random() * 10,
      speedX: (Math.random() - 0.5) * 2,
      speedY: 3 + Math.random() * 6,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));

    let startTime = performance.now();
    let frameId;

    const draw = (now) => {
      if (!ctx) return;
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(frameId);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > height + 50) p.y = -50;
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [active, duration, reducedMotion]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!active || reducedMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
}