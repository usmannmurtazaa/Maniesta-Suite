export default function RocketIcon({ className = "w-5 h-5", ...props }) {
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
      <path d="M12 15l-3-3m0 0l3-3-3 3zm0 0l3 3-3-3z" />
      <path d="M12 4v3m0 0l-3 3m3-3l3 3m-6 5l3 3" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}