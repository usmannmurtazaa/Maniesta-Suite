import { motion } from 'framer-motion';

export default function ResultCard({ gpa, courses, credits, points, scale }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-card p-6 mt-6 text-center"
    >
      <div className="text-4xl font-bold text-gradient">{gpa}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cumulative GPA</p>
      <div className="flex justify-center gap-8 mt-4 text-sm">
        <div>
          <span className="font-mono text-gray-900 dark:text-white">{courses}</span>
          <span className="ml-1 text-gray-500">courses</span>
        </div>
        <div>
          <span className="font-mono text-gray-900 dark:text-white">{credits}</span>
          <span className="ml-1 text-gray-500">credits</span>
        </div>
        <div>
          <span className="font-mono text-gray-900 dark:text-white">{points.toFixed(1)}</span>
          <span className="ml-1 text-gray-500">points</span>
        </div>
      </div>
    </motion.div>
  );
}