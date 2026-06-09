import { motion } from "framer-motion";
import AboutSection from "../components/about/AboutSection";

export default function AboutPage() {
  return (
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
          About Maniesta Suite
        </motion.h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Our mission, vision, and the story behind the tools.
        </p>
      </div>

      {/* About Content Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
      >
        <AboutSection />
      </motion.div>
    </motion.div>
  );
}