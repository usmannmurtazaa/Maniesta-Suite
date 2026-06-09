import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const values = [
  {
    title: "Accuracy",
    desc: "Precision you can trust — every calculation follows academic standards.",
    icon: "✅",
  },
  {
    title: "Speed",
    desc: "Instant results with an interface that never gets in your way.",
    icon: "⚡",
  },
  {
    title: "Design",
    desc: "A premium, distraction‑free experience that makes studying enjoyable.",
    icon: "🎨",
  },
  {
    title: "Privacy",
    desc: "Your data stays yours — we don’t sell or share anything.",
    icon: "🔒",
  },
];

const whyPoints = [
  {
    title: "All-in-One",
    desc: "GPA, CGPA, calculators, converters, interest — no more tab switching.",
  },
  {
    title: "Export Ready",
    desc: "Generate professional PDF reports and CSV data for your records.",
  },
  {
    title: "Always Free",
    desc: "No paywalls, no ads, no limits. Built for students, forever free.",
  },
  {
    title: "Modern Tech",
    desc: "Built with React, Framer Motion, and Firebase for a smooth, secure experience.",
  },
];

function ScrollReveal({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <div className="space-y-16">
      {/* Story & Founder */}
      <ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-gradient">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Maniesta Suite was born from the frustration of cluttered academic
              tools. Our founder, Usman Murtaza, envisioned a single, elegant
              platform where students could calculate, convert, and track their
              academic progress without ever leaving the page. Today, we serve
              thousands of students globally, continuously refining our
              calculators and design.
            </p>
          </div>
          <div className="glass-card p-6 md:p-8 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-brand">
              UM
            </div>
            <div>
              <h3 className="text-xl font-semibold">Usman Murtaza</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Founder & Developer
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm italic">
                "I believe every student deserves powerful tools that are
                beautiful and intuitive."
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Why Maniesta Suite */}
      <ScrollReveal>
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gradient text-center">
            Why Maniesta Suite?
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {whyPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3"
              >
                <span className="text-2xl shrink-0 mt-0.5">✨</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Core Values */}
      <ScrollReveal>
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gradient text-center">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 flex gap-4 group hover:shadow-glass-lg hover:-translate-y-1 transition-all"
              >
                <span className="text-3xl shrink-0 transform group-hover:scale-125 transition-transform duration-300">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}