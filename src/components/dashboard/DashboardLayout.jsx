import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../../contexts/DashboardProvider";
import {
  DashboardIcon,
  GraduationIcon,
  CurrencyIcon,
  CalculatorIcon,
  DocumentIcon,
  ChartIcon,
} from "../icons";

/* ── Reduced‑motion hook ──────────────────────────────────────────── */
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

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { path: "/gpa", label: "GPA", icon: ChartIcon },
  { path: "/cgpa", label: "CGPA", icon: GraduationIcon },
  { path: "/currencyconverter", label: "Currency", icon: CurrencyIcon },
  { path: "/converter", label: "Convert", icon: CalculatorIcon },
  { path: "/export-guide", label: "Exports", icon: DocumentIcon },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { recentActions } = useDashboard();
  const reducedMotion = usePrefersReducedMotion();

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Helper to render icon component
  const renderIcon = (IconComponent, className = "w-5 h-5") => (
    <IconComponent className={className} />
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 glass border-r border-white/20 dark:border-white/10 h-screen sticky top-0 overflow-y-auto">
        <div className="p-5">
          <Link to="/" className="font-brand text-2xl font-bold text-gradient block mb-8">
            Maniesta
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-brand text-white shadow-brand"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/10"
                }`}
              >
                {renderIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Quick stats */}
          <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10">
            <p className="text-xs text-gray-500 mb-2">Recent actions</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {recentActions.slice(0, 3).map((action) => (
                <li
                  key={action.id}
                  className="flex items-center gap-2 truncate"
                >
                  {action.type === "gpa" && (
                    <>
                      {renderIcon(ChartIcon, "w-3 h-3")}
                      <span>GPA: {action.value}</span>
                    </>
                  )}
                  {action.type === "currency" && (
                    <>
                      {renderIcon(CurrencyIcon, "w-3 h-3")}
                      <span>
                        {action.from} → {action.to}
                      </span>
                    </>
                  )}
                  {action.type === "export" && (
                    <>
                      {renderIcon(DocumentIcon, "w-3 h-3")}
                      <span>{action.filename}</span>
                    </>
                  )}
                </li>
              ))}
              {recentActions.length === 0 && (
                <li className="flex items-center gap-2">
                  <span>No recent activity</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Header + Drawer */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden glass sticky top-0 z-10 px-4 py-3 flex justify-between items-center border-b border-white/20">
          <button
            type="button"
            onClick={toggleSidebar}
            className="glass p-2 rounded-xl"
            aria-label="Menu"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link to="/" className="font-brand text-xl font-bold text-gradient">
            Maniesta
          </Link>
          <div className="w-8" />
        </header>

        {/* Mobile Sidebar Drawer */}
        {reducedMotion ? (
          /* Static sidebar – no animations */
          isSidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={toggleSidebar}
              />
              <aside className="fixed top-0 left-0 h-full w-64 glass z-50 md:hidden shadow-xl">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="font-brand text-2xl font-bold text-gradient">
                      Maniesta
                    </Link>
                    <button
                      type="button"
                      onClick={toggleSidebar}
                      className="glass p-2 rounded-full"
                      aria-label="Close"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={toggleSidebar}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                          isActive(item.path)
                            ? "bg-gradient-brand text-white shadow-brand"
                            : "text-gray-700 dark:text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {renderIcon(item.icon)}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </aside>
            </>
          )
        ) : (
          /* Animated sidebar */
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={toggleSidebar}
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed top-0 left-0 h-full w-64 glass z-50 md:hidden shadow-xl"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-8">
                      <Link to="/" className="font-brand text-2xl font-bold text-gradient">
                        Maniesta
                      </Link>
                      <button
                        type="button"
                        onClick={toggleSidebar}
                        className="glass p-2 rounded-full"
                        aria-label="Close"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={toggleSidebar}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                            isActive(item.path)
                              ? "bg-gradient-brand text-white shadow-brand"
                              : "text-gray-700 dark:text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          {renderIcon(item.icon)}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden glass border-t border-white/20 dark:border-white/10 fixed bottom-0 left-0 right-0 z-10 flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                isActive(item.path)
                  ? "text-brand-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {renderIcon(item.icon, "w-5 h-5")}
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}