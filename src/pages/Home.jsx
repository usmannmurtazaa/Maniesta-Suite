// src/pages/Home.jsx
import { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useSpring } from "framer-motion";
import {
  GraduationIcon,
  CurrencyIcon,
  DocumentIcon,
  DashboardIcon,
  CalculatorIcon,
  StarIcon,
  RocketIcon,
  SparkleIcon,
  ChartIcon,
  ArrowRightIcon,
} from "../components/icons";

// -------------------------------------------------------------------
// Utility hook: detect reduced motion preference
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

// ----- Tool definitions (icon components used inside the card) -----
const tools = [
  {
    name: "GPA Calculator",
    path: "/gpa",
    Icon: CalculatorIcon, // reuse generic calculator? better to have GPAIcon, but for brevity keep.
    desc: "Compute semester GPA instantly.",
    gradient: "from-brand-400 to-violet-400",
  },
  {
    name: "CGPA Calculator",
    path: "/cgpa",
    Icon: ChartIcon,
    desc: "Cumulative performance tracking.",
    gradient: "from-pink-400 to-rose-400",
  },
  {
    name: "Calculator",
    path: "/calculator",
    Icon: CalculatorIcon,
    desc: "Normal & scientific modes.",
    gradient: "from-cyan-400 to-blue-400",
  },
  {
    name: "Unit Converter",
    path: "/converter",
    Icon: CalculatorIcon, // or specific UnitIcon
    desc: "Length, weight, temperature, and more.",
    gradient: "from-emerald-400 to-green-400",
  },
  {
    name: "Interest",
    path: "/interest",
    Icon: ChartIcon, // or MoneyIcon
    desc: "Simple, compound, loan EMI.",
    gradient: "from-yellow-400 to-amber-400",
  },
  {
    name: "Currency Converter",
    path: "/currencyconverter",
    Icon: CurrencyIcon,
    desc: "Live exchange rates, 150+ currencies.",
    gradient: "from-teal-400 to-cyan-400",
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    Icon: DashboardIcon,
    desc: "Your academic command center.",
    gradient: "from-indigo-400 to-purple-400",
  },
  {
    name: "Contact",
    path: "/contact",
    Icon: DocumentIcon,
    desc: "Get in touch with our team.",
    gradient: "from-fuchsia-400 to-purple-400",
  },
];

const statsData = [
  { label: "Calculators & Tools", target: 8 },
  { label: "Countries", target: 120 },
  { label: "Students", target: 50000 },
];

// AnimatedCounter now respects reduced motion
function AnimatedCounter({ target, label, reducedMotion }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (reducedMotion) {
        setDisplayValue(target); // no spring animation
      } else {
        spring.set(target);
        const unsubscribe = spring.on("change", (latest) => {
          setDisplayValue(Math.round(latest));
        });
        return unsubscribe;
      }
    }
  }, [isInView, target, spring, reducedMotion]);

  const formattedValue =
    label === "Students"
      ? `${(displayValue / 1000).toFixed(0)}k+`
      : displayValue;

  if (reducedMotion) {
    // Static card without motion
    return (
      <div ref={ref} className="glass-card p-4 sm:p-6 text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient mb-2">
          {formattedValue}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-4 sm:p-6 text-center"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient mb-2">
        {formattedValue}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

// ========== localStorage helper hook (optimized) ==========
const STORAGE_KEYS = {
  RECENT_ACTIONS: "maniesta_recent_actions",
  LAST_GPA: "maniesta_last_gpa",
  LAST_CURRENCY: "maniesta_last_currency",
  EXPORT_HISTORY: "maniesta_export_history",
  FAVORITE_TOOLS: "maniesta_favorite_tools",
};

function useUserActivity() {
  const [activity, setActivity] = useState({
    lastGPA: null,
    lastCurrency: null,
    lastExport: null,
    favoriteTools: [],
    recentActions: [],
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      const lastGPA = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LAST_GPA) || "null",
      );
      const lastCurrency = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LAST_CURRENCY) || "null",
      );
      const exports = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.EXPORT_HISTORY) || "[]",
      );
      const lastExport = exports[0] || null;
      const favoriteTools = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.FAVORITE_TOOLS) || "[]",
      );
      const recentActions = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.RECENT_ACTIONS) || "[]",
      );
      // Single state update to avoid cascading re-renders
      setActivity({
        lastGPA,
        lastCurrency,
        lastExport,
        favoriteTools,
        recentActions,
      });
    };

    handleStorageUpdate();
    window.addEventListener("storage-update", handleStorageUpdate);
    return () =>
      window.removeEventListener("storage-update", handleStorageUpdate);
  }, []);

  return { ...activity };
}

// ========== Activity Insight Panel (no emojis) ==========
function ActivityInsightPanel({ lastGPA, lastCurrency, lastExport }) {
  return (
    <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      {lastGPA && (
        <Link
          to="/gpa"
          className="glass inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <GraduationIcon className="w-4 h-4" />
          <span>Last GPA: {lastGPA.gpa} → View Dashboard</span>
        </Link>
      )}
      {lastCurrency && (
        <Link
          to="/currencyconverter"
          className="glass inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <CurrencyIcon className="w-4 h-4" />
          <span>
            Last conversion: {lastCurrency.from} → {lastCurrency.to}
          </span>
        </Link>
      )}
      {lastExport && (
        <Link
          to="/export-guide"
          className="glass inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <DocumentIcon className="w-4 h-4" />
          <span>Last export ready → View Guide</span>
        </Link>
      )}
      {!lastGPA && !lastCurrency && !lastExport && (
        <div className="glass inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
          <SparkleIcon className="w-4 h-4" />
          <span>Start using tools to build your academic dashboard</span>
        </div>
      )}
    </div>
  );
}

// ========== Quick Access Strip (no emojis) ==========
function QuickAccessStrip({ lastGPA, lastCurrency, lastExport }) {
  const items = [];
  if (lastGPA)
    items.push({ label: `GPA: ${lastGPA.gpa}`, link: "/gpa", icon: ChartIcon });
  if (lastCurrency)
    items.push({
      label: `${lastCurrency.from} → ${lastCurrency.to}`,
      link: "/currencyconverter",
      icon: CurrencyIcon,
    });
  if (lastExport)
    items.push({
      label: "View last export",
      link: "/export-guide",
      icon: DocumentIcon,
    });
  items.push({ label: "Open Dashboard", link: "/dashboard", icon: RocketIcon });

  if (items.length === 1 && items[0].label === "Open Dashboard") return null;

  return (
    <div className="container mx-auto px-4 my-6 sm:my-8">
      <div className="glass p-2 sm:p-3 rounded-full overflow-x-auto flex gap-2 items-center whitespace-nowrap scrollbar-hide">
        {items.map((item) => (
          <Link
            key={`${item.link}-${item.label}`}
            to={item.link}
            className="glass inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-white/20 transition-colors"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { lastGPA, lastCurrency, lastExport, favoriteTools, recentActions } =
    useUserActivity();
  const prefersReducedMotion = usePrefersReducedMotion();

  const recentToolPath = (() => {
    const action = recentActions.find(
      (a) => a.type === "gpa" || a.type === "currency",
    );
    if (action?.type === "gpa") return "/gpa";
    if (action?.type === "currency") return "/currencyconverter";
    return null;
  })();

  const memoizedTools = useMemo(() => tools, []);

  // Motion props that respect reduced motion
  const heroMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
      };
  const badgeMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 },
      };
  const featuresHeadingMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
      };
  const finalCTAMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
      };

  return (
    <div className="space-y-24 sm:space-y-28 lg:space-y-32">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 md:pt-20">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-float animate-delay-1000" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float animate-delay-2000" />
        </div>

        <motion.div
          {...heroMotion}
          className="container mx-auto px-4 sm:px-6 max-w-5xl text-center relative"
        >
          <motion.div
            {...badgeMotion}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 sm:px-5 sm:py-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            <SparkleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            <span>New: Live Currency Converter & Dashboard</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-gradient mb-4 sm:mb-6">
            Academic Tools,
            <br />
            <span className="text-gradient-animate">
              Precision for Students.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            Maniesta Suite provides elegant, intuitive calculators for students.
            GPA, CGPA, conversions, live currency, and a personal dashboard —
            all in one premium platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto"
            >
              Go to Dashboard →
            </Link>
            <Link
              to="/gpa"
              className="btn-secondary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto"
            >
              Try GPA Calculator
            </Link>
          </div>

          {/* Stats counters */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto">
            {statsData.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                target={stat.target}
                label={stat.label}
                reducedMotion={prefersReducedMotion}
              />
            ))}
          </div>

          <ActivityInsightPanel
            lastGPA={lastGPA}
            lastCurrency={lastCurrency}
            lastExport={lastExport}
          />
        </motion.div>
      </section>

      {/* Quick Access Strip */}
      <QuickAccessStrip
        lastGPA={lastGPA}
        lastCurrency={lastCurrency}
        lastExport={lastExport}
      />

      {/* SEO Content Preview */}
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-8 p-4 sm:p-6 glass rounded-2xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Academic Tools Quick Guide
          </h3>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-xs sm:text-sm">
            <Link
              to="/gpa-guide"
              className="text-brand-500 hover:underline inline-flex items-center gap-1"
            >
              <GraduationIcon className="w-4 h-4" /> What is GPA?
            </Link>
            <Link
              to="/cgpa-vs-gpa"
              className="text-brand-500 hover:underline inline-flex items-center gap-1"
            >
              <ChartIcon className="w-4 h-4" /> What is CGPA?
            </Link>
            <Link
              to="/export-guide"
              className="text-brand-500 hover:underline inline-flex items-center gap-1"
            >
              <DocumentIcon className="w-4 h-4" /> Why export reports?
            </Link>
            <Link
              to="/how-it-works"
              className="text-brand-500 hover:underline inline-flex items-center gap-1"
            >
              <CurrencyIcon className="w-4 h-4" /> Currency converter for
              students abroad
            </Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-3">
            Quick answers – learn how to boost your academic performance
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 sm:px-6">
        <motion.div
          {...featuresHeadingMotion}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Everything a student needs
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Eight powerful tools + a smart dashboard in one unified experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {memoizedTools.map((tool, i) => {
            const isFavorited = favoriteTools.includes(
              tool.path.replace("/", ""),
            );
            const isRecent = recentToolPath === tool.path;

            const cardMotion = prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 40 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-50px" },
                  transition: { delay: i * 0.05 },
                };

            return (
              <motion.div key={tool.name} {...cardMotion}>
                <Link
                  to={tool.path}
                  className="glass-card group relative overflow-hidden p-4 sm:p-6 h-full block"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                  />
                  <div className="relative z-10">
                    {isRecent && (
                      <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg z-20 inline-flex items-center gap-1">
                        Continue <ArrowRightIcon className="w-3 h-3" />
                      </span>
                    )}
                    {isFavorited && (
                      <span className="absolute top-0 left-0 text-yellow-400 z-20">
                        <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    )}
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} p-2 sm:p-3 text-white mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <tool.Icon className="w-full h-full" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {tool.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl pb-16 sm:pb-20">
        <motion.div
          {...finalCTAMotion}
          className="glass-card p-6 sm:p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Ready to simplify your studies?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of students who trust Maniesta Suite for accurate,
              fast academic calculations and a personalised dashboard.
            </p>
            <Link
              to="/dashboard"
              className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-10 sm:py-4 inline-flex items-center gap-2"
            >
              Launch Dashboard <RocketIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
