import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getGradeScale } from "../../utils/grades";
import Dropdown from "../common/Dropdown";

// -------------------------------------------------------------------
// Local hook: detect reduced motion preference
// (Can be extracted to a shared utility later.)
// -------------------------------------------------------------------
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}

// ── Dynamic grade colour helper ────────────────────────────────
// Maps a grade's point value relative to the maximum possible points
// in the selected scale to a colour that moves from red → amber → emerald.
function getGradeColor(points, maxPoints) {
  if (!maxPoints || maxPoints <= 0) return "text-gray-400";
  const ratio = points / maxPoints;
  if (ratio >= 0.9) return "text-emerald-400";
  if (ratio >= 0.7) return "text-blue-400";
  if (ratio >= 0.5) return "text-amber-400";
  if (ratio >= 0.3) return "text-orange-400";
  return "text-red-400";
}

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
  const reducedMotion = usePrefersReducedMotion();

  // Credit options unchanged
  const creditOptions = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].map((c) => ({
        value: c,
        label: `${c} credit${c > 1 ? "s" : ""}`,
      })),
    [],
  );

  // Grade options now derived from the selected scale (not static GRADES)
  const gradeOptions = useMemo(() => {
    const gradeScale = getGradeScale(scale);
    const maxPoints = Math.max(...gradeScale.map((g) => g.p), 0);
    return gradeScale.map((grade, idx) => ({
      value: idx,
      label: grade.g,
      color: getGradeColor(grade.p, maxPoints),
    }));
  }, [scale]);

  // Motion props that respect reduced motion
  const cardEntryMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10, scale: 0.98 },
      };
  const removeBtnHover = reducedMotion ? {} : { whileHover: { scale: 1.15 } };
  const removeBtnTap = reducedMotion ? {} : { whileTap: { scale: 0.9 } };
  const cardHoverClass = reducedMotion ? "" : "hover:-translate-y-1";

  return (
    <motion.div
      layout
      transition={{ duration: 0.2 }}
      {...cardEntryMotion}
      className={`relative glass-card p-5 md:p-6 mb-4 group ${cardHoverClass} hover:shadow-glass-lg transition-all duration-300`}
      role="group"
      aria-label={`Course ${index + 1}${data.code ? ": " + data.code : ""}`}
    >
      {/* Course number badge */}
      <span
        className="absolute -top-3 left-5 bg-gradient-to-r from-brand-500 to-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-brand z-10"
        aria-hidden="true"
      >
        COURSE {index + 1}
      </span>

      {/* Remove button – enlarged to 44×44 px touch target */}
      {removable && (
        <motion.button
          type="button"
          {...removeBtnHover}
          {...removeBtnTap}
          onClick={() => onRemove(id)}
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-red-500 hover:bg-red-500/30 transition-colors z-10"
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
        </motion.button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
        {/* Course Code */}
        <div>
          <label
            htmlFor={`course-code-${id}`}
            className="block text-caption font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
          >
            Course Code
          </label>
          <input
            id={`course-code-${id}`}
            type="text"
            value={data.code}
            maxLength={12}
            placeholder="e.g. ABC-123"
            onChange={(e) => onChange(id, "code", e.target.value)}
            className="input-base w-full focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all"
            aria-describedby={`code-hint-${id}`}
          />
          <span id={`code-hint-${id}`} className="sr-only">
            Enter the course code, like ABC-123
          </span>
        </div>

        {/* Credits – Custom Dropdown */}
        <Dropdown
          id={`course-credits-${id}`}
          label="Credits"
          options={creditOptions}
          value={data.credits}
          onChange={(val) => onChange(id, "credits", val)}
          className="w-full"
        />

        {/* Grade – Custom Dropdown (now scale‑aware) */}
        <Dropdown
          id={`course-grade-${id}`}
          label="Grade"
          options={gradeOptions}
          value={data.gradeIdx}
          onChange={(val) => onChange(id, "gradeIdx", val)}
          className="w-full"
          optionClassName={
            gradeOptions.find((o) => o.value === data.gradeIdx)?.color || ""
          }
        />
      </div>
    </motion.div>
  );
}