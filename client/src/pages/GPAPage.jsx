// GPAPage.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import GPACalculator from "../components/calculators/GPACalculator";

export default function GPAPage() {
  useEffect(() => {
    document.title = "GPA Calculator - Maniesta";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <GPACalculator />
    </motion.div>
  );
}