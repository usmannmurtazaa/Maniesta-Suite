// src/utils/pdfExport.js
import { getStanding } from './grades';

// ── Colour helpers ────────────────────────────────────────────────
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

// ── Main builder ──────────────────────────────────────────────────
async function buildPDF(doc, data) {
  const {
    studentName = 'Student',
    studentId = '',
    university = '',
    semester = '',
    date = new Date().toLocaleDateString(),
    scale = '4.0',
    type = 'GPA',                 // 'GPA' | 'CGPA'
    courses = [],                 // used for GPA
    semesters = [],               // used for CGPA
    gpaResult = {},               // { gpa, credits, points }
    cgpaResult = {},              // { cgpa, total, best }
  } = data;

  const isCGPA = type === 'CGPA' || semesters.length > 0;
  const primary = [99, 102, 241];          // Indigo‑violet (Maniesta)
  const primaryLight = [165, 148, 249];
  const darkText = [40, 40, 40];
  const mutedText = [100, 100, 100];
  const bgLight = [245, 243, 255];
  const white = [255, 255, 255];

  let yPos = 30;

  const checkPageBreak = (neededSpace = 10) => {
    if (yPos + neededSpace > 275) {
      doc.addPage();
      addPageHeader(doc, data, yPos = 30);
    }
  };

  const addPageHeader = (docInstance, d, startY) => {
    docInstance.setFillColor(...primary);
    docInstance.rect(0, 0, 210, 35, 'F');
    docInstance.setFont('helvetica', 'bold');
    docInstance.setTextColor(...white);
    docInstance.setFontSize(20);
    docInstance.text('Maniesta Calculator', 105, 20, { align: 'center' });
    docInstance.setFontSize(9);
    docInstance.setTextColor(...primaryLight);
    docInstance.text('Academic Excellence Suite', 105, 28, { align: 'center' });
  };

  // Initial header
  addPageHeader(doc, data, yPos);

  // Title
  checkPageBreak(25);
  yPos += 18;
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.line(15, yPos - 8, 195, yPos - 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primary);
  doc.text(isCGPA ? 'CUMULATIVE GPA REPORT' : 'ACADEMIC RECORD', 105, yPos, { align: 'center' });
  yPos += 15;

  // ── Student Info ────────────────────────────────────────────
  checkPageBreak(50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primary);
  doc.text('Student Information', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`Name: ${studentName}`, 25, yPos); yPos += 7;
  if (studentId) { doc.text(`Student ID: ${studentId}`, 25, yPos); yPos += 7; }
  if (university) { doc.text(`Institution: ${university}`, 25, yPos); yPos += 7; }
  if (semester) { doc.text(`Semester: ${semester}`, 25, yPos); yPos += 7; }
  doc.text(`Generated: ${date}`, 25, yPos);
  yPos += 12;

  // ── Courses / Semesters table ───────────────────────────────
  checkPageBreak(20);
  doc.setDrawColor(...[180, 180, 200]);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primary);
  doc.text(isCGPA ? 'Semester Summary' : 'Course Details', 20, yPos);
  yPos += 8;

  // Table header
  checkPageBreak(10);
  doc.setFillColor(...primary);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...white);
  if (isCGPA) {
    doc.text('Semester', 25, yPos + 5.5);
    doc.text('GPA', 80, yPos + 5.5);
    doc.text('Credits', 115, yPos + 5.5);
    doc.text('Status', 155, yPos + 5.5);
  } else {
    doc.text('Course Code', 25, yPos + 5.5);
    doc.text('Credits', 80, yPos + 5.5);
    doc.text('Grade', 115, yPos + 5.5);
    doc.text('Points', 155, yPos + 5.5);
  }
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);

  const tableRows = isCGPA
    ? semesters.map((sem, idx) => ({ name: `Semester ${idx + 1}`, ...sem }))
    : courses;

  tableRows.forEach((row, index) => {
    checkPageBreak(7);
    if (yPos > 250) {
      doc.addPage();
      addPageHeader(doc, data, yPos = 30);
      // Re‑draw header
      doc.setFillColor(...primary);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...white);
      if (isCGPA) {
        doc.text('Semester', 25, yPos + 5.5);
        doc.text('GPA', 80, yPos + 5.5);
        doc.text('Credits', 115, yPos + 5.5);
        doc.text('Status', 155, yPos + 5.5);
      } else {
        doc.text('Course Code', 25, yPos + 5.5);
        doc.text('Credits', 80, yPos + 5.5);
        doc.text('Grade', 115, yPos + 5.5);
        doc.text('Points', 155, yPos + 5.5);
      }
      yPos += 10;
    }

    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(...bgLight);
      doc.rect(20, yPos - 4, 170, 7, 'F');
    }
    doc.setFontSize(10);
    if (isCGPA) {
      doc.text(row.name, 25, yPos);
      doc.text(String(row.gpa || row.cgpa || '—'), 80, yPos);
      doc.text(String(row.credits ?? '—'), 115, yPos);
      doc.text(String(row.status ?? '—'), 155, yPos);
    } else {
      doc.text(String(row.code || row.name || '—'), 25, yPos);
      doc.text(String(row.credits ?? 0), 80, yPos);
      doc.text(String(row.grade || '—'), 115, yPos);
      doc.text(String(row.points ?? '0'), 155, yPos);
    }
    yPos += 7;
  });

  // ── Academic Summary ─────────────────────────────────────────
  checkPageBreak(30);
  yPos += 10;
  doc.setDrawColor(...[180, 180, 200]);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text('Academic Summary', 20, yPos);
  yPos += 10;

  const result = isCGPA ? cgpaResult : gpaResult;
  const gpaValue = isCGPA ? result.cgpa : result.gpa;
  const creditsValue = result.credits ?? result.total ?? 0;
  const pointsValue = isCGPA ? '—' : (result.points ?? '0');

  checkPageBreak(40);
  doc.setFillColor(...bgLight);
  doc.roundedRect(20, yPos - 4, 55, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text(isCGPA ? 'CGPA' : 'GPA', 35, yPos + 2);
  doc.setFontSize(18);
  doc.setTextColor(...primary);
  doc.text(String(gpaValue || '—'), 35, yPos + 14);
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.text(`out of ${scale}`, 35, yPos + 22);

  doc.setFillColor(...bgLight);
  doc.roundedRect(80, yPos - 4, 55, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('Total Credits', 95, yPos + 2);
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text(String(creditsValue), 95, yPos + 14);

  doc.setFillColor(...bgLight);
  doc.roundedRect(140, yPos - 4, 50, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('Quality Pts', 155, yPos + 2);
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text(pointsValue, 155, yPos + 14);
  yPos += 35;

  // Standing badge
  const gpaNumeric = parseFloat(gpaValue || '0');
  const standing = getStanding(gpaNumeric, scale);
  const [sr, sg, sb] = hexToRgb(standing.color);
  doc.setFillColor(sr, sg, sb);
  doc.roundedRect(20, yPos - 4, 170, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.text(`Academic Standing: ${standing.t}`, 105, yPos + 3, { align: 'center' });
  yPos += 20;

  // ── Footer ──────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(...primary);
    doc.text('Built by Usman Murtaza • Maniesta Calculator', 105, 291, { align: 'center' });
    doc.text('maniestacalculator.com', 105, 296, { align: 'center' });
  }

  const sanitizedName = (studentName || 'Student').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  doc.save(`Maniesta_${isCGPA ? 'CGPA' : 'Academic'}_Record_${sanitizedName}.pdf`);
}

// ── Public API ─────────────────────────────────────────────────
export async function generatePDF(data) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    await buildPDF(doc, data);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Could not generate PDF. Please try again.');
  }
}