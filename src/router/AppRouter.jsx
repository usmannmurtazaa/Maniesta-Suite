import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import { useTrackPageView } from "../hooks/useAnalytics";

// Existing pages
const Home = lazy(() => import("../pages/Home"));
const GPAPage = lazy(() => import("../pages/GPAPage"));
const CGPAPage = lazy(() => import("../pages/CGPAPage"));
const CalculatorPage = lazy(() => import("../pages/CalculatorPage"));
const ConverterPage = lazy(() => import("../pages/ConverterPage"));
const CurrencyConverterPage = lazy(() => import("../pages/CurrencyConverterPage"));
const InterestPage = lazy(() => import("../pages/InterestPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Phase 1 pages
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const Terms = lazy(() => import("../pages/Terms"));
const FAQ = lazy(() => import("../pages/FAQ"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));
const ExportGuide = lazy(() => import("../pages/ExportGuide"));
const GPA_Guide = lazy(() => import("../pages/GPA_Guide"));
const CGPA_vs_GPA = lazy(() => import("../pages/CGPA_vs_GPA"));

// New Phase 2 pages
const HowToCalculateGPA = lazy(() => import("../pages/HowToCalculateGPA"));
const HowToCalculateCGPA = lazy(() => import("../pages/HowToCalculateCGPA"));
const GPAImprovementTips = lazy(() => import("../pages/GPAImprovementTips"));
const GPAGradingScaleGuide = lazy(
  () => import("../pages/GPAGradingScaleGuide"),
);
const GPAToPercentageGuide = lazy(
  () => import("../pages/GPAToPercentageGuide"),
);
const ToolsPage = lazy(() => import("../pages/ToolsPage"));
const MediaKit = lazy(() => import("../pages/MediaKit"));
// Dashboard page
const DashboardPage = lazy(() => import("../pages/DashboardPage"));

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

function LoadingFallback() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner size="lg" />
      <p
        className={`text-sm text-gray-500 dark:text-gray-400 ${
          reducedMotion ? "" : "animate-pulse"
        }`}
      >
        Loading...
      </p>
    </div>
  );
}

export default function AppRouter() {
  const location = useLocation();
  useTrackPageView(location.pathname);

  return (
    <Suspense fallback={<LoadingFallback />}>
      {/* Removed key={location.pathname} to prevent unnecessary remounting */}
      <Routes location={location}>
        {/* Existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gpa" element={<GPAPage />} />
        <Route path="/cgpa" element={<CGPAPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/converter" element={<ConverterPage />} />
        <Route path="/currencyconverter" element={<CurrencyConverterPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Phase 1 routes */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/export-guide" element={<ExportGuide />} />
        <Route path="/gpa-guide" element={<GPA_Guide />} />
        <Route path="/cgpa-vs-gpa" element={<CGPA_vs_GPA />} />

        {/* New Phase 2 routes */}
        <Route path="/how-to-calculate-gpa" element={<HowToCalculateGPA />} />
        <Route path="/how-to-calculate-cgpa" element={<HowToCalculateCGPA />} />
        <Route path="/gpa-improvement-tips" element={<GPAImprovementTips />} />
        <Route path="/grading-scale-guide" element={<GPAGradingScaleGuide />} />
        <Route path="/gpa-to-percentage" element={<GPAToPercentageGuide />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/mediaKit" element={<MediaKit />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
