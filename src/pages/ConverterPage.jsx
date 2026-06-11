import { motion } from "framer-motion";
import ConverterModule from "../components/calculators/ConverterModule";
import SEO from "../components/SEO";

export default function ConverterPage() {
  return (
    <>
      <SEO
        title="Unit Converter"
        description="Convert between length, weight, temperature, currency, area, time, and speed. Free online unit converter for students and professionals."
        keywords={["unit converter", "length converter", "weight converter", "temperature converter", "currency converter", "area converter", "time converter", "speed converter"]}
        canonicalUrl="https://maniestasuite.netlify.app/converter"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Page Header */}
        <div className="text-center space-y-3">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold text-gradient"
          >
            Unit Converter
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Convert between length, weight, temperature, currency, and more.
          </p>
        </div>

        {/* Converter Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <ConverterModule />
        </motion.div>
      </motion.div>
    </>
  );
}