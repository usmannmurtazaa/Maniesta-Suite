import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import GPACalculator from "../components/calculators/GPACalculator";
import SEO from "../components/SEO"; // Import SEO component

const SCALES = [
  { value: "4.0", label: "4.0 Scale" },
  { value: "5.0", label: "5.0 Scale" },
  { value: "10.0", label: "10.0 Scale" },
];

export default function GPAPage() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const [scale, setScale] = useState("4.0");

  return (
    <>
      <SEO
        title="GPA Calculator"
        description="Calculate your semester GPA instantly with our free online GPA calculator. Supports 4.0, 5.0 and 10.0 scales. No signup required."
        keywords={["GPA calculator", "semester GPA", "grade point average", "college GPA", "university grades"]}
        canonicalUrl="https://maniestasuite.netlify.app/gpa"
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
            GPA Calculator
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Enter your courses and grades to instantly compute your semester GPA.
          </p>

          {/* Scale selector */}
          <div className="flex justify-center gap-2 mt-4">
            {SCALES.map((s) => (
              <motion.button
                key={s.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setScale(s.value)}
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

        {/* Calculator Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <GPACalculator scale={scale} darkMode={darkMode} />
        </motion.div>
      </motion.div>
    </>
  );
}