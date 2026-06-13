import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useCGPA } from "../../hooks/useCGPA";
import { generatePDFBlob, generateCSVBlob } from "../../utils/exportHelpers";
import { logEvent } from "../../services/firebase"; 
import { trackExport } from "../../services/exportTracker";
import CGPAResultCard from "./CGPAResultCard";
import ExportModal from "./ExportModal";
import Toast from "../common/Toast";
import CelebrationOverlay from "./CelebrationOverlay";

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

// SVG error alert icon – replaces ⚠️ emoji
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

export default function CGPACalculator({ scale = 4.0 }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const reducedMotion = usePrefersReducedMotion();

  // Normalize scale to string (the hook expects a string key)
  const scaleStr = String(scale);
  const { sems, addSem, removeSem, updateSem, calculate, result, error } =
    useCGPA(scaleStr);

  const [calculating, setCalculating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (result && result.cgpa >= 3.5) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleCalculate = useCallback(() => {
    if (sems.length < 2) {
      setToast({ message: "Add at least two semesters.", type: "info" });
      return;
    }
    setCalculating(true);
    requestAnimationFrame(() => {
      calculate();
      // Unified analytics call – no conditional needed
      logEvent("cgpa_calculated", {
        scale: scaleStr,
        semesters_count: sems.length,
        timestamp: new Date().toISOString(),
      });
      setCalculating(false);
    });
  }, [calculate, scaleStr, sems.length]);

  // Export handler (unchanged logic, uses unified analytics)
  const handleExport = useCallback(
    async (exportUserData) => {
      setIsExporting(true);
      setToast({ message: "", type: "" });

      const baseData = {
        ...exportUserData,
        degree: exportUserData.degree,
        scale: scaleStr,
        semesters: sems.map((s) => ({ gpa: s.val })),
        cgpaResult: result,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        type: "CGPA",
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
          semester: exportUserData.semester || "All Semesters",
          scale: scaleStr,
          gpa: result?.cgpa || 0,
          credits: result?.total || 0,
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
          type: "cgpa",
          cgpa: result?.cgpa,
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
    [sems, scaleStr, result],
  );

  // Motion props respecting reduced motion
  const containerMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  const emptyStateMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };

  // Semester card animations
  const cardEntryMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -20 },
      };

  // Result section animation
  const resultMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
      };

  // Button hover/tap props
  const btnWhileHover = reducedMotion ? {} : { whileHover: { scale: 1.02 } };
  const btnWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.98 } };
  const removeBtnWhileHover = reducedMotion
    ? {}
    : { whileHover: { scale: 1.15 } };
  const removeBtnWhileTap = reducedMotion ? {} : { whileTap: { scale: 0.9 } };
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

  // Conditional card hover class
  const cardHoverClass = reducedMotion ? "" : "hover:-translate-y-1";

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 relative"
      {...containerMotion}
    >
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
        darkMode={isDark}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {!reducedMotion && <CelebrationOverlay show={showCelebration} />}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Semester GPAs
        </h2>
        <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200/40 dark:border-brand-500/30">
          {sems.length} / 8 semesters
        </span>
      </div>

      {sems.length === 0 && (
        <motion.div
          className="text-center py-10 px-4 glass border-dashed border-2 border-gray-300 dark:border-gray-700 rounded-2xl mb-6"
          {...emptyStateMotion}
        >
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No semester GPAs added yet. Click "Add Semester" to begin.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <AnimatePresence initial={false}>
          {sems.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              {...cardEntryMotion}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className={`glass-card p-5 transition-all hover:border-brand-400/40 ${cardHoverClass} group`}
              role="group"
              aria-label={`Semester ${i + 1}`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Semester {i + 1}
                </span>
                {sems.length > 2 && (
                  <motion.button
                    type="button"
                    {...removeBtnWhileHover}
                    {...removeBtnWhileTap}
                    onClick={() => removeSem(s.id)}
                    aria-label={`Remove semester ${i + 1}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/25 text-red-500 hover:bg-red-500/25 transition-colors"
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                )}
              </div>
              <input
                type="number"
                min="0"
                max={scaleStr}
                step="0.01"
                placeholder="0.00"
                value={s.val}
                onChange={(e) => updateSem(s.id, e.target.value)}
                aria-label={`Semester ${i + 1} GPA`}
                className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-0 text-2xl font-mono font-semibold text-gray-900 dark:text-white py-1 outline-none transition-colors"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sems.length < 8 && (
        <motion.button
          type="button"
          {...btnWhileHover}
          {...btnWhileTap}
          onClick={addSem}
          className="w-full py-3.5 border-2 border-dashed border-brand-300/50 dark:border-brand-400/30 rounded-2xl bg-transparent text-brand-600 dark:text-brand-300 font-semibold flex items-center justify-center gap-2 hover:bg-brand-50/30 dark:hover:bg-brand-900/20 transition-all"
          aria-label="Add new semester"
        >
          <span className="text-2xl leading-none">+</span>
          Add Semester
        </motion.button>
      )}

      <motion.button
        type="button"
        {...calcBtnWhileHover}
        {...calcBtnWhileTap}
        onClick={handleCalculate}
        disabled={calculating}
        className={`btn-primary w-full mt-6 py-4 text-lg font-semibold rounded-2xl ${
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
          "Calculate Cumulative CGPA"
        )}
      </motion.button>

      {error && (
        <div
          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm backdrop-blur flex items-center gap-2"
          role="alert"
        >
          <ErrorAlertIcon />
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            className="mt-8 space-y-6 scroll-margin-header"
            {...resultMotion}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
          >
            <CGPAResultCard
              cgpa={result.cgpa}
              sems={result.sems}
              total={result.total}
              best={result.best}
              scale={scaleStr}
              darkMode={isDark}
            />
            <div className="flex justify-end mt-4">
              <motion.button
                type="button"
                {...exportBtnWhileHover}
                {...exportBtnWhileTap}
                onClick={() => setShowExportModal(true)}
                className="btn-secondary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium"
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
