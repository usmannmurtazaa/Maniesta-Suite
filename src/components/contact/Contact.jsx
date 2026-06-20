// file: src/components/contact/ContactForm.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendContactEmail } from "../../services/emailjs";
import { validateEmail } from "../../utils/validators";

const MAX_MESSAGE_LENGTH = 500;
const SUCCESS_MESSAGE_DURATION = 5000;

// icon components
const SuccessIcon = () => (
  <svg
    className="w-5 h-5 text-green-500 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const ErrorIcon = () => (
  <svg
    className="w-5 h-5 text-red-500 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

/**
 * Local hook: detect reduced motion preference
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

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);
  const statusLiveRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (status.type === "success") {
      const timer = setTimeout(() => {
        setStatus({ type: "", message: "" });
        // Clear the live region when the status message disappears
        if (statusLiveRef.current) {
          statusLiveRef.current.textContent = "";
        }
      }, SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Announce status to screen readers
  useEffect(() => {
    if (status.message && statusLiveRef.current) {
      statusLiveRef.current.textContent = status.message;
    }
  }, [status]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email address is required";
    else if (!validateEmail(form.email))
      errs.email = "Enter a valid email address (e.g., name@example.com)";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.length > MAX_MESSAGE_LENGTH)
      errs.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      await sendContactEmail(form);
      setStatus({
        type: "success",
        message: "Message sent successfully! We'll reply within 24 hours.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      nameInputRef.current?.focus();
    } catch (err) {
      console.error("Email send error:", err);
      setStatus({
        type: "error",
        message:
          "Failed to send. Please try again later or email us directly at maniestasuite@gmail.com.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Helper to render error messages – plain span if reduced motion
  const renderError = (field, message) => {
    if (!message) return null;
    return reducedMotion ? (
      <span id={`${field}-error`} className="text-red-500 text-xs">
        {message}
      </span>
    ) : (
      <motion.span
        id={`${field}-error`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-xs"
      >
        {message}
      </motion.span>
    );
  };

  return (
    <div className="relative">
      {/* Live region for screen reader announcements */}
      <div
        ref={statusLiveRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Decorative floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {reducedMotion ? (
          <>
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <motion.div
              className="absolute -top-20 -right-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      {reducedMotion ? (
        <div className="glass-card p-8 md:p-12 relative z-10 break-words">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Have a question or feedback? Fill out the form and we’ll get back to
            you within 24 hours. You can also use the{" "}
            <span className="font-medium text-brand-500">
              AI Chat Assistant
            </span>{" "}
            (via the chat button) for instant help with our calculators.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                ref={nameInputRef}
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Full name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-name"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Full name *
              </label>
              {renderError("name", errors.name)}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="contact-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-email"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Email address *
              </label>
              {renderError("email", errors.email)}
            </div>

            {/* Subject */}
            <div className="relative">
              <input
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${
                  errors.subject
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Subject"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-subject"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Subject *
              </label>
              {renderError("subject", errors.subject)}
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="contact-message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                maxLength={MAX_MESSAGE_LENGTH}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors resize-none ${
                  errors.message
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Message"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-message"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Message *
              </label>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {errors.message ? (
                  <span id="message-error" className="text-red-500">
                    {errors.message}
                  </span>
                ) : (
                  <span>Min. 10 characters</span>
                )}
                <span>
                  {form.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
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
                  Sending...
                </>
              ) : (
                "Send message"
              )}
            </button>

            {/* Status message – static if reducedMotion */}
            {status.message && (
              <div
                className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                  status.type === "success"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                } backdrop-blur`}
                role="alert"
              >
                {status.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
                <span>{status.message}</span>
              </div>
            )}
          </form>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 relative z-10 break-words"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Have a question or feedback? Fill out the form and we’ll get back to
            you within 24 hours. You can also use the{" "}
            <span className="font-medium text-brand-500">
              AI Chat Assistant
            </span>{" "}
            (via the chat button) for instant help with our calculators.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                ref={nameInputRef}
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Full name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-name"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Full name *
              </label>
              {renderError("name", errors.name)}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="contact-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-email"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Email address *
              </label>
              {renderError("email", errors.email)}
            </div>

            {/* Subject */}
            <div className="relative">
              <input
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${
                  errors.subject
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Subject"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-subject"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Subject *
              </label>
              {renderError("subject", errors.subject)}
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="contact-message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                maxLength={MAX_MESSAGE_LENGTH}
                className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors resize-none ${
                  errors.message
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
                }`}
                placeholder=" "
                required
                aria-label="Message"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                disabled={loading}
              />
              <label
                htmlFor="contact-message"
                className="absolute left-0 top-1 text-sm text-gray-400 dark:text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500"
              >
                Message *
              </label>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {errors.message ? (
                  <span id="message-error" className="text-red-500">
                    {errors.message}
                  </span>
                ) : (
                  <span>Min. 10 characters</span>
                )}
                <span>
                  {form.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
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
                  Sending...
                </>
              ) : (
                "Send message"
              )}
            </button>

            {/* Status message – animated */}
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                  } backdrop-blur`}
                  role="alert"
                >
                  {status.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
                  <span>{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      )}
    </div>
  );
}
