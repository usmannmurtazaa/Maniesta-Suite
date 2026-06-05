import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generatePDF(data) {
  const doc = new jsPDF();
  // Header
  doc.setFillColor(108, 99, 255);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Maniesta GPA Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Date: ${data.date}`, 14, 27);

  // Student info
  doc.setTextColor(40);
  doc.setFontSize(12);
  let y = 40;
  if (data.studentName) doc.text(`Name: ${data.studentName}`, 14, y += 7);
  if (data.studentId) doc.text(`ID: ${data.studentId}`, 14, y += 7);
  if (data.university) doc.text(`University: ${data.university}`, 14, y += 7);
  if (data.semester) doc.text(`Semester: ${data.semester}`, 14, y += 7);

  // Course table
  const body = data.courses.map(c => [c.code, c.credits, c.grade, c.points]);
  doc.autoTable({
    startY: y + 6,
    head: [['Course Code', 'Credits', 'Grade', 'Points']],
    body,
    theme: 'striped',
    headStyles: { fillColor: [108, 99, 255] },
    styles: { fontSize: 10 },
    margin: { left: 14 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(108, 99, 255);
  doc.text(`GPA: ${data.gpaResult.gpa}  |  Credits: ${data.gpaResult.credits}`, 14, finalY);
  doc.save(`GPA_Report_${data.studentName || 'student'}.pdf`);
}