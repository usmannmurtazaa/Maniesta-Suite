// src/components/dashboard/widgets/GPAWidget.jsx
import { Link } from 'react-router-dom';

export default function GPAWidget({ lastGPA }) {
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-lg mb-2">📊 Current GPA</h3>
      {lastGPA ? (
        <>
          <p className="text-3xl font-bold text-gradient">{lastGPA.gpa}</p>
          <p className="text-sm text-gray-500">Based on {lastGPA.credits} credits</p>
          <Link to="/gpa" className="text-brand-500 text-sm mt-2 inline-block">Recalculate →</Link>
        </>
      ) : (
        <>
          <p className="text-gray-500">No GPA calculated yet.</p>
          <Link to="/gpa" className="text-brand-500 text-sm mt-2 inline-block">Calculate GPA →</Link>
        </>
      )}
    </div>
  );
}