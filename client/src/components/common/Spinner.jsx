export default function Spinner({ className = '' }) {
  return (
    <div className={`w-6 h-6 border-2 border-t-brand-500 border-gray-200 dark:border-gray-700 rounded-full animate-spin ${className}`} role="status" />
  );
}