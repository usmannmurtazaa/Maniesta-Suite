// src/components/dashboard/widgets/QuickActionsWidget.jsx
import { Link } from 'react-router-dom';

const ACTIONS = [
  { label: 'GPA Calculator', path: '/gpa', variant: 'primary' },
  { label: 'Currency Converter', path: '/currency-converter', variant: 'secondary' },
  { label: 'Export Report', path: '/gpa', variant: 'outline' },
];

export default function QuickActionsWidget() {
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-3">⚡ Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {ACTIONS.map(action => (
          <Link key={action.label} to={action.path} className={`btn-${action.variant} text-center py-2`}>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}