import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// -------------------------------------------------------------------
// Local hook: detect reduced motion preference
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

// SVG Icons
const AccuracyIcon = () => (
  <svg
    className="w-6 h-6 text-emerald-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const SpeedIcon = () => (
  <svg
    className="w-6 h-6 text-blue-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);
const DesignIcon = () => (
  <svg
    className="w-6 h-6 text-purple-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6L4 8l2 2m0 0l2-2-2-2m6 2l-2 2 2 2m0 0l2-2-2-2m4 8l-2 2-2-2m2 2v4m-6 0H9m2-8v8"
    />
  </svg>
);
const PrivacyIcon = () => (
  <svg
    className="w-6 h-6 text-indigo-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);
const SparkleIcon = () => (
  <svg
    className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  </svg>
);

const values = [
  {
    title: "Accuracy",
    desc: "Precision you can trust — every calculation follows academic standards.",
    icon: <AccuracyIcon />,
  },
  {
    title: "Speed",
    desc: "Instant results with an interface that never gets in your way.",
    icon: <SpeedIcon />,
  },
  {
    title: "Design",
    desc: "A premium, distraction‑free experience that makes studying enjoyable.",
    icon: <DesignIcon />,
  },
  {
    title: "Privacy",
    desc: "Your data stays yours — we don’t sell or share anything.",
    icon: <PrivacyIcon />,
  },
];

const whyPoints = [
  {
    title: "All-in-One",
    desc: "GPA, CGPA, calculators, converters, interest — no more tab switching.",
    link: "/tools",
  },
  {
    title: "Export Ready",
    desc: "Generate professional PDF reports and CSV data for your records.",
    link: "/export-guide",
  },
  {
    title: "Always Free",
    desc: "No paywalls, no ads, no limits. Built for students, forever free.",
    link: null,
  },
  {
    title: "Modern Tech",
    desc: "Built with React, Framer Motion, and Firebase. Also includes an AI Chat Assistant to help you navigate all tools.",
    link: null,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ScrollReveal({ children, className, reducedMotion }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection() {
  const reducedMotion = usePrefersReducedMotion();

  const hoverTranslateClass = reducedMotion ? "" : "hover:-translate-y-1";
  const hoverScaleClass = reducedMotion ? "" : "group-hover:scale-125";
  const transitionClass = "transition-all";

  return (
    <div className="space-y-16">
      {/* Story & Founder */}
      <ScrollReveal reducedMotion={reducedMotion}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 md:p-8 break-words">
            <h2 className="font-heading text-2xl font-bold mb-4 text-gradient">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Maniesta Suite was born from the frustration of cluttered academic
              tools. Our founder, Usman Murtaza, envisioned a single, elegant
              platform where students could calculate, convert, and track their
              academic progress without ever leaving the page. Today, we serve
              thousands of students globally, continuously refining our
              calculators and design.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 break-words flex flex-col gap-4">
            <div className="flex items-center gap-5">
              {/* Replace the initials with an image */}
              <img
                src="/assets/usman-murtaza.png"
                alt="Usman Murtaza – Founder"
                className="w-16 h-16 rounded-full object-cover shadow-brand"
              />
              <div>
                <h3 className="font-heading text-xl font-semibold">
                  <a
                    href="https://usmanmurtaza.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-500 transition-colors"
                  >
                    Usman Murtaza
                  </a>
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Founder & Developer
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm italic">
                  "I believe every student deserves powerful tools that are
                  beautiful and intuitive."
                </p>
              </div>
            </div>
            {/* Social Links Row */}
            <div className="flex gap-3 text-gray-500 dark:text-gray-400">
              <a
                href="https://github.com/usmannmurtazaa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-500 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://x.com/usman_murtazaa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-500 transition-colors"
                aria-label="X"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/usmannmurtazaa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal reducedMotion={reducedMotion}>
        <div className="glass-card p-6 md:p-8 text-center break-words">
          <h2 className="font-heading text-2xl font-bold mb-4 text-gradient">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            To become the world’s most trusted academic toolkit – empowering
            every student with beautiful, accessible, and intelligent tools that
            make studying effortless.
          </p>
        </div>
      </ScrollReveal>

      {/* Why Maniesta Suite – with staggerChildren (only if motion allowed) */}
      <ScrollReveal reducedMotion={reducedMotion}>
        <div className="glass-card p-6 md:p-8 break-words">
          <h2 className="font-heading text-2xl font-bold mb-6 text-gradient text-center">
            Why Maniesta Suite?
          </h2>

          {reducedMotion ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {whyPoints.map((point) => {
                const content = (
                  <div className="flex gap-3">
                    <span className="shrink-0 mt-0.5" aria-hidden="true">
                      <SparkleIcon />
                    </span>
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 dark:text-white">
                        {point.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
                return point.link ? (
                  <Link
                    key={point.title}
                    to={point.link}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={point.title}>{content}</div>
                );
              })}
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {whyPoints.map((point) => {
                const content = (
                  <div className="flex gap-3">
                    <span className="shrink-0 mt-0.5" aria-hidden="true">
                      <SparkleIcon />
                    </span>
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 dark:text-white">
                        {point.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
                return point.link ? (
                  <motion.div key={point.title} variants={itemVariants}>
                    <Link
                      to={point.link}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      {content}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={point.title} variants={itemVariants}>
                    {content}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </ScrollReveal>

      {/* Core Values – with staggerChildren (only if motion allowed) */}
      <ScrollReveal reducedMotion={reducedMotion}>
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6 text-gradient text-center">
            Our Values
          </h2>

          {reducedMotion ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {values.map((item) => (
                <div
                  key={item.title}
                  className={`glass-card p-5 flex gap-4 group break-words ${transitionClass}`}
                >
                  <span className="shrink-0 text-gray-800 dark:text-gray-200">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {values.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className={`glass-card p-5 flex gap-4 group ${hoverTranslateClass} ${transitionClass} break-words`}
                >
                  <span
                    className={`shrink-0 transform ${hoverScaleClass} transition-transform duration-300 text-gray-800 dark:text-gray-200`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}