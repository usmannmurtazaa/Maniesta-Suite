// src/components/dashboard/widgets/RecentActivityWidget.jsx

// Inline SVG icons – replaces emojis
const ClipboardIcon = () => (
  <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const GraduationIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10l-10-5L2 10l10 5 10-5zM2 10v6c0 2 4 4 10 4s10-2 10-4v-6" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export default function RecentActivityWidget({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="glass-card p-5 text-center text-gray-500">
        No recent activity. Calculate your GPA or convert currency to see it here.
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
        <ClipboardIcon />
        Recent Activity
      </h3>
      <ul className="space-y-2">
        {activities.slice(0, 5).map(act => (
          <li key={act.id} className="text-sm flex justify-between items-center">
            <span className="flex items-center gap-2">
              {act.type === 'gpa' && <><GraduationIcon /> GPA {act.value}</>}
              {act.type === 'currency' && <><CurrencyIcon /> {act.from} → {act.to}: {act.result}</>}
              {act.type === 'export' && <><DocumentIcon /> {act.filename}</>}
            </span>
            <span className="text-gray-400 text-xs">
              {new Date(act.timestamp).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}