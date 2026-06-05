// Thin wrapper around existing exportHelpers to provide CSV download
import { generateCSV } from './exportHelpers';

export function downloadCSV(data) {
  const csv = generateCSV(
    {
      semesters: data.semesters.map((gpa, idx) => ({
        name: `Semester ${idx + 1}`,
        courses: [{ name: 'GPA', creditHours: 1, grade: 'GPA' }],
        gpa,
      })),
      cgpa: data.cgpaResult,
    },
    'CGPA'
  );
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CGPA_Report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}