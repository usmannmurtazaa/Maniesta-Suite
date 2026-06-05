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

export default function AppRouter() {
  const location = useLocation();
  useTrackPageView(location.pathname);
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
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