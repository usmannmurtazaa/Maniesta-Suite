import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../common/ThemeToggle";

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

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/gpa", label: "GPA" },
  { to: "/cgpa", label: "CGPA" },
  { to: "/calculator", label: "Calc" },
  { to: "/converter", label: "Convert" },
  { to: "/currencyconverter", label: "Currency" },
  { to: "/interest", label: "Interest" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrolledRef = useRef(false);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Body scroll lock when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Focus management
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 100);
    }
  }, [mobileOpen]);

  // Trap focus inside drawer
  useEffect(() => {
    if (!mobileOpen || !drawerRef.current) return;

    const trapFocus = (e) => {
      if (e.key !== "Tab") return;
      const focusable = drawerRef.current.querySelectorAll(
        'a, button, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [mobileOpen]);

  // Drawer content – close button sticky inside scroll area
  const MobileDrawerContent = (
    <div className="flex flex-col" ref={drawerRef}>
      <div className="sticky top-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl z-10 flex justify-end px-4 pt-3 pb-1 border-b border-white/20 dark:border-white/10">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={() => setMobileOpen(false)}
          className="glass w-11 h-11 flex items-center justify-center rounded-xl"
          aria-label="Close menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="container mx-auto py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            aria-current={
              location.pathname === link.to ? "page" : undefined
            }
            className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
              location.pathname === link.to
                ? "bg-gradient-brand text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-white/10 shadow-glass"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        {/* Enhanced Logo */}
        <Link
          to="/"
          className={`font-brand text-2xl md:text-3xl font-extrabold text-gradient text-gradient-animate tracking-tight hover:opacity-80 transition-opacity ${
            prefersReducedMotion ? "" : "animate-pulse-soft"
          }`}
        >
          Maniesta
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-gradient-brand rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="glass w-11 h-11 flex items-center justify-center rounded-xl"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            type="button"
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

      {/* Overlay – locks background scroll when open */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />
      )}

      {/* Mobile nav drawer */}
      {prefersReducedMotion ? (
        mobileOpen && (
          <div className="md:hidden overflow-y-auto glass border-t border-white/20 dark:border-white/10 pb-[env(safe-area-inset-bottom,0px)] max-h-[80vh] z-50 relative">
            {MobileDrawerContent}
          </div>
        )
      ) : (
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 500, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-y-auto glass border-t border-white/20 dark:border-white/10 pb-[env(safe-area-inset-bottom,0px)] max-h-[80vh] z-50 relative"
            >
              {MobileDrawerContent}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}