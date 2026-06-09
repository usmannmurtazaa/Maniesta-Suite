import { motion } from "framer-motion";
import ContactForm from "../components/contact/ContactForm";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Page Header */}
      <div className="text-center space-y-3">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-extrabold text-gradient"
        >
          Get in Touch
        </motion.h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          We'd love to hear from you — feedback, questions, or just say hello.
        </p>
      </div>

      {/* Contact Form Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
      >
        <ContactForm />
      </motion.div>
    </motion.div>
  );
}