import { useState, useCallback } from 'react';
import { calculateGPA } from '../utils/calculations';
import { getGradeScale } from '../utils/grades';

export function useGPA(scale) {
  const [courses, setCourses] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const addCourse = useCallback(() => {
    setCourses(prev => {
      if (prev.length >= 8) return prev;
      return [
        ...prev,
        { id: crypto.randomUUID(), code: '', credits: 3, gradeIdx: 0 },
      ];
    });
  }, []);

  const removeCourse = useCallback((id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setResult(null);
    setError('');
  }, []);

  const updateCourse = useCallback((id, field, value) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
    setResult(null);
    setError('');
  }, []);

  const calculate = useCallback(() => {
    setError('');
    if (courses.length === 0) {
      setError('Add at least one course to calculate GPA.');
      return;
    }

    // Use the selected scale instead of the default 4.0
    const gradeScale = getGradeScale(scale);
    const mappedCourses = courses.map(c => ({
      name: c.code || 'Course',
      creditHours: c.credits,
      grade: gradeScale[c.gradeIdx]?.g || 'F',
    }));

    const gpaResult = calculateGPA(mappedCourses);

    // Removed the false error for a valid 0.00 GPA.
    // A student with all F's should still see a 0.00 result.

    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const totalGradePoints = parseFloat(gpaResult) * totalCredits;

    setResult({
      gpa: parseFloat(gpaResult),
      count: courses.length,
      credits: totalCredits,
      points: parseFloat(totalGradePoints.toFixed(2)),
    });
  }, [courses, scale]);

  return {
    courses,
    addCourse,
    removeCourse,
    updateCourse,
    calculate,
    result,
    error,
  };
}