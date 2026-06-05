// Thin wrapper around the existing exportHelpers to match the expected import
import { generatePDF as generate } from './exportHelpers';

export async function generatePDF(data) {
  // Adapt the shape if needed – the existing generatePDF expects { userData, resultData, calculatorType }
  // For CGPA, we'll call it with the structure expected by the ExportModal
  // But for standalone use we can provide a simpler adapter.
  const doc = generate({
    userData: {
      fullName: data.studentName || 'Student',
      studentId: data.studentId || '',
      university: data.university || '',
      semester: data.semester || '',
    },
    resultData: {
      semesters: data.semesters.map((gpa, idx) => ({
        name: `Semester ${idx + 1}`,
        courses: [{ name: 'GPA', creditHours: 1, grade: 'GPA' }], // placeholder
        gpa,
      })),
      cgpa: data.cgpaResult,
    },
    calculatorType: 'CGPA',
  });
  doc.save(`CGPA_Report.pdf`);
}