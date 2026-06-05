import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BRAND = 'Maniesta Calculator';

export function generatePDF({ userData, resultData, calculatorType }) {
  const doc = new jsPDF();
  doc.setFillColor(108, 99, 255);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(BRAND, 14, 18);
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 100);
  doc.text(`${calculatorType} Report`, 14, 40);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 48);
  let y = 58;
  doc.setFontSize(11);
  doc.text(`Student: ${userData.fullName || 'N/A'}`, 14, y);
  y += 7;
  if (userData.studentId) doc.text(`ID: ${userData.studentId}`, 14, y), y += 7;
  if (userData.university) doc.text(`University: ${userData.university}`, 14, y), y += 7;
  if (userData.semester) doc.text(`Semester: ${userData.semester}`, 14, y), y += 7;

  if (calculatorType === 'GPA') {
    const body = resultData.courses.map(c => [c.name, c.creditHours, c.grade]);
    doc.autoTable({
      head: [['Course', 'Credits', 'Grade']],
      body,
      startY: y + 5,
      theme: 'grid',
      headStyles: { fillColor: [108, 99, 255] },
      margin: { left: 14 },
    });
    doc.text(`GPA: ${resultData.gpa}`, 14, doc.lastAutoTable.finalY + 10);
  } else if (calculatorType === 'CGPA') {
    resultData.semesters.forEach((sem, i) => {
      const body = sem.courses.map(c => [c.name, c.creditHours, c.grade]);
      doc.autoTable({
        head: [[`Semester ${i + 1}`, 'Credits', 'Grade']],
        body,
        startY: i === 0 ? y + 5 : doc.lastAutoTable.finalY + 10,
        theme: 'grid',
        headStyles: { fillColor: [80, 80, 120] },
        margin: { left: 14 },
      });
    });
    doc.text(`CGPA: ${resultData.cgpa}`, 14, doc.lastAutoTable.finalY + 10);
  }
  return doc;
}

export function generateCSV(data, type) {
  let csv = 'Course Name,Credit Hours,Grade\n';
  if (type === 'GPA') {
    data.courses.forEach(c => csv += `"${c.name}",${c.creditHours},${c.grade}\n`);
    csv += `\nGPA,${data.gpa}`;
  } else if (type === 'CGPA') {
    data.semesters.forEach((sem, i) => {
      sem.courses.forEach(c => csv += `${i+1},"${c.name}",${c.creditHours},${c.grade}\n`);
    });
    csv += `\nCGPA,${data.cgpa}`;
  }
  return csv;
}