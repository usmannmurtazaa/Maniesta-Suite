// CGPAPage.jsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CGPACalculator from '../components/calculators/CGPACalculator';

export default function CGPAPage() {
  useEffect(() => {
    document.title = 'CGPA Calculator - Maniesta';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <CGPACalculator />
    </motion.div>
  );
}