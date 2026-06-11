export default function SparkleIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3v1m0 16v1M5 5l1 1m12 12l1 1M3 12h1m16 0h1M5 19l1-1m12-12l1-1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}