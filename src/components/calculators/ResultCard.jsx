import { useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { getStanding } from "../../utils/grades";

export default function ResultCard({
  gpa,
  courses,
  credits,
  points,
  scale,
  darkMode,
}) {
  const numericGpa = parseFloat(gpa);
  const standing = useMemo(
    () => getStanding(numericGpa, scale),
    [numericGpa, scale]
  );
  const maxGPA = parseFloat(scale);
  const isHighGPA = numericGpa >= 3.5;

  const stats = useMemo(
    () => [
      { label: "Courses", value: courses },
      { label: "Credit hrs", value: credits },
      { label: "Quality pts", value: points },
    ],
    [courses, credits, points]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      role="region"
      aria-label={`GPA result: ${numericGpa.toFixed(2)} out of ${maxGPA}, standing: ${standing.t}`}
      className="relative mt-8 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 glass shadow-glass-lg"
    >
      {/* Top gradient line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-400 to-transparent" />

      {/* GPA Display Section */}
      <div className="px-6 py-8 md:py-10 text-center relative">
        {isHighGPA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 bg-gradient-brand blur-2xl pointer-events-none"
          />
        )}

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">
          Semester GPA
        </p>

        <div
          className={`text-6xl md:text-7xl font-extrabold font-mono tracking-tight ${
            isHighGPA
              ? "text-gradient text-shadow-glow"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          <AnimatedNumber value={gpa} />
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          out of {maxGPA}.00
        </p>

        {/* Standing badge */}
        <div className="mt-4">
          <span
            className="inline-block px-5 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-md"
            style={{
              backgroundColor: `${standing.color}15`,
              borderColor: `${standing.color}40`,
              color: standing.color,
            }}
          >
            {standing.t}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 border-t border-white/10 dark:border-white/5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`py-5 px-2 text-center transition-colors duration-200 ${
              i < stats.length - 1
                ? "border-r border-white/10 dark:border-white/5"
                : ""
            } hover:bg-white/5 dark:hover:bg-white/[0.03]`}
          >
            <div className="text-lg md:text-xl font-bold font-mono text-gray-900 dark:text-gray-100">
              {stat.value % 1 !== 0
                ? parseFloat(stat.value).toFixed(2)
                : stat.value}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}