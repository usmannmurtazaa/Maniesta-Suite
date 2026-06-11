import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContactForm from "../components/contact/Contact";
import SEO from "../components/SEO";

/**
 * Local hook to detect the user’s motion preference.
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

export default function ContactPage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Conditional motion props – empty when reduced motion is preferred
  const containerMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
      };

  const headingMotion = prefersReducedMotion
    ? {}
    : {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
      };

  const cardMotion = prefersReducedMotion
    ? {}
    : {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2 },
      };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the Maniesta Suite team. Send feedback, ask questions, or report issues. We'll reply within 24 hours."
        keywords="contact, support, feedback, help, Maniesta Suite contact"
        canonicalUrl="https://maniestasuite.netlify.app/contact"
      />
      <motion.div {...containerMotion} className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <motion.h1
            {...headingMotion}
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
          {...cardMotion}
          className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-glass-lg"
        >
          <ContactForm />
        </motion.div>
      </motion.div>
    </>
  );
}
