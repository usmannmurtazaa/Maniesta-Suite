import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useGPA } from "../hooks/useGPA";
import { GRADES, SCALES } from "../utils/grades";
import { generatePDF } from "../utils/pdfExport";
import { downloadCSV } from "../utils/csvExport";
import { logEvent } from "../firebase/analytics";
import { trackExport } from "../firebase/exportTracker";
import CourseCard from "./CourseCard";
import ResultCard from "./ResultCard";
import { GradeProgressBar, TargetGPACalculator } from "./GradeExtras";
import ExportModal from "./ExportModal";
import Toast from "./Toast";

const useGradeScale = (scale) =>
  useMemo(() => SCALES[scale] || GRADES, [scale]);

export default function GPACalculator({ scale, darkMode }) {
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

  const handleCalculate = useCallback(() => {
    if (courses.length === 0) {
      setToast({
        message: "Add at least one course to calculate GPA.",
        type: "info",
      });
      return;
    }
    setCalculating(true);
    requestAnimationFrame(() => {
      calculate();
      logEvent("gpa_calculated", {
        scale,
        courses_count: courses.length,
        timestamp: new Date().toISOString(),
      });
      setCalculating(false);
    });
  }, [calculate, scale, courses.length]);

  const handleExport = useCallback(
    async (exportData) => {
      setIsExporting(true);
      setToast({ message: "", type: "" });

      const data = {
        ...exportData,
        scale,
        courses: courses.map((c) => ({
          code: c.code || "—",
          credits: c.credits,
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
        if (exportData.format === "pdf") {
          await generatePDF(data);
        } else {
          downloadCSV(data);
        }

        await trackExport({
          studentName: exportData.studentName || "",
          studentId: exportData.studentId || "",
          university: exportData.university || "",
          semester: exportData.semester || "",
          scale,
          gpa: result?.gpa || 0,
          credits: result?.credits || 0,
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

        logEvent("export_triggered", {
          format: exportData.format,
          scale,
          gpa: result?.gpa,
        });

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
    [courses, scale, result, gradeScale],
  );

  return (
    <div className="max-w-3xl mx-auto px-4 pb-6 animate-fade-up">
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
        darkMode={darkMode}
      />

      {/* Section header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Current Courses & Grades
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          {result && (
            <button
              onClick={() => setShowTargetGPA(!showTargetGPA)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold glass text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              aria-expanded={showTargetGPA}
              aria-controls="target-gpa-section"
            >
              {showTargetGPA ? "Hide" : "Show"} Target GPA
            </button>
          )}
          <span
            className="px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700"
            aria-live="polite"
            aria-atomic="true"
          >
            {courses.length} / 8 courses
          </span>
        </div>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="text-center py-10 px-4 rounded-2xl glass border-dashed mb-6">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No courses added yet. Click the button below to start building your
            GPA.
          </p>
        </div>
      )}

      {/* Course cards */}
      {courses.map((c, i) => (
        <CourseCard
          key={c.id}
          id={c.id}
          index={i}
          removable={i >= 3}
          onRemove={removeCourse}
          data={c}
          onChange={updateCourse}
          scale={scale}
          darkMode={darkMode}
        />
      ))}

      {/* Add course button */}
      {courses.length < 8 && (
        <button
          onClick={addCourse}
          className="w-full py-4 border-2 border-dashed border-brand-300 dark:border-brand-600 rounded-2xl text-brand-600 dark:text-brand-300 font-semibold flex items-center justify-center gap-2 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all"
          aria-label="Add new course"
        >
          <span className="text-2xl leading-none">+</span>
          Add New Course
        </button>
      )}

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        disabled={calculating}
        className={`w-full py-4 rounded-2xl font-semibold text-white text-lg flex items-center justify-center gap-2 transition-all ${
          calculating
            ? "bg-purple-800 scale-95 opacity-90 cursor-progress"
            : "bg-gradient-to-r from-brand-600 to-brand-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
        }`}
        aria-busy={calculating}
      >
        {calculating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Calculating...
          </>
        ) : (
          "Calculate Semester GPA"
        )}
      </button>

      {/* Error message */}
      {error && (
        <div
          className="mt-4 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {/* Results section */}
      {result && (
        <>
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
            <div id="target-gpa-section">
              <TargetGPACalculator
                currentGPA={result.gpa}
                totalCredits={result.credits}
                darkMode={darkMode}
              />
            </div>
          )}

          <div className="mt-6 text-right">
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-brand-600 dark:text-brand-300 font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
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
        </>
      )}
    </div>
  );
}
