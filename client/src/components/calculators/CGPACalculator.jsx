// CGPACalculator.jsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useCGPA } from "../../hooks/useCGPA";
import { generatePDF, downloadCSV } from '../../utils/exportHelpers';
import { analytics } from "../../services/firebase";
import { trackExport } from "../../services/exportTracker";
import CGPAResultCard from "./CGPAResultCard";
import ExportModal from "./ExportModal";
import Toast from "../common/Toast";
import Button from "../common/Button";
import Spinner from "../common/Spinner";

export default function CGPACalculator({ scale = 4.0 }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { sems, addSem, removeSem, updateSem, calculate, result, error } =
    useCGPA(scale);

  const [calculating, setCalculating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    if (sems.length === 0) {
      setToast({
        message: "Add at least one semester GPA to calculate CGPA.",
        type: "info",
      });
      return;
    }
    setCalculating(true);
    requestAnimationFrame(() => {
      calculate();
      if (analytics) {
        logEvent(analytics, "cgpa_calculated", {
          scale,
          semesters_count: sems.length,
          timestamp: new Date().toISOString(),
        });
      }
      setCalculating(false);
    });
  }, [calculate, scale, sems.length]);

  const handleExport = useCallback(
    async (exportData) => {
      setIsExporting(true);
      setToast({ message: "", type: "" });
      const data = {
        ...exportData,
        scale,
        semesters: sems.map((s) => ({ gpa: s.val })),
        cgpaResult: result,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      try {
        if (exportData.format === "pdf") {
          await generatePDF(data);
        } else {
          downloadCSV(data);
        }

        await trackExport({
          studentName: exportData.studentName || "",
          studentId: exportData.studentId || "",
          university: exportData.university || "",
          semester: exportData.semester || "All Semesters",
          scale,
          gpa: result?.cgpa || 0,
          credits: result?.total || 0,
          date: data.date,
          exportType: exportData.format,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          },
        });

        if (analytics) {
          logEvent(analytics, "export_triggered", {
            format: exportData.format,
            type: "cgpa",
            cgpa: result?.cgpa,
          });
        }

        setShowExportModal(false);
        setToast({
          message: "Export completed successfully!",
          type: "success",
        });
      } catch (err) {
        console.error("Export failed:", err);
        setToast({
          message: "Export failed. Please try again.",
          type: "error",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [sems, scale, result],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
        Semester GPAs
      </h2>

      {/* Empty state */}
      {sems.length === 0 && (
        <div className="text-center p-10 bg-white/40 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 mb-5">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No semester GPAs added yet. Click "Add Semester" to begin.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {sems.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-label={`Semester ${i + 1}`}
            className="glass-card p-5 transition-all hover:border-purple-500/40 hover:-translate-y-1"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Semester {i + 1}
              </span>
              {i >= 2 && (
                <button
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
                </button>
              )}
            </div>
            <input
              type="number"
              min="0"
              max={scale}
              step="0.01"
              placeholder="0.00"
              value={s.val}
              onChange={(e) => updateSem(s.id, e.target.value)}
              aria-label={`Semester ${i + 1} GPA`}
              className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-0 text-2xl font-mono font-semibold text-gray-900 dark:text-white py-1 outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      {sems.length < 8 && (
        <button
          onClick={addSem}
          className="w-full py-3.5 border-2 border-dashed border-purple-300/50 dark:border-purple-500/30 rounded-2xl bg-transparent text-purple-600 dark:text-purple-300 font-semibold flex items-center justify-center gap-2 hover:bg-purple-50/20 dark:hover:bg-purple-900/10 transition-colors"
          aria-label="Add new semester"
        >
          <span className="text-2xl leading-none">+</span>
          Add Semester
        </button>
      )}

      <div className="mt-6">
        <button
          onClick={handleCalculate}
          disabled={calculating}
          className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all ${
            calculating
              ? "bg-purple-800 cursor-progress scale-98 opacity-90"
              : "bg-gradient-brand shadow-lg hover:shadow-xl hover:scale-[1.02]"
          }`}
          aria-busy={calculating}
        >
          {calculating ? (
            <>
              <Spinner className="w-5 h-5" />
              Calculating...
            </>
          ) : (
            "Calculate Cumulative CGPA"
          )}
        </button>
      </div>

      {error && (
        <div
          className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-500 backdrop-blur"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CGPAResultCard
              cgpa={result.cgpa}
              sems={result.sems}
              total={result.total}
              best={result.best}
              scale={scale}
            />
            <div className="mt-5 text-right">
              <button
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-medium hover:bg-purple-500/20 transition-colors"
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
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
