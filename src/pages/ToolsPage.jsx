import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

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

// SVG Icons (professional, with aria-hidden)
const GPAIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const CGPAIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
  </svg>
);

const ScientificIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const StandardIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h16v16H4V4zm4 4h8M8 12h2m2 0h2m-6 4h2m2 0h2"
    />
  </svg>
);

const InterestIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
    />
  </svg>
);

const UnitIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6l3-3 3 3M9 3v14M21 18l-3 3-3-3M15 21V7"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182"
    />
  </svg>
);

const PDFIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CSVIcon = () => (
  <svg
    className="w-8 h-8 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

const tools = [
  {
    category: "Academic Tools",
    name: "GPA Calculator",
    description: "Calculate your semester GPA instantly",
    path: "/gpa",
    icon: <GPAIcon />,
  },
  {
    category: "Academic Tools",
    name: "CGPA Calculator",
    description: "Cumulative GPA across semesters",
    path: "/cgpa",
    icon: <CGPAIcon />,
  },
  {
    category: "Calculators",
    name: "Scientific Calculator",
    description: "Trigonometry, logarithms, and more",
    path: "/calculator",
    icon: <ScientificIcon />,
  },
  {
    category: "Calculators",
    name: "Standard Calculator",
    description: "Basic arithmetic and memory",
    path: "/calculator",
    icon: <StandardIcon />,
  },
  {
    category: "Calculators",
    name: "Interest Calculator",
    description: "Simple, compound, and loan EMI",
    path: "/interest",
    icon: <InterestIcon />,
  },
  {
    category: "Utilities",
    name: "Unit Converter",
    description: "Length, weight, temperature, and more",
    path: "/converter",
    icon: <UnitIcon />,
  },
  {
    category: "Utilities",
    name: "Currency Converter",
    description: "Live exchange rates",
    path: "/currencyconverter",
    icon: <CurrencyIcon />,
  },
  {
    category: "Export Tools",
    name: "PDF Export",
    description: "Professional academic reports",
    path: "/export-guide",
    icon: <PDFIcon />,
  },
  {
    category: "Export Tools",
    name: "CSV Export",
    description: "Spreadsheet-ready data",
    path: "/export-guide",
    icon: <CSVIcon />,
  },
];

const categories = [
  ...new Map(tools.map((t) => [t.category, t.category])).keys(),
];

export default function Tools() {
  const [search, setSearch] = useState("");
  const reducedMotion = usePrefersReducedMotion();

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()),
  );

  // Group filtered tools by category preserving order of categories
  const groupedTools = categories
    .map((cat) => ({
      category: cat,
      tools: filteredTools.filter((t) => t.category === cat),
    }))
    .filter((group) => group.tools.length > 0);

  // ── Motion props ──────────────────────────────────────────────────
  const heroProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      };

  return (
    <>
      <SEO
        title="All Tools – GPA, CGPA, Calculators & Converters"
        description="Explore all free student tools: GPA calculator, CGPA calculator, scientific calculator, unit converter, currency converter, and PDF/CSV export. No signup required."
        keywords="tools, GPA calculator, CGPA calculator, scientific calculator, unit converter, currency converter, PDF export, CSV export"
        canonicalUrl="https://maniestasuite.netlify.app/tools"
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Hero Section */}
        <motion.div {...heroProps} className="text-center mb-12">
          <h1 className="font-hero text-4xl md:text-5xl font-extrabold text-gradient mb-4">
            All Tools in One Place
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access GPA, CGPA, calculators, converters and export tools instantly
            – all free, no signup required. Need help? Use our{" "}
            <span className="text-brand-500">AI Chat Assistant</span>.
          </p>
        </motion.div>

        {/* Search / Filter */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Search tools by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base w-full"
            aria-label="Search tools"
          />
        </div>

        {/* Tool Sections */}
        {groupedTools.length > 0 ? (
          reducedMotion ? (
            // Static layout without animations
            <div className="space-y-16">
              {groupedTools.map((group) => (
                <div key={group.category}>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center md:text-left">
                    {group.category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.tools.map((tool) => (
                      <Link key={tool.name} to={tool.path}>
                        <div className="glass-card p-6 h-full flex flex-col items-start gap-3 hover:shadow-brand-lg transition-all break-words">
                          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20">
                            {tool.icon}
                          </div>
                          <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Animated layout
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-16"
            >
              {groupedTools.map((group) => (
                <motion.div
                  key={group.category}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center md:text-left">
                    {group.category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.tools.map((tool) => (
                      <Link key={tool.name} to={tool.path}>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="glass-card p-6 h-full flex flex-col items-start gap-3 hover:shadow-brand-lg transition-all break-words"
                        >
                          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20">
                            {tool.icon}
                          </div>
                          <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {tool.description}
                          </p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No tools match your search. Try a different keyword.
            </p>
          </div>
        )}

        {/* Back to home link */}
        <div className="mt-16 text-center">
          <Link to="/" className="btn-secondary inline-flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}