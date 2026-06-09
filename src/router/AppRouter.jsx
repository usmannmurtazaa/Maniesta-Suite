import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { useTrackPageView } from '../hooks/useAnalytics';

const Home = lazy(() => import('../pages/Home'));
const GPAPage = lazy(() => import('../pages/GPAPage'));
const CGPAPage = lazy(() => import('../pages/CGPAPage'));
const CalculatorPage = lazy(() => import('../pages/CalculatorPage'));
const ConverterPage = lazy(() => import('../pages/ConverterPage'));
const InterestPage = lazy(() => import('../pages/InterestPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
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
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/gpa" element={<GPAPage />} />
        <Route path="/cgpa" element={<CGPAPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/converter" element={<ConverterPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}