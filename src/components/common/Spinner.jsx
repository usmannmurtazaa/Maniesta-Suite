import { useState, useEffect } from 'react';

/**
 * Local hook to detect the user’s motion preference.
 * Used as a fallback if the consumer doesn’t pass `reducedMotion`.
 */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

export default function Spinner({
  className = '',
  size = 'md',
  logo = false,
  reducedMotion,
}) {
  // If parent doesn’t supply reducedMotion, use the local hook
  const systemReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = reducedMotion === undefined ? !systemReducedMotion : !reducedMotion;

  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  };

  // Maniesta logo SVG – only rendered when `logo` is true
  const LogoMark = logo ? (
    <svg
      className="absolute inset-0 m-auto w-4 h-4 font-brand text-2xl"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2zm0 2.18l7 3.75v7.07c0 4.12-2.88 7.97-7 9.2-4.12-1.23-7-5.08-7-9.2V7.93l7-3.75zm-.5 4.82v6h1v-6h-1zm-1.5 0v6h1v-6h-1zm2.5 0v6h1v-6h-1z" />
    </svg>
  ) : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-t-brand-500 border-gray-200 dark:border-gray-700 rounded-full ${shouldAnimate ? 'animate-spin' : ''}`}
      />
      {LogoMark}
    </div>
  );
}