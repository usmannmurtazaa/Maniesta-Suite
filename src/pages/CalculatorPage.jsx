import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CalculatorPanel from "../components/calculators/CalculatorPanel";
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

export default function CalculatorPage() {
  const prefersReducedMotion = usePrefersReducedMotion();

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

  return (
    <>
      <SEO
        title="Scientific & Normal Calculator"
        description="Free online scientific calculator with trigonometry, logarithms, and basic arithmetic. Includes memory functions and history. No signup required."
        keywords="scientific calculator, normal calculator, trigonometry, logarithms, online calculator, math tools"
        canonicalUrl="https://maniestasuite.netlify.app/calculator"
      />
      <motion.div
        {...containerMotion}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Page Header */}
        <div className="text-center space-y-3">
          <motion.h1
            {...headingMotion}
            className="text-4xl md:text-5xl font-extrabold text-gradient"
          >
            Calculator
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Normal & scientific modes with memory and history.
          </p>
        </div>

        {/* Calculator Card */}
        <motion.div
          {...cardMotion}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <CalculatorPanel />
        </motion.div>
      </motion.div>
    </>
  );
}