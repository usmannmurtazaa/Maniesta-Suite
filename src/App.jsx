import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./router/AppRouter";
import Layout from "./components/layout/Layout";
import { initializeAnalytics } from "./services/firebase";

function AnimatedRoutes() {
  const location = useLocation();
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
  useEffect(() => {
    try {
      initializeAnalytics();
    } catch (error) {
      console.warn("Analytics initialization failed:", error);
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
