import { motion } from "framer-motion";
import InterestCalculator from "../components/calculators/InterestCalculator";
import SEO from "../components/SEO";

export default function InterestPage() {
  return (
    <>
      <SEO
        title="Interest Calculator"
        description="Calculate simple interest, compound interest, and loan EMI payments. Free online interest calculator for students and professionals."
        keywords={["interest calculator", "simple interest", "compound interest", "loan EMI", "financial calculator"]}
        canonicalUrl="https://maniestasuite.netlify.app/interest"
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
            Interest Calculator
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Compute simple interest, compound growth, or monthly loan payments.
          </p>
        </div>

        {/* Calculator Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <InterestCalculator />
        </motion.div>
      </motion.div>
    </>
  );
}