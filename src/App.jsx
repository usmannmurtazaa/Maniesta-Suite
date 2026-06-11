import { useEffect, useRef, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./router/AppRouter";
import Layout from "./components/layout/Layout";
import { initializeAnalytics } from "./services/firebase";

/**
 * Detects the user's system preference for reduced motion.
 * Returns `true` if the user has requested reduced motion.
 */
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Page transition wrapper that respects `prefers-reduced-motion`.
 * Applies a subtle fade + vertical slide animation on route changes.
 * Note: The animated div re‑mounts on every navigation, causing a deliberate
 * scroll‑to‑top behaviour for each new route.
 */
function AnimatedRoutes() {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  // If the user prefers reduced motion, render without animations
  if (prefersReducedMotion) {
    return (
      <div key={location.pathname}>
        <AppRouter />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AppRouter />
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const analyticsInitialized = useRef(false);

  useEffect(() => {
    // StrictMode guard: ensure analytics is only ever initialized once
    if (!analyticsInitialized.current) {
      analyticsInitialized.current = true;
      try {
        initializeAnalytics();
      } catch (error) {
        console.warn("Analytics initialization failed:", error);
      }
    }
  }, []);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ThemeProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
