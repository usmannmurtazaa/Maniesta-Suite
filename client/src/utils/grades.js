export const GRADES = {
  standard: [
    { g: 'A+', p: 4.0 }, { g: 'A', p: 4.0 }, { g: 'A-', p: 3.7 },
    { g: 'B+', p: 3.3 }, { g: 'B', p: 3.0 }, { g: 'B-', p: 2.7 },
    { g: 'C+', p: 2.3 }, { g: 'C', p: 2.0 }, { g: 'C-', p: 1.7 },
    { g: 'D+', p: 1.3 }, { g: 'D', p: 1.0 }, { g: 'F', p: 0.0 },
  ],
  mit: [
    { g: 'A', p: 5.0 }, { g: 'B', p: 4.0 }, { g: 'C', p: 3.0 },
    { g: 'D', p: 2.0 }, { g: 'F', p: 0.0 },
  ],
  // add more scales as needed
};

export const SCALES = { ...GRADES };

export function gradePoints(scale = 'standard') {
  return GRADES[scale] || GRADES.standard;
}