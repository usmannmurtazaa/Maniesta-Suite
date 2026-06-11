import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import CGPACalculator from "../components/calculators/CGPACalculator";
import SEO from "../components/SEO";

/**
 * Local hook to detect the user’s motion preference.
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

const SCALES = [
  { value: "4.0", label: "4.0 Scale" },
  { value: "5.0", label: "5.0 Scale" },
  { value: "10.0", label: "10.0 Scale" },
];

export default function CGPAPage() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const [scale, setScale] = useState("4.0");
  const prefersReducedMotion = usePrefersReducedMotion();

  // Conditional motion props – empty when reduced motion is preferred
  const containerMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
      };

  const headingMotion = prefersReducedMotion
    ? {}
    : {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
      };

  const cardMotion = prefersReducedMotion
    ? {}
    : {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2 },
      };

  // Button motion props – disabled when reduced motion
  const buttonHoverProps = prefersReducedMotion ? {} : { whileHover: { scale: 1.05 } };
  const buttonTapProps = prefersReducedMotion ? {} : { whileTap: { scale: 0.95 } };

  return (
    <>
      <SEO
        title="CGPA Calculator"
        description="Calculate your cumulative CGPA across multiple semesters. Free online CGPA calculator for 4.0, 5.0 and 10.0 scales. No signup required."
        keywords="CGPA calculator, cumulative GPA, overall GPA, CGPA, semester GPA average"
        canonicalUrl="https://maniestasuite.netlify.app/cgpa" 
      />
      <motion.div {...containerMotion} className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <motion.h1
            {...headingMotion}
            className="text-4xl md:text-5xl font-extrabold text-gradient"
          >
            CGPA Calculator
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Enter your semester GPAs to compute your cumulative CGPA.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {SCALES.map((s) => (
              <motion.button
                key={s.value}
                type="button"
                {...buttonHoverProps}
                {...buttonTapProps}
                onClick={() => setScale(s.value)}
                aria-pressed={scale === s.value}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  scale === s.value
                    ? "bg-gradient-brand text-white shadow-brand"
                    : "glass text-gray-600 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                {s.label}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          {...cardMotion}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <CGPACalculator scale={scale} />
        </motion.div>
      </motion.div>
    </>
  );
}