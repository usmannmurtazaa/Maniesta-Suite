import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../common/ThemeToggle";

const links = [
  { to: "/gpa", label: "GPA" },
  { to: "/cgpa", label: "CGPA" },
  { to: "/calculator", label: "Calc" },
  { to: "/converter", label: "Convert" },
  { to: "/interest", label: "Interest" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/20 dark:border-white/10 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className="text-2xl font-extrabold text-gradient tracking-tight"
        >
          Maniesta
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                location.pathname === link.to
                  ? "bg-brand-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/10"
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full"
                />
              )}
            </Link>
          ))}
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="glass w-10 h-10 flex items-center justify-center rounded-xl"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-white/20 dark:border-white/10"
          >
            <div className="container mx-auto py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-base font-medium ${
                    location.pathname === link.to
                      ? "bg-brand-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
