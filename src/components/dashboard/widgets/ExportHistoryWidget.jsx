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
      <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
        {/* Inline SVG icon – replaces 📎 */}
        <svg
          className="w-5 h-5 text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
        Recent Exports
      </h3>
      <ul className="space-y-2">
        {exports.slice(0, 5).map((exp, idx) => (
          <li key={idx} className="text-sm flex justify-between">
            <span>{exp.filename}</span>
            <span className="text-gray-400 text-xs">
              {new Date(exp.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}