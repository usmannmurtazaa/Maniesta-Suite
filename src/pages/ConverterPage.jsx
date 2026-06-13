import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConverterModule from "../components/calculators/ConverterModule";
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

export default function ConverterPage() {
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
        title="Unit Converter"
        description="Convert between length, weight, temperature, currency, area, time, and speed. Free online unit converter for students and professionals."
        keywords="unit converter, length converter, weight converter, temperature converter, currency converter, area converter, time converter, speed converter"
        canonicalUrl="https://maniestasuite.netlify.app/converter"
      />
      <motion.div {...containerMotion} className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <motion.h1
            {...headingMotion}
            className="font-hero text-4xl md:text-5xl font-extrabold text-gradient"
          >
            Unit Converter
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Convert between length, weight, temperature, currency, and more.
          </p>
        </div>

        {/* Converter Card */}
        <motion.div
          {...cardMotion}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <ConverterModule />
        </motion.div>
      </motion.div>
    </>
  );
}
