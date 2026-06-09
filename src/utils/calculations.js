export const gradePoints = Object.freeze({
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
});

export function calculateGPA(courses = []) {
  if (!courses.length) return '0.00';
  let totalPoints = 0, totalCredits = 0;
  courses.forEach(c => {
    const gp = gradePoints[c.grade] || 0;
    const credits = parseFloat(c.creditHours) || 0;
    totalPoints += gp * credits;
    totalCredits += credits;
  });
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

export function calculateCGPA(semesters = []) {
  let totalPoints = 0, totalCredits = 0;
  semesters.forEach(sem => {
    sem.courses.forEach(c => {
      const gp = gradePoints[c.grade] || 0;
      const credits = parseFloat(c.creditHours) || 0;
      totalPoints += gp * credits;
      totalCredits += credits;
    });
  });
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

export function simpleInterest(principal, rate, time) {
  const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(time);
  if ([p, r, t].some(isNaN)) return NaN;
  return (p * r * t) / 100;
}

export function compoundInterest(principal, rate, time, n) {
  const p = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(time), periods = parseInt(n);
  if ([p, r, t, periods].some(isNaN)) return NaN;
  return p * Math.pow(1 + r / periods, periods * t) - p;
}

export function loanEMI(principal, annualRate, months) {
  const p = parseFloat(principal), rate = parseFloat(annualRate), n = parseInt(months);
  if ([p, rate, n].some(isNaN) || p <= 0 || rate < 0 || n <= 0) return '0.00';
  const monthlyRate = rate / 12 / 100;
  if (monthlyRate === 0) return (p / n).toFixed(2);
  const pow = Math.pow(1 + monthlyRate, n);
  const emi = (p * monthlyRate * pow) / (pow - 1);
  return emi.toFixed(2);
}