export default function DocumentIcon({ className = "w-5 h-5", ...props }) {
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
      <path d="M4 4h16v16H4V4z" />
      <path d="M8 8h8M8 12h6M8 16h4" />
    </svg>
  );
}