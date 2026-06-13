// src/components/calculators/GPACalculator.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGPA } from "../../hooks/useGPA";
import { GRADES, SCALES } from "../../utils/grades";
import { generatePDFBlob, generateCSVBlob } from "../../utils/exportHelpers";
import { logEvent } from "../../services/firebase";
import { trackExport } from "../../services/exportTracker";
import { useDashboard } from "../../contexts/DashboardProvider";
import CourseCard from "./CourseCard";
import ResultCard from "./ResultCard";
import { GradeProgressBar, TargetGPACalculator } from "./GradeExtras";
import ExportModal from "./ExportModal";
import Toast from "../common/Toast";
import CelebrationOverlay from "./CelebrationOverlay";

// -------------------------------------------------------------------
// Local hook: detect reduced motion preference
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

// SVG error alert icon – no emojis
const ErrorAlertIcon = () => (
  <svg
    className="w-5 h-5 text-red-500 shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// -------------------------------------------------------------------
// Grade scale lookup
const useGradeScale = (scale) =>
  useMemo(() => SCALES[scale] || GRADES, [scale]);

export default function GPACalculator({ scale, darkMode }) {
  const { saveGPA } = useDashboard();
  const reducedMotion = usePrefersReducedMotion();

  const {
    courses,
    addCourse,
    removeCourse,
    updateCourse,
    calculate,
    result,
    error,
  } = useGPA(scale);

  const gradeScale = useGradeScale(scale);

  const [showTargetGPA, setShowTargetGPA] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCalculate = useCallback(() => {
    if (courses.length < 2) {
      setToast({
        message: "Add at least two courses to calculate GPA.",
        type: "info",
      });
      return;
    }
    setCalculating(true);
    calculate();
    logEvent("gpa_calculated", {
      scale,
      courses_count: courses.length,
      timestamp: new Date().toISOString(),
    });
    setCalculating(false);
  }, [calculate, scale, courses.length]);

  // Save GPA to dashboard whenever result changes
  useEffect(() => {
    if (result) {
      saveGPA({
        gpa: result.gpa,
        credits: result.credits,
        timestamp: Date.now(),
      });
    }
  }, [result, saveGPA]);

  useEffect(() => {
    if (result && result.gpa >= 3.5) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  // Export handler
  const handleExport = useCallback(
    async (exportUserData) => {
      setIsExporting(true);
      setToast({ message: "", type: "" });

      const baseData = {
        ...exportUserData,
        degree: exportUserData.degree,
        scale,
        courses: courses.map((c) => ({
          code: c.code || "—",
          credits: String(c.credits),
          grade: gradeScale[c.gradeIdx]?.g || "N/A",
          points: gradeScale[c.gradeIdx]?.p?.toFixed(2) || "0.00",
        })),
        gpaResult: result,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      try {
        const pdfBlob = await generatePDFBlob(baseData);
        const csvBlob = generateCSVBlob(baseData);
        setIsExporting(false);

        trackExport({
          studentName: exportUserData.fullName || "",
          studentId: exportUserData.studentId || "",
          university: exportUserData.university || "",
          degree: exportUserData.degree || "",
          semester: exportUserData.semester || "",
          scale,
          gpa: result?.gpa || 0,
          credits: result?.credits || 0,
          date: baseData.date,
          exportType: "both",
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          },
        }).catch((err) => {
          console.error("Firestore save failed (non‑blocking):", err);
          setToast({
            message: "Report saved locally but cloud backup failed.",
            type: "info",
          });
        });

        logEvent("export_triggered", {
          format: "both",
          scale,
          gpa: result?.gpa,
        });

        return { pdfBlob, csvBlob };
      } catch (err) {
        console.error("Export generation failed:", err);
        setIsExporting(false);
        setToast({
          message: "Failed to generate files. Please try again.",
          type: "error",
        });
        throw err;
      }
    },
    [courses, scale, result, gradeScale],
  );

  // Motion props that respect reduced motion
  const containerMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  const emptyStateMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };

  const courseMotionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -20 },
      };

  const resultMotionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

  const btnWhileHover = reducedMotion ? {} : { whileHover: { scale: 1.02 } };
  const btnWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.98 } };
  const targetBtnWhileHover = reducedMotion
    ? {}
    : { whileHover: { scale: 1.05 } };
  const targetBtnWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.95 } };
  const exportBtnWhileHover = reducedMotion
    ? {}
    : { whileHover: { scale: 1.05 } };
  const exportBtnWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.95 } };
  const calcBtnWhileHover =
    !calculating && !reducedMotion
      ? {
          whileHover: {
            scale: 1.02,
            boxShadow: "0 12px 28px rgba(124,58,237,0.5)",
          },
        }
      : {};
  const calcBtnWhileTap =
    !calculating && !reducedMotion ? { whileTap: { scale: 0.98 } } : {};

  return (
    <motion.div
      className="max-w-4xl mx-auto pb-8 relative px-4 sm:px-0"
      {...containerMotion}
    >
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
        darkMode={darkMode}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Celebration – only if motion is allowed */}
      {!reducedMotion && <CelebrationOverlay show={showCelebration} />}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-sm sm:text-base font-heading font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Current Courses & Grades
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          {result && (
            <motion.button
              type="button"
              {...targetBtnWhileHover}
              {...targetBtnWhileTap}
              onClick={() => setShowTargetGPA(!showTargetGPA)}
              className="btn-ghost text-xs px-4 py-1.5 rounded-full border border-brand-200/40 dark:border-brand-500/30 text-brand-600 dark:text-brand-300 min-h-[44px]"
              aria-expanded={showTargetGPA}
              aria-controls="target-gpa-section"
            >
              {showTargetGPA ? "Hide" : "Show"} Target GPA
            </motion.button>
          )}
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200/40 dark:border-brand-500/30">
            {courses.length} / 8 courses
          </span>
        </div>
      </div>

      {courses.length === 0 && (
        <motion.div
          className="text-center py-10 px-4 glass border-dashed border-2 border-gray-300 dark:border-gray-700 rounded-2xl mb-6"
          {...emptyStateMotion}
        >
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No courses added yet. Click the button below to start building your
            GPA.
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {courses.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              {...courseMotionProps}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            >
              <CourseCard
                id={c.id}
                index={i}
                removable={courses.length > 2}
                onRemove={removeCourse}
                data={c}
                onChange={updateCourse}
                scale={scale}
                darkMode={darkMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {courses.length < 8 && (
        <motion.button
          type="button"
          {...btnWhileHover}
          {...btnWhileTap}
          onClick={addCourse}
          className="w-full mt-4 py-4 border-2 border-dashed border-brand-300/50 dark:border-brand-400/30 rounded-2xl bg-transparent text-brand-600 dark:text-brand-300 font-semibold flex items-center justify-center gap-2 hover:bg-brand-50/30 dark:hover:bg-brand-900/20 transition-all min-h-[48px]"
          aria-label="Add new course"
        >
          <span className="text-2xl leading-none">+</span>
          Add New Course
        </motion.button>
      )}

      <motion.button
        type="button"
        {...calcBtnWhileHover}
        {...calcBtnWhileTap}
        onClick={handleCalculate}
        disabled={calculating}
        className={`btn-primary w-full mt-6 py-4 text-lg font-semibold rounded-2xl min-h-[48px] ${
          calculating ? "opacity-80 cursor-progress" : ""
        }`}
        aria-busy={calculating}
      >
        {calculating ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Calculating...
          </span>
        ) : (
          "Calculate Semester GPA"
        )}
      </motion.button>

      {error && (
        <div
          role="alert"
          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm backdrop-blur flex items-center gap-2"
        >
          <ErrorAlertIcon />
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            className="mt-8 space-y-6 scroll-margin-header"
            {...resultMotionProps}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
          >
            <ResultCard
              gpa={result.gpa}
              courses={result.count}
              credits={result.credits}
              points={result.points}
              scale={scale}
              darkMode={darkMode}
            />
            <GradeProgressBar
              gpa={result.gpa}
              scale={scale}
              darkMode={darkMode}
            />

            {showTargetGPA && (
              <div id="target-gpa-section" className="scroll-margin-header">
                <TargetGPACalculator
                  currentGPA={result.gpa}
                  totalCredits={result.credits}
                  darkMode={darkMode}
                />
              </div>
            )}

            <div className="flex justify-end mt-6">
              <motion.button
                type="button"
                {...exportBtnWhileHover}
                {...exportBtnWhileTap}
                onClick={() => setShowExportModal(true)}
                className="btn-secondary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium min-h-[44px] hover:bg-brand-500/15"
                aria-label="Export academic record as PDF or CSV"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Academic Record
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}