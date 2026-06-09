import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendContactEmail } from "../../services/emailjs";
import { validateEmail } from "../../utils/validators";

const MAX_MESSAGE_LENGTH = 500;

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

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!validateEmail(form.email)) errs.email = "Invalid email";
    if (!form.subject.trim()) errs.subject = "Required";
    if (!form.message.trim()) errs.message = "Required";
    else if (form.message.length > MAX_MESSAGE_LENGTH)
      errs.message = `Max ${MAX_MESSAGE_LENGTH} characters`;
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
      setStatus({ type: "success", message: "Message sent successfully! 🎉" });
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch {
      setStatus({ type: "error", message: "Failed to send. Please try again." });
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

  return (
    <div className="relative">
      {/* Decorative floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-8 md:p-12 relative z-10"
      >
        <h2 className="text-3xl font-bold text-gradient mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We'll get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name */}
          <div className="relative">
            <input
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
            />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">
              Full name *
            </label>
            {errors.name && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs"
              >
                {errors.name}
              </motion.span>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
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
            />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">
              Email address *
            </label>
            {errors.email && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs"
              >
                {errors.email}
              </motion.span>
            )}
          </div>

          {/* Subject */}
          <div className="relative">
            <input
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
            />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">
              Subject *
            </label>
            {errors.subject && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs"
              >
                {errors.subject}
              </motion.span>
            )}
          </div>

          {/* Message */}
          <div className="relative">
            <textarea
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
            />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">
              Message *
            </label>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {errors.message ? (
                <span className="text-red-500">{errors.message}</span>
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
            className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "Send message"
            )}
          </button>

          {/* Status */}
          <AnimatePresence>
            {status.message && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm p-3 rounded-lg ${
                  status.type === "success"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                } backdrop-blur`}
                role="alert"
              >
                {status.message}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}