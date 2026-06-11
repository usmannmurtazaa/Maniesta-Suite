// src/components/common/Spinner.jsx

export default function Spinner({ className = '', size = 'md', logo = false }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  };

  // Maniesta logo SVG – only rendered when `logo` is true
  const LogoMark = logo ? (
    <svg
      className="absolute inset-0 m-auto w-4 h-4 text-brand-500"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2zm0 2.18l7 3.75v7.07c0 4.12-2.88 7.97-7 9.2-4.12-1.23-7-5.08-7-9.2V7.93l7-3.75zm-.5 4.82v6h1v-6h-1zm-1.5 0v6h1v-6h-1zm2.5 0v6h1v-6h-1z" />
    </svg>
  ) : null;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-t-brand-500 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}
      />
      {LogoMark}
    </div>
  );
}