// src/pages/DashboardPage.jsx
import { useDashboard } from '../contexts/DashboardProvider';
import RecentActivityWidget from '../components/dashboard/widgets/RecentActivityWidget';
import GPAWidget from '../components/dashboard/widgets/GPAWidget';
import CurrencyWidget from '../components/dashboard/widgets/CurrencyWidget';
import FavoriteToolsWidget from '../components/dashboard/widgets/FavoriteToolsWidget';
import ExportHistoryWidget from '../components/dashboard/widgets/ExportHistoryWidget';
import QuickActionsWidget from '../components/dashboard/widgets/QuickActionsWidget';

// Inline SVG icon – replaces 💡
const LightbulbIcon = () => (
  <svg
    className="w-5 h-5 text-brand-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export default function DashboardPage() {
  const { recentActions, lastGPA, lastCurrency, exportHistory, favoriteTools } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Academic Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <GPAWidget lastGPA={lastGPA} />
          <CurrencyWidget lastCurrency={lastCurrency} />
          <QuickActionsWidget />
        </div>

        {/* Middle column */}
        <div className="space-y-6">
          <RecentActivityWidget activities={recentActions} />
          <FavoriteToolsWidget favorites={favoriteTools} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ExportHistoryWidget exports={exportHistory} />
          {/* AI Chat card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2">
              <LightbulbIcon />
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
            <p className="text-md mt-1">Need help with GPA, CGPA or export? Ask Maniesta AI.</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
              className="btn-secondary text-sm mt-2 w-full"
            >
              Open Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}