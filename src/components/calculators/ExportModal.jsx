import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../common/Modal";

const INITIAL_USER_DATA = {
  fullName: "",
  studentId: "",
  university: "",
  semester: "",
  email: "",
  notes: "",
};

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting = false,
}) {
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successFiles, setSuccessFiles] = useState(null);
  const fullNameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUserData(INITIAL_USER_DATA);
      setFieldErrors({});
      setSuccessFiles(null);
      const timer = setTimeout(() => fullNameRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const validate = () => {
    const errors = {};
    if (!userData.fullName.trim()) errors.fullName = "Full name is required";
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      errors.email = "Invalid email";
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

    try {
      const files = await onExport(userData);
      const pdfUrl = URL.createObjectURL(files.pdfBlob);
      const csvUrl = URL.createObjectURL(files.csvBlob);
      setSuccessFiles({ pdfUrl, csvUrl });
    } catch (err) {
      // Error toast already shown by parent
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

  return (
    <Modal isOpen={isOpen} onClose={() => !isExporting && handleClose()}>
      <div className="flex flex-col" style={{ minHeight: "60vh" }}>
        {successFiles ? (
          /* ── Success Screen ─────────────────── */
          <div className="flex-1 flex flex-col justify-center text-center space-y-6 py-4">
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
            <h3 className="text-2xl font-bold text-gradient">Export Ready!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your academic record has been generated and saved.
            </p>

            <div className="mt-auto pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={successFiles.pdfUrl}
                  download="Academic_Record.pdf"
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
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
                  className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
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
                onClick={handleClose}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors w-full py-2"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ── Form Screen ───────────────────── */
          <>
            {/* Sticky header */}
            <div className="shrink-0 pb-3">
              <h3 className="text-2xl font-bold text-gradient">
                Export Academic Record
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fill details to generate PDF & CSV.
              </p>
            </div>

            {/* Scrollable form body */}
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
                    placeholder="John Doe"
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
                      placeholder="e.g. FA21-BCS-123"
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
                      placeholder="e.g. Fall 2025"
                    />
                  </div>
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
                    placeholder="e.g. COMSATS University Islamabad"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    className={`input-base ${fieldErrors.email ? "input-error" : ""}`}
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {fieldErrors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={userData.notes}
                    onChange={handleChange}
                    className="input-base resize-none"
                    placeholder="Optional remarks..."
                  />
                </div>
              </form>
            </div>

            {/* Sticky footer with submit button */}
            <div className="shrink-0 pt-2 pb-1">
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
                    Generating...
                  </>
                ) : (
                  "Generate PDF & CSV"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
