import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useSpring } from "framer-motion";

const tools = [
  {
    name: "GPA Calculator",
    path: "/gpa",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    desc: "Compute semester GPA instantly.",
    gradient: "from-brand-400 to-violet-400",
  },
  {
    name: "CGPA Calculator",
    path: "/cgpa",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    desc: "Cumulative performance tracking.",
    gradient: "from-pink-400 to-rose-400",
  },
  {
    name: "Calculator",
    path: "/calculator",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 4h16v16H4V4zm4 4h8M8 12h2m2 0h2m-6 4h2m2 0h2" />
      </svg>
    ),
    desc: "Normal & scientific modes.",
    gradient: "from-cyan-400 to-blue-400",
  },
  {
    name: "Unit Converter",
    path: "/converter",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 6l3-3 3 3M9 3v14M21 18l-3 3-3-3M15 21V7" />
      </svg>
    ),
    desc: "Length, currency, temperature…",
    gradient: "from-emerald-400 to-green-400",
  },
  {
    name: "Interest",
    path: "/interest",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    desc: "Simple, compound, loan EMI.",
    gradient: "from-yellow-400 to-amber-400",
  },
  {
    name: "Contact",
    path: "/contact",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    desc: "Get in touch with our team.",
    gradient: "from-fuchsia-400 to-purple-400",
  },
];

const statsData = [
  { label: "Calculators", target: 7 },
  { label: "Countries", target: 120 },
  { label: "Students", target: 50000 },
];

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
      className="glass-card p-6 text-center"
    >
      <div className="text-4xl md:text-5xl font-extrabold text-gradient mb-2">
        {label === "Students"
          ? `${(displayValue / 1000).toFixed(0)}k+`
          : displayValue}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20">
        {/* Large background gradient mesh */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-float animate-delay-1000" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float animate-delay-2000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="container mx-auto px-4 max-w-5xl text-center relative"
        >
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            New: Export reports as PDF
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gradient mb-6">
            Academic Tools,
            <br />
            <span className="text-gradient-animate">Redesigned.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Maniesta Suite provides elegant, intuitive calculators for students.
            GPA, CGPA, conversions, and more — all in one premium platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/gpa" className="btn-primary text-lg px-8 py-4">
              Start calculating →
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              Explore tools
            </a>
          </div>

          {/* Premium stats counter */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {statsData.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                target={stat.target}
                label={stat.label}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything a student needs
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Seven powerful tools in one unified experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                className="glass-card group relative overflow-hidden p-6 h-full block"
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} p-3 text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 max-w-4xl pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to simplify your studies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of students who trust Maniesta Suite for accurate,
              fast academic calculations.
            </p>
            <Link to="/gpa" className="btn-primary text-lg px-10 py-4">
              Get started for free
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
