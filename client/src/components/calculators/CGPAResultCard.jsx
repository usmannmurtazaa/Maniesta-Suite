import { motion } from 'framer-motion';

export default function CGPAResultCard({ cgpa, sems, total, best, scale, darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mt-6 text-center"
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Cumulative GPA
      </div>
      <div className="text-5xl font-extrabold text-gradient mb-3">
        {cgpa}
      </div>
      <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
        <div>Semesters: {sems.length}</div>
        <div>Best: {best.toFixed(2)}</div>
        <div>Scale: {scale.toFixed(1)}</div>
      </div>
    </motion.div>
  );
}