// src/pages/Home.jsx
import { useRef, useState, useEffect, useMemo, lazy, Suspense } from "react";
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

// ----- Tool definitions -----
const tools = [
  {
    name: "GPA Calculator",
    path: "/gpa",
    Icon: CalculatorIcon,
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
    Icon: CalculatorIcon,
    desc: "Length, weight, temperature, and more.",
    gradient: "from-emerald-400 to-green-400",
  },
  {
    name: "Interest",
    path: "/interest",
    Icon: ChartIcon,
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

function AnimatedCounter({ target, label, reducedMotion }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (reducedMotion) {
        setDisplayValue(target);
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

// ========== localStorage helper hook ==========
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

// ========== Activity Insight Panel ==========
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

// ========== Quick Access Strip ==========
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

// ─── Lazy‑loaded bottom section ──────────────────────────────────────
const HomeBottom = lazy(() => import("./HomeBottom"));

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

  return (
    <div className="space-y-24 sm:space-y-28 lg:space-y-32">
      {/* Hero Section – added overflow-hidden to prevent blob overflow */}
      <section className="relative pt-12 sm:pt-16 md:pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-0 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-float animate-delay-1000" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float animate-delay-2000" />
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

          <h1 className="font-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-gradient mb-4 sm:mb-6">
            Outperform,
            <br />
            <span className="text-gradient-animate">
              your own expectations.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            Maniesta Suite is an academic control center designed to help you
            track, calculate, and organize your academic progress with precision
            and confidence. Everything from GPA and CGPA to conversions, live
            currency, and your personal dashboard - all in one premium platform.
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

      <QuickAccessStrip
        lastGPA={lastGPA}
        lastCurrency={lastCurrency}
        lastExport={lastExport}
      />

      {/* SEO Content Preview */}
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-8 p-4 sm:p-6 glass rounded-2xl">
          <h3 className="font-heading text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
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

      {/* Lazy‑loaded below‑fold sections */}
      <Suspense
        fallback={
          <div className="container mx-auto px-4 sm:px-6 space-y-24">
            <div className="glass-card h-64 animate-pulse" />
            <div className="glass-card h-48 animate-pulse" />
          </div>
        }
      >
        <HomeBottom
          favoriteTools={favoriteTools}
          recentToolPath={recentToolPath}
          memoizedTools={memoizedTools}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Suspense>
    </div>
  );
}
