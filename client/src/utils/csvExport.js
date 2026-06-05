export function downloadCSV(data) {
  let csv = 'Course Code,Credits,Grade,Points\n';
  data.courses.forEach(c => csv += `"${c.code}",${c.credits},${c.grade},${c.points}\n`);
  csv += `\nGPA,${data.gpaResult.gpa}\nTotal Credits,${data.gpaResult.credits}`;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GPA_Report_${data.studentName || 'student'}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}