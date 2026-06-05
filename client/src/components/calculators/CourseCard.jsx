// CourseCard.jsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { GRADES } from "../../utils/grades";

export default function CourseCard({
  id,
  index,
  removable,
  onRemove,
  data,
  onChange,
  scale,
  darkMode,
}) {
  const gradeOptions = useMemo(() => {
    const list = GRADES; // already sorted best first
    return list.map((grade, idx) => ({ value: idx, label: grade.g }));
  }, []);

  const isDark = darkMode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative glass-card p-4 md:p-5 mb-4 group ${
        isDark ? "border-white/10" : "border-black/10"
      } hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}
      role="group"
      aria-label={`Course ${index + 1}${data.code ? ": " + data.code : ""}`}
    >
      {/* Course number badge */}
      <span
        className="absolute -top-3 left-4 bg-gradient-to-r from-brand-500 to-purple-400 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-md z-10"
        aria-hidden="true"
      >
        COURSE {index + 1}
      </span>

      {/* Remove button */}
      {removable && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-red-500 hover:bg-red-500/30 transition-colors z-10"
          aria-label={`Remove course ${index + 1}`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {/* Course Code */}
        <div>
          <label
            htmlFor={`course-code-${id}`}
            className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Course Code
          </label>
          <input
            id={`course-code-${id}`}
            type="text"
            value={data.code}
            maxLength={12}
            placeholder="e.g. CS-301"
            onChange={(e) => onChange(id, "code", e.target.value)}
            className="input-base"
            aria-describedby={`code-hint-${id}`}
          />
          <span id={`code-hint-${id}`} className="sr-only">
            Enter the course code, like CS-301
          </span>
        </div>

        {/* Credits */}
        <div>
          <label
            htmlFor={`course-credits-${id}`}
            className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Credits
          </label>
          <select
            id={`course-credits-${id}`}
            value={data.credits}
            onChange={(e) =>
              onChange(id, "credits", parseInt(e.target.value, 10))
            }
            className="select-base"
          >
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <option key={c} value={c}>
                {c} cr
              </option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <label
            htmlFor={`course-grade-${id}`}
            className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Grade
          </label>
          <select
            id={`course-grade-${id}`}
            value={data.gradeIdx}
            onChange={(e) =>
              onChange(id, "gradeIdx", parseInt(e.target.value, 10))
            }
            className="select-base"
          >
            {gradeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
