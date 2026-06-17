// src/components/calculators/ExportModal.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../../contexts/DashboardProvider";
import { get, save } from "../../services/storageService";
import { trackExport } from "../../services/exportTracker"; // <-- ADDED

const USER_DETAILS_KEY = "maniesta_export_user_details";

const INITIAL_USER_DATA = {
  fullName: "",
  studentId: "",
  university: "",
  degree: "",
  semester: "",
};

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

/* ── Lightweight focus trap & scroll lock (self‑contained) ───────── */
function useModalAccessibility(isOpen, onClose, modalRef) {
  const previousFocusRef = useRef(null);

  // Scroll lock & scrollbar compensation
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    const timer = setTimeout(() => {
      const el = modalRef.current;
      if (!el) return;
      const firstFocusable = el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      else el.focus({ preventScroll: true });
    }, 60);

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const container = modalRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, modalRef]);
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting = false,
}) {
  const { addExportRecord } = useDashboard();
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successFiles, setSuccessFiles] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const fullNameRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const modalRef = useRef(null);

  useModalAccessibility(isOpen, onClose, modalRef);

  useEffect(() => {
    if (isOpen) {
      const saved = get(USER_DETAILS_KEY);
      setUserData(saved ?? INITIAL_USER_DATA);
      setFieldErrors({});
      setSuccessFiles(null);
      setGenerationError(null);
      setTimeout(() => fullNameRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const validate = () => {
    const errors = {};
    if (!userData.fullName.trim()) errors.fullName = "Full name is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setGenerationError(null);
    try {
      const files = await onExport(userData);
      const pdfUrl = URL.createObjectURL(files.pdfBlob);
      const csvUrl = URL.createObjectURL(files.csvBlob);
      setSuccessFiles({ pdfUrl, csvUrl });
      save(USER_DETAILS_KEY, userData);
      addExportRecord({
        filename: `Academic_Record_${new Date().toISOString().slice(0, 19)}.pdf`,
        type: "pdf",
        date: new Date().toISOString(),
      });

      // ── FIX: Save to Firestore ──────────────────────────────────────
      trackExport({
        studentName: userData.fullName,
        studentId: userData.studentId,
        university: userData.university,
        degree: userData.degree,
        semester: userData.semester,
        exportType: "pdf",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Export generation failed:", err);
      setGenerationError(
        err.message || "Failed to generate files. Please try again.",
      );
    }
  };

  const handleClose = () => {
    if (successFiles) {
      URL.revokeObjectURL(successFiles.pdfUrl);
      URL.revokeObjectURL(successFiles.csvUrl);
      setSuccessFiles(null);
    }
    onClose();
  };

  const handleRetry = () => {
    setGenerationError(null);
    handleSubmit({ preventDefault: () => {} });
  };

  const SuccessCheckmark = () =>
    reducedMotion ? (
      <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ) : (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
      >
        <svg
          className="w-7 h-7 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden"
          style={{
            padding: `calc(1rem + env(safe-area-inset-top)) calc(1rem + env(safe-area-inset-right)) calc(1rem + env(safe-area-inset-bottom)) calc(1rem + env(safe-area-inset-left))`,
          }}
          onClick={handleClose}
        >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="glass rounded-2xl overflow-hidden flex flex-col shadow-glass-lg border border-white/20 dark:border-white/10 relative"
            style={{
              width: "calc(100% - 2rem)",
              maxWidth: "min(90vw, 600px)",
              maxHeight: "min(85dvh, 600px)",
              height: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200/40 dark:hover:bg-gray-700/40 transition-colors"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {/* Content area – scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6">
              {successFiles ? (
                <div className="flex flex-col items-center text-center space-y-4">
                  <h3
                    id="export-modal-title"
                    className="text-xl font-bold text-gradient"
                  >
                    Export Ready!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your academic record has been generated.
                  </p>
                  <SuccessCheckmark />
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <a
                      href={successFiles.pdfUrl}
                      download="Academic_Record.pdf"
                      className="btn-primary py-2.5 px-4 flex items-center justify-center gap-2 text-sm min-h-[44px] flex-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </a>
                    <a
                      href={successFiles.csvUrl}
                      download="Academic_Record.csv"
                      className="btn-secondary py-2.5 px-4 flex items-center justify-center gap-2 text-sm min-h-[44px] flex-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Download CSV
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors py-2 min-h-[44px]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <h3
                    id="export-modal-title"
                    className="text-xl font-bold text-gradient"
                  >
                    Export Academic Record
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fill your details to generate PDF and CSV files.
                  </p>

                  <form
                    id="export-form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        ref={fullNameRef}
                        value={userData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        className={`input-base ${fieldErrors.fullName ? "input-error" : ""}`}
                        placeholder="Your Name"
                      />
                      {fieldErrors.fullName && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          {fieldErrors.fullName}
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="studentId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Student ID
                        </label>
                        <input
                          id="studentId"
                          name="studentId"
                          type="text"
                          value={userData.studentId}
                          onChange={handleChange}
                          autoComplete="on"
                          className="input-base"
                          placeholder="Your Student ID"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="semester"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Semester
                        </label>
                        <input
                          id="semester"
                          name="semester"
                          type="text"
                          value={userData.semester}
                          onChange={handleChange}
                          autoComplete="off"
                          className="input-base"
                          placeholder="Your Semester"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="degree"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Degree / Program
                      </label>
                      <input
                        id="degree"
                        name="degree"
                        type="text"
                        value={userData.degree}
                        onChange={handleChange}
                        autoComplete="organization-title"
                        className="input-base"
                        placeholder="Your Degree or Program"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="university"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        University
                      </label>
                      <input
                        id="university"
                        name="university"
                        type="text"
                        value={userData.university}
                        onChange={handleChange}
                        autoComplete="organization"
                        className="input-base"
                        placeholder="Your University Name"
                      />
                    </div>
                  </form>

                  {generationError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <ErrorAlertIcon />
                        {generationError}
                      </span>
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="text-sm underline hover:no-underline min-h-[44px]"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    form="export-form"
                    disabled={isExporting || !userData.fullName}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {isExporting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
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
                        Generating files...
                      </>
                    ) : (
                      "Generate Export Files"
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}