// src/hooks/useGPA.js
import { useState, useCallback } from 'react';
import { calculateGPA } from '../utils/calculations';
import { GRADES } from '../utils/grades';

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
    const gradeScale = GRADES;
    const mappedCourses = courses.map(c => ({
      name: c.code || 'Course',
      creditHours: c.credits,
      grade: gradeScale[c.gradeIdx]?.g || 'F',
    }));
    const gpaResult = calculateGPA(mappedCourses);
    if (gpaResult === '0.00' && mappedCourses.length > 0) {
      setError('Invalid course data.');
      return;
    }
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const totalPoints = gpaResult * totalCredits;
    setResult({
      gpa: parseFloat(gpaResult),
      count: courses.length,
      credits: totalCredits,
      points: parseFloat(totalPoints.toFixed(2)),
    });
  }, [courses]);

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