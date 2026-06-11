export default function GraduationIcon({ className = "w-5 h-5", ...props }) {
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
      <path d="M12 3L2 9l10 6 10-6-10-6z" />
      <path d="M2 9v7l10 6 10-6V9" />
      <path d="M12 22v-7" />
    </svg>
  );
}