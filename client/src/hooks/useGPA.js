import { useState, useCallback, useRef } from 'react';
import { gradePoints } from '../utils/grades';

let idCounter = 0;
const createCourse = () => ({
  id: ++idCounter,
  code: '',
  credits: '',
  gradeIdx: 0,
});

export function useGPA(scale) {
  const [courses, setCourses] = useState([...Array(3)].map(createCourse));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const grades = gradePoints(scale);

  const addCourse = useCallback(() => {
    if (courses.length >= 8) return;
    setCourses(prev => [...prev, createCourse()]);
  }, [courses.length]);

  const removeCourse = useCallback(id => {
    if (courses.length <= 3) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  }, [courses.length]);

  const updateCourse = useCallback((id, field, value) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const calculate = useCallback(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    const scaleGrades = gradePoints(scale);
    for (const c of courses) {
      const credits = parseFloat(c.credits);
      if (isNaN(credits) || credits <= 0) {
        setError(`Invalid credits for "${c.code || 'course'}"`);
        return;
      }
      const grade = scaleGrades[c.gradeIdx];
      if (!grade) {
        setError(`Invalid grade for "${c.code || 'course'}"`);
        return;
      }
      totalPoints += grade.points * credits;
      totalCredits += credits;
    }
    if (totalCredits === 0) {
      setError('Total credits must be greater than zero.');
      setResult(null);
      return;
    }
    setError('');
    setResult({
      gpa: (totalPoints / totalCredits).toFixed(2),
      count: courses.length,
      credits: totalCredits,
      points: totalPoints,
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