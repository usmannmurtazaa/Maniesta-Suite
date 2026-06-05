import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

const tools = [
  {
    name: "GPA Calculator",
    path: "/gpa",
    icon: "📊",
    desc: "Compute semester GPA instantly.",
  },
  {
    name: "CGPA Calculator",
    path: "/cgpa",
    icon: "🎓",
    desc: "Cumulative performance tracking.",
  },
  {
    name: "Calculator",
    path: "/calculator",
    icon: "🧮",
    desc: "Normal & scientific modes.",
  },
  {
    name: "Unit Converter",
    path: "/converter",
    icon: "⚖️",
    desc: "Length, currency, temperature…",
  },
  {
    name: "Interest",
    path: "/interest",
    icon: "💰",
    desc: "Simple, compound, loan EMI.",
  },
  {
    name: "Contact",
    path: "/contact",
    icon: "✉️",
    desc: "Get in touch with our team.",
  },
];

const statsData = [
  { label: "Calculators", target: 7 },
  { label: "Countries", target: 120 },
  { label: "Students", target: 50000 },
];

// Animated counter component
function AnimatedCounter({ target, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      spring.set(target);
      const unsubscribe = spring.on("change", (latest) => {
        setDisplayValue(Math.round(latest));
      });
      return unsubscribe;
    }
  }, [isInView, target, spring]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass p-6 rounded-2xl"
    >
      <div className="text-4xl font-bold text-gradient mb-2">
        {label === "Students"
          ? `${(displayValue / 1000).toFixed(0)}k+`
          : displayValue}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Floating glass particles (decorative) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-300/20 rounded-full blur-xl"
          animate={{ y: [0, 15, 0], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-2/3 left-10 w-20 h-20 bg-pink-300/20 rounded-full blur-xl"
          animate={{ x: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero */}
      <section className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-card max-w-4xl mx-auto p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          <h1 className="text-5xl md:text-7xl font-extrabold text-gradient mb-6 relative z-10">
            Academic Tools,
            <br />
            Redesigned.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            Maniesta Suite provides elegant, intuitive calculators for students.
            GPA, CGPA, conversions, and more – all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/gpa" className="btn-primary">
              Start calculating →
            </Link>
            <a href="#features" className="btn-secondary">
              Explore tools
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats with animated counters */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          {statsData.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              target={stat.target}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="features" className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Everything a student needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={tool.path}
                className="glass-card group relative overflow-hidden p-6 h-full block transition-shadow hover:shadow-2xl hover:shadow-brand-500/20"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </span>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tool.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-3xl pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to simplify your studies?
          </h2>
          <Link to="/gpa" className="btn-primary">
            Get started for free
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
