import { useState, useCallback } from 'react';
import { calculateWeightedGPA } from '../utils/calculations';
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

    // Get the grade scale for the selected scale
    const gradeScale = getGradeScale(scale);

    // Build weighted course list with explicit points from the scale
    const weightedCourses = courses.map(c => ({
      creditHours: c.credits,
      points: gradeScale[c.gradeIdx]?.p || 0,
    }));

    // Compute weighted GPA as a number
    const gpaNumber = calculateWeightedGPA(weightedCourses);
    const gpaRounded = parseFloat(gpaNumber.toFixed(2));

    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const totalGradePoints = gpaNumber * totalCredits;

    setResult({
      gpa: gpaRounded,
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