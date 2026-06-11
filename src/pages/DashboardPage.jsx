// src/pages/DashboardPage.jsx
import { useDashboard } from '../contexts/DashboardProvider';
import RecentActivityWidget from '../components/dashboard/widgets/RecentActivityWidget';
import GPAWidget from '../components/dashboard/widgets/GPAWidget';
import CurrencyWidget from '../components/dashboard/widgets/CurrencyWidget';
import FavoriteToolsWidget from '../components/dashboard/widgets/FavoriteToolsWidget';
import ExportHistoryWidget from '../components/dashboard/widgets/ExportHistoryWidget';
import QuickActionsWidget from '../components/dashboard/widgets/QuickActionsWidget';
// We'll integrate AI ChatBot widget later (not rebuilt)

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
          {/* AI Chat integration: we will add a simple card that opens the chat */}
          <div className="glass-card p-4">
            <p className="text-sm text-gray-500">💡 AI Assistant</p>
            <p className="text-md">Need help with GPA, CGPA or export? Ask Maniesta AI.</p>
            <button
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