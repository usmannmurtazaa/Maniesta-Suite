// src/utils/grades.js
export function getStanding(gpa, scale = 4.0) {
  const ratio = gpa / scale;
  if (ratio >= 0.9) return { t: 'Excellent', color: '#7c3aed' };
  if (ratio >= 0.8) return { t: 'Very Good', color: '#3b82f6' };
  if (ratio >= 0.7) return { t: 'Good', color: '#10b981' };
  if (ratio >= 0.6) return { t: 'Satisfactory', color: '#f59e0b' };
  return { t: 'Needs Improvement', color: '#ef4444' };
}