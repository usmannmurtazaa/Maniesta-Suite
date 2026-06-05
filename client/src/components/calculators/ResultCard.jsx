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
    [numericGpa, scale],
  );
  const maxGPA = parseFloat(scale);
  const isDark = darkMode;

  const stats = useMemo(
    () => [
      { label: "Courses", value: courses },
      { label: "Credit hrs", value: credits },
      { label: "Quality pts", value: points },
    ],
    [courses, credits, points],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      role="region"
      aria-label={`GPA result: ${numericGpa.toFixed(2)} out of ${maxGPA}, standing: ${standing.t}`}
      className={`mt-8 rounded-2xl overflow-hidden border backdrop-blur-xl ${
        isDark
          ? "border-purple-500/20 bg-gradient-to-b from-indigo-950/60 to-slate-900/80 shadow-2xl shadow-black/30"
          : "border-purple-500/20 bg-gradient-to-b from-white/80 to-gray-50/90 shadow-xl shadow-black/5"
      }`}
    >
      {/* Top gradient line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

      {/* GPA Display Section */}
      <div className="px-6 py-8 md:py-10 text-center relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">
          Semester GPA
        </p>

        <div
          className={`text-6xl md:text-7xl font-extrabold font-mono tracking-tight ${
            isDark ? "text-purple-300" : "text-purple-600"
          }`}
          style={{
            textShadow: isDark
              ? "0 0 30px rgba(167,139,250,0.3)"
              : "0 0 20px rgba(124,58,237,0.1)",
          }}
        >
          <AnimatedNumber value={gpa} />
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          out of {maxGPA}.00
        </p>

        {/* Standing badge */}
        <div className="mt-4">
          <span
            className="inline-block px-5 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md"
            style={{
              backgroundColor: `${standing.color}20`,
              borderColor: `${standing.color}50`,
              color: standing.color,
              borderWidth: 1,
            }}
          >
            {standing.t}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-3 border-t ${isDark ? "border-white/5" : "border-black/5"}`}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`py-4 px-2 text-center transition-colors duration-200 ${
              i < stats.length - 1
                ? isDark
                  ? "border-r border-white/5"
                  : "border-r border-black/5"
                : ""
            } ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-black/[0.02]"}`}
          >
            <div
              className={`text-lg md:text-xl font-bold font-mono ${isDark ? "text-purple-100" : "text-gray-800"}`}
            >
              {stat.value % 1 !== 0
                ? parseFloat(stat.value).toFixed(2)
                : stat.value}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
