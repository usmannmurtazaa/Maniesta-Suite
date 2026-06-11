// src/components/dashboard/widgets/FavoriteToolsWidget.jsx
import { Link } from 'react-router-dom';
import { useDashboard } from '../../../contexts/DashboardProvider';

const TOOL_ICONS = {
  gpa: '📊', cgpa: '📈', currency: '💱', calculator: '🧮', converter: '📐', interest: '💰'
};
const TOOL_PATHS = {
  gpa: '/gpa', cgpa: '/cgpa', currency: '/currency-converter', calculator: '/calculator', converter: '/converter', interest: '/interest'
};

export default function FavoriteToolsWidget({ favorites }) {
  const { toggleFavorite } = useDashboard();
  if (!favorites || favorites.length === 0) {
    return (
      <div className="glass-card p-5 text-center text-gray-500">
        ⭐ Star your favourite tools to see them here.
      </div>
    );
  }
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-3">⭐ Favorite Tools</h3>
      <div className="space-y-2">
        {favorites.map(tool => (
          <div key={tool} className="flex justify-between items-center">
            <Link to={TOOL_PATHS[tool]} className="flex items-center gap-2">
              <span>{TOOL_ICONS[tool]}</span> {tool.toUpperCase()}
            </Link>
            <button onClick={() => toggleFavorite(tool)} className="text-red-500 text-xs">★</button>
          </div>
        ))}
      </div>
    </div>
  );
}