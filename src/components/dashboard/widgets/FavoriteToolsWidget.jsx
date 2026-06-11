// src/components/dashboard/widgets/FavoriteToolsWidget.jsx
import { Link } from "react-router-dom";
import { useDashboard } from "../../../contexts/DashboardProvider";

/* ── SVG Icons (replace emojis) ───────────────────────────────────── */
const GPAIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v18h18M7 16l4-8 4 4 4-6"
    />
  </svg>
);
const CGPAIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);
const CurrencyIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182" />
  </svg>
);
const CalcIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="12" y2="14" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
);
const ConverterIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);
const InterestIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const FilledStar = () => (
  <svg
    className="w-4 h-4 text-yellow-500"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const EmptyStar = () => (
  <svg
    className="w-4 h-4 text-red-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ── Mappings (fixed currency route) ──────────────────────────────── */
const TOOL_ICONS = {
  gpa: <GPAIcon />,
  cgpa: <CGPAIcon />,
  currency: <CurrencyIcon />,
  calculator: <CalcIcon />,
  converter: <ConverterIcon />,
  interest: <InterestIcon />,
};

const TOOL_PATHS = {
  gpa: "/gpa",
  cgpa: "/cgpa",
  currency: "/currencyconverter", // fixed – was /currency-converter
  calculator: "/calculator",
  converter: "/converter",
  interest: "/interest",
};

export default function FavoriteToolsWidget({ favorites }) {
  const { toggleFavorite } = useDashboard();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="glass-card p-5 text-center text-gray-500">
        {/* Inline SVG star – replaces ⭐ */}
        <span className="inline-flex items-center gap-1">
          <FilledStar /> Star your favourite tools to see them here.
        </span>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <FilledStar />
        Favorite Tools
      </h3>
      <div className="space-y-2">
        {favorites.map((tool) => (
          <div key={tool} className="flex justify-between items-center">
            <Link to={TOOL_PATHS[tool]} className="flex items-center gap-2">
              {TOOL_ICONS[tool]}
              <span>{tool.toUpperCase()}</span>
            </Link>
            <button
              type="button"
              onClick={() => toggleFavorite(tool)}
              className="text-red-500 text-xs"
              aria-label={`Remove ${tool} from favorites`}
            >
              <EmptyStar />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
