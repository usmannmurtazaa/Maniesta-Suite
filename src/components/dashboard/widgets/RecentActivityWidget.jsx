// src/components/dashboard/widgets/RecentActivityWidget.jsx
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
      <h3 className="font-semibold text-lg mb-3">📋 Recent Activity</h3>
      <ul className="space-y-2">
        {activities.slice(0, 5).map(act => (
          <li key={act.id} className="text-sm flex justify-between items-center">
            <span>
              {act.type === 'gpa' && `🎓 GPA ${act.value}`}
              {act.type === 'currency' && `💱 ${act.from} → ${act.to}: ${act.result}`}
              {act.type === 'export' && `📄 ${act.filename}`}
            </span>
            <span className="text-gray-400 text-xs">{new Date(act.timestamp).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}