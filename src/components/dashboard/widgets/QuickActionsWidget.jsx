// src/components/dashboard/widgets/QuickActionsWidget.jsx
import { Link } from 'react-router-dom';

// Inline SVG – replaces ⚡
const LightningIcon = () => (
  <svg
    className="w-5 h-5 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ACTIONS = [
  { label: 'GPA Calculator', path: '/gpa', variant: 'primary' },
  { label: 'Currency Converter', path: '/currencyconverter', variant: 'secondary' }, // fixed route
  { label: 'Export Report', path: '/gpa', variant: 'outline' },
];

export default function QuickActionsWidget() {
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <LightningIcon />
        Quick Actions
      </h3>
      <div className="flex flex-col gap-2">
        {ACTIONS.map(action => (
          <Link
            key={action.label}
            to={action.path}
            className={`btn-${action.variant} text-center py-2`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}