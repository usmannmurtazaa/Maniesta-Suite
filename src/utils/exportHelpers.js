import { getStanding, getGradeScale } from './grades';
// Removed deprecated import: import { gradePoints } from './calculations';

// ── Helpers ────────────────────────────────────────────────
function s(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

export function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function sanitizeFilename(name) {
  return (name || 'Record')
    .replace(/[^a-zA-Z0-9\s_\-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

// ── PDF Builder ───────────────────────────────────────────
async function buildPDF(doc, normalized) {
  const {
    studentName = 'Student',
    studentId = '',
    university = '',
    degree = '',
    semester = '',
    date = new Date().toLocaleDateString(),
    scale = '4.0',
    isCGPA,
    courses = [],
    semesters = [],
    gpaResult = {},
    cgpaResult = {},
  } = normalized;

  const primary = [99, 102, 241];
  const primaryLight = [165, 148, 249];
  const darkText = [40, 40, 40];
  const mutedText = [100, 100, 100];
  const bgLight = [245, 243, 255];
  const white = [255, 255, 255];

  let yPos = 30;

  const checkPageBreak = (neededSpace = 10) => {
    if (yPos + neededSpace > 275) {
      doc.addPage();
      addPageHeader(doc, (yPos = 30));
    }
  };

  const addPageHeader = (docInstance, startY) => {
    docInstance.setFillColor(...primary);
    docInstance.rect(0, 0, 210, 35, 'F');
    docInstance.setFont('helvetica', 'bold');
    docInstance.setTextColor(...white);
    docInstance.setFontSize(20);
    docInstance.text('Maniesta Suite', 105, 20, { align: 'center' });
    docInstance.setFontSize(9);
    docInstance.setTextColor(...primaryLight);
    docInstance.text('Academic Excellence Suite', 105, 28, { align: 'center' });
  };

  addPageHeader(doc, yPos);

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

  // Student Info
  checkPageBreak(50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primary);
  doc.text('Student Information', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`Name: ${s(studentName)}`, 25, yPos); yPos += 7;
  if (studentId) { doc.text(`Student ID: ${s(studentId)}`, 25, yPos); yPos += 7; }
  if (degree) { doc.text(`Program: ${s(degree)}`, 25, yPos); yPos += 7; }
  if (university) { doc.text(`Institution: ${s(university)}`, 25, yPos); yPos += 7; }
  if (semester) { doc.text(`Semester: ${s(semester)}`, 25, yPos); yPos += 7; }
  doc.text(`Generated: ${s(date)}`, 25, yPos);
  yPos += 12;

  // Table header
  checkPageBreak(20);
  doc.setDrawColor(...[180, 180, 200]);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primary);
  doc.text(isCGPA ? 'Semester Summary' : 'Course Details', 20, yPos);
  yPos += 8;

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
      addPageHeader(doc, (yPos = 30));
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

    if (index % 2 === 0) {
      doc.setFillColor(...bgLight);
      doc.rect(20, yPos - 4, 170, 7, 'F');
    }
    doc.setFontSize(10);
    if (isCGPA) {
      doc.text(s(row.name), 25, yPos);
      doc.text(s(row.gpa ?? row.cgpa ?? '—'), 80, yPos);
      doc.text(s(row.credits ?? '—'), 115, yPos);
      doc.text(s(row.status ?? '—'), 155, yPos);
    } else {
      doc.text(s(row.code ?? row.name ?? '—'), 25, yPos);
      doc.text(s(row.credits ?? 0), 80, yPos);
      doc.text(s(row.grade ?? '—'), 115, yPos);
      doc.text(s(row.points ?? '0'), 155, yPos);
    }
    yPos += 7;
  });

  // Summary
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
  const pointsValue = isCGPA ? '—' : s(result.points ?? '0');

  checkPageBreak(40);
  doc.setFillColor(...bgLight);
  doc.roundedRect(20, yPos - 4, 55, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text(isCGPA ? 'CGPA' : 'GPA', 35, yPos + 2);
  doc.setFontSize(18);
  doc.setTextColor(...primary);
  doc.text(s(gpaValue ?? '—'), 35, yPos + 14);
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.text(`out of ${s(scale)}`, 35, yPos + 22);

  doc.setFillColor(...bgLight);
  doc.roundedRect(80, yPos - 4, 55, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('Total Credits', 95, yPos + 2);
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text(s(creditsValue), 95, yPos + 14);

  doc.setFillColor(...bgLight);
  doc.roundedRect(140, yPos - 4, 50, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('Quality Pts', 155, yPos + 2);
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text(s(pointsValue), 155, yPos + 14);
  yPos += 35;

  // Standing
  const gpaNumeric = parseFloat(gpaValue ?? '0');
  const standing = getStanding(gpaNumeric, scale);
  const [sr, sg, sb] = hexToRgb(standing.color);
  doc.setFillColor(sr, sg, sb);
  doc.roundedRect(20, yPos - 4, 170, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.text(`Academic Standing: ${standing.t}`, 105, yPos + 3, { align: 'center' });
  yPos += 20;

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(...primary);
    doc.text('Built by Usman Murtaza • Maniesta Suite', 105, 291, { align: 'center' });
    doc.text('maniestasuite.netlify.app', 105, 296, { align: 'center' });
  }
}

// ── Normalize data shapes (now scale‑aware for legacy path) ──
function normalizeExportData(data) {
  // Old ExportModal style (userData, resultData, calculatorType)
  if (data.userData) {
    const { userData, resultData, calculatorType, scale = '4.0' } = data;
    const isCGPA = calculatorType === 'CGPA';

    // Build a points map from the selected scale (fixes hardcoded 4.0)
    const gradeScale = getGradeScale(scale);
    const pointsMap = Object.fromEntries(gradeScale.map(g => [g.g, g.p]));

    const courses = !isCGPA
      ? (resultData.courses || []).map(c => {
        const pts = (pointsMap[c.grade] || 0) * (parseFloat(c.creditHours) || 0);
        return {
          code: c.name,
          credits: parseFloat(c.creditHours) || 0,
          grade: c.grade,
          points: pts,
        };
      })
      : [];
    const semesters = isCGPA
      ? (resultData.semesters || []).map(sem => ({
        gpa: sem.courses
          ? (
            sem.courses.reduce((acc, c) => acc + (pointsMap[c.grade] || 0) * parseFloat(c.creditHours), 0) /
            (sem.courses.reduce((acc, c) => acc + parseFloat(c.creditHours), 0) || 1)
          ).toFixed(2)
          : '0',
        credits: sem.courses ? sem.courses.reduce((acc, c) => acc + parseFloat(c.creditHours), 0) : 0,
        status: '',
      }))
      : [];

    return {
      studentName: userData.fullName,
      studentId: userData.studentId,
      university: userData.university,
      degree: userData.degree || '',
      semester: userData.semester,
      date: new Date().toLocaleDateString(),
      scale, // use actual scale, not hardcoded 4.0
      isCGPA,
      courses,
      semesters,
      gpaResult: isCGPA
        ? {}
        : {
          gpa: resultData.gpa,
          credits: courses.reduce((acc, c) => acc + c.credits, 0),
          points: courses.reduce((acc, c) => acc + (c.points || 0), 0).toFixed(2),
        },
      cgpaResult: isCGPA
        ? {
          cgpa: resultData.cgpa,
          total: semesters.reduce((acc, s) => acc + parseFloat(s.gpa), 0),
          best: Math.max(...semesters.map(s => parseFloat(s.gpa))),
        }
        : {},
    };
  }

  // New direct call (used by our fixed components)
  return {
    studentName: data.studentName || 'Student',
    studentId: data.studentId || '',
    university: data.university || '',
    degree: data.degree || '',
    semester: data.semester || '',
    date: data.date || new Date().toLocaleDateString(),
    scale: data.scale || '4.0',
    isCGPA: data.type === 'CGPA',
    courses: data.courses || [],
    semesters: data.semesters || [],
    gpaResult: data.gpaResult || {},
    cgpaResult: data.cgpaResult || {},
  };
}

// ── Blob‑returning functions for premium export modal ──────────
export async function generatePDFBlob(data) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const normalized = normalizeExportData(data);
  await buildPDF(doc, normalized);
  return doc.output('blob');
}

export function generateCSVBlob(data) {
  const csv = generateCSV(data, data.type || 'GPA');
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}

// ── Public API (original) ──────────────────────────────────
export async function generatePDF(data) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const normalized = normalizeExportData(data);
    await buildPDF(doc, normalized);
    const sanitized = (normalized.studentName || 'Student')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    const typeLabel = normalized.isCGPA ? 'CGPA' : 'Academic';
    doc.save(`Maniesta_${typeLabel}_Record_${sanitized}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Could not generate PDF. Please try again.');
  }
}

export function generateCSV(data, type) {
  const isCGPA = type === 'CGPA';
  const lines = [];

  lines.push('Maniesta Suite - ' + (isCGPA ? 'CGPA REPORT' : 'ACADEMIC RECORD'));
  lines.push('==========================================');
  lines.push('');

  const info = data.userData || data;
  const studentName = info.fullName || info.studentName || 'Student';
  const studentId = info.studentId || '';
  const university = info.university || '';
  const degree = info.degree || '';
  const semester = info.semester || '';
  const date = info.date || new Date().toLocaleDateString();

  lines.push('STUDENT INFORMATION');
  lines.push(`${escapeCSV('Student Name')},${escapeCSV(studentName)}`);
  if (studentId) lines.push(`${escapeCSV('Student ID')},${escapeCSV(studentId)}`);
  if (degree) lines.push(`${escapeCSV('Degree / Program')},${escapeCSV(degree)}`);
  if (university) lines.push(`${escapeCSV('University')},${escapeCSV(university)}`);
  if (semester) lines.push(`${escapeCSV('Semester')},${escapeCSV(semester)}`);
  lines.push(`${escapeCSV('Date')},${escapeCSV(date)}`);
  lines.push('');

  if (isCGPA) {
    const sems = data.semesters || [];
    lines.push('SEMESTER SUMMARY');
    lines.push(['Semester', 'GPA', 'Credits', 'Status'].map(escapeCSV).join(','));
    sems.forEach((sem, idx) => {
      lines.push([
        escapeCSV(`Semester ${idx + 1}`),
        escapeCSV(sem.gpa || ''),
        escapeCSV(sem.credits || ''),
        escapeCSV(sem.status || ''),
      ].join(','));
    });
    lines.push('');
    lines.push(`CGPA,${escapeCSV(data.cgpa ?? data.cgpaResult?.cgpa ?? '')}`);
  } else {
    const crs = data.courses || [];
    lines.push('COURSE DETAILS');
    lines.push(['Code', 'Credits', 'Grade', 'Points'].map(escapeCSV).join(','));
    crs.forEach(c => {
      lines.push([
        escapeCSV(c.code ?? c.name ?? '—'),
        escapeCSV(c.credits ?? c.creditHours ?? ''),
        escapeCSV(c.grade ?? '—'),
        escapeCSV(c.points != null ? parseFloat(c.points).toFixed(2) : '0.00'),
      ].join(','));
    });
    lines.push('');
    lines.push(`GPA,${escapeCSV(data.gpa ?? data.gpaResult?.gpa ?? '')}`);
  }

  lines.push('');
  lines.push('Generated by Maniesta Suite - Crafted by Usman Murtaza');
  lines.push('maniestasuite.netlify.app');
  return '\uFEFF' + lines.join('\n');
}

export function downloadCSV(data) {
  try {
    const csv = generateCSV(data, data.type || 'GPA');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Maniesta_Record_${sanitizeFilename(data.studentName || data.userData?.fullName)}.csv`;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.error('CSV export failed:', err);
    throw new Error('Could not generate CSV file.');
  }
}