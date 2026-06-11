import { motion } from "framer-motion";
import CalculatorPanel from "../components/calculators/CalculatorPanel";
import SEO from "../components/SEO";

export default function CalculatorPage() {
  return (
    <>
      <SEO
        title="Scientific & Normal Calculator"
        description="Free online scientific calculator with trigonometry, logarithms, and basic arithmetic. Includes memory functions and history. No signup required."
        keywords={["scientific calculator", "normal calculator", "trigonometry", "logarithms", "online calculator", "math tools"]}
        canonicalUrl="https://maniestasuite.netlify.app/calculator"
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
            Calculator
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Normal & scientific modes with memory and history.
          </p>
        </div>

        {/* Calculator Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <CalculatorPanel />
        </motion.div>
      </motion.div>
    </>
  );
}