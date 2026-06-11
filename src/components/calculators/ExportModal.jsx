import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../common/Modal";
import { useDashboard } from "../../contexts/DashboardProvider";
import { get, save } from "../../services/storageService";

const USER_DETAILS_KEY = "maniesta_export_user_details";

const INITIAL_USER_DATA = {
  fullName: "",
  studentId: "",
  university: "",
  degree: "",
  semester: "",
};

// Inline SVG error icon – replaces ⚠️
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

/**
 * Local hook to detect reduced‑motion preference.
 * (Can be extracted to a shared utility later.)
 */
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

  // Load saved user details from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = get(USER_DETAILS_KEY);
      if (saved) {
        setUserData(saved);
      } else {
        setUserData(INITIAL_USER_DATA);
      }
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

      // Save user details for future exports
      save(USER_DETAILS_KEY, userData);

      // Add to dashboard export history
      addExportRecord({
        filename: `Academic_Record_${new Date().toISOString().slice(0, 19)}.pdf`,
        type: "pdf",
        date: new Date().toISOString(),
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
    // Re-submit the same user data
    handleSubmit({ preventDefault: () => {} });
  };

  // Success checkmark – static if reduced motion
  const SuccessCheckmark = () =>
    reducedMotion ? (
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-emerald-500"
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
        className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
      >
        <svg
          className="w-8 h-8 text-emerald-500"
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
    <Modal isOpen={isOpen} onClose={!isExporting ? handleClose : undefined}>
      {/* Main modal container with constrained height and flex layout */}
      <div className="flex flex-col max-h-[85vh] min-h-[50vh]">
        {successFiles ? (
          // ── Success Screen ──
          <div className="flex flex-col h-full">
            <div className="shrink-0 pb-4 border-b border-white/20 dark:border-white/10">
              <h3 className="text-2xl font-bold text-gradient text-center">
                Export Ready!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                Your academic record has been generated.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-6 text-center space-y-6">
              <SuccessCheckmark />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={successFiles.pdfUrl}
                  download="Academic_Record.pdf"
                  className="btn-primary py-3 px-6 flex items-center justify-center gap-2"
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
                  className="btn-secondary py-3 px-6 flex items-center justify-center gap-2"
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
            </div>
            <div className="shrink-0 pt-4 border-t border-white/20 dark:border-white/10 text-center">
              <button
                onClick={handleClose}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors py-2"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          // ── Form Screen ──
          <>
            <div className="shrink-0 pb-3 border-b border-white/20 dark:border-white/10">
              <h3 className="text-2xl font-bold text-gradient">
                Export Academic Record
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fill your details to generate PDF and CSV files.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <form
                id="export-form"
                onSubmit={handleSubmit}
                className="space-y-5"
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
                    className="input-base"
                    placeholder="Your University Name"
                  />
                </div>
              </form>
            </div>

            <div className="shrink-0 pt-4 border-t border-white/20 dark:border-white/10">
              {generationError && (
                <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <ErrorAlertIcon />
                    {generationError}
                  </span>
                  <button
                    onClick={handleRetry}
                    className="text-sm underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              <button
                type="submit"
                form="export-form"
                disabled={isExporting || !userData.fullName}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
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
                    Generating files...
                  </>
                ) : (
                  "Generate Export Files"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
