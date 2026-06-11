export default function CurrencyIcon({ className = "w-5 h-5", ...props }) {
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
      <path d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182" />
    </svg>
  );
}