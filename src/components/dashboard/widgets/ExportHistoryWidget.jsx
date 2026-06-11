// src/components/dashboard/widgets/ExportHistoryWidget.jsx
export default function ExportHistoryWidget({ exports }) {
  if (!exports || exports.length === 0) {
    return (
      <div className="glass-card p-5 text-center text-gray-500">
        No exports yet. Generate a PDF or CSV report to see it here.
      </div>
    );
  }
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-3">📎 Recent Exports</h3>
      <ul className="space-y-2">
        {exports.slice(0, 5).map((exp, idx) => (
          <li key={idx} className="text-sm flex justify-between">
            <span>{exp.filename}</span>
            <span className="text-gray-400 text-xs">{new Date(exp.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}