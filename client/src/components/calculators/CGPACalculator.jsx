import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { calculateCGPA, gradePoints } from "../../utils/calculations";
import ExportModal from "./ExportModal";
import { useTrackPageView } from "../../hooks/useAnalytics";

const GRADE_OPTIONS = Object.keys(gradePoints).map((g) => ({
  value: g,
  label: g,
}));
const MIN_SEM = 2,
  MAX_SEM = 12,
  MIN_COURSES = 3,
  MAX_COURSES = 8;
const emptyCourse = (id) => ({ id, name: "", creditHours: "", grade: "A" });

export default function CGPACalculator() {
  useTrackPageView("cgpa_calculator");
  const [semesters, setSemesters] = useState([
    {
      id: Date.now(),
      courses: [emptyCourse(1), emptyCourse(2), emptyCourse(3)],
    },
    {
      id: Date.now() + 1,
      courses: [emptyCourse(4), emptyCourse(5), emptyCourse(6)],
    },
  ]);
  const [cgpa, setCgpa] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [errors, setErrors] = useState({});
  const resultRef = useRef(null);

  const addSemester = () =>
    semesters.length < MAX_SEM &&
    setSemesters((prev) => [
      ...prev,
      {
        id: Date.now(),
        courses: [
          emptyCourse(Date.now() + 1),
          emptyCourse(Date.now() + 2),
          emptyCourse(Date.now() + 3),
        ],
      },
    ]);
  const removeSemester = (id) =>
    semesters.length > MIN_SEM &&
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  const addCourse = (semId) =>
    setSemesters((prev) =>
      prev.map((sem) =>
        sem.id === semId && sem.courses.length < MAX_COURSES
          ? { ...sem, courses: [...sem.courses, emptyCourse(Date.now())] }
          : sem,
      ),
    );
  const removeCourse = (semId, courseId) =>
    setSemesters((prev) =>
      prev.map((sem) =>
        sem.id === semId && sem.courses.length > MIN_COURSES
          ? { ...sem, courses: sem.courses.filter((c) => c.id !== courseId) }
          : sem,
      ),
    );
  const updateCourse = (semId, courseId, field, value) => {
    setSemesters((prev) =>
      prev.map((sem) =>
        sem.id === semId
          ? {
              ...sem,
              courses: sem.courses.map((c) =>
                c.id === courseId ? { ...c, [field]: value } : c,
              ),
            }
          : sem,
      ),
    );
    setErrors((prev) => {
      const key = `${semId}-${courseId}-${field}`;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const errs = {};
    semesters.forEach((sem) =>
      sem.courses.forEach((c) => {
        if (!c.name.trim()) errs[`${sem.id}-${c.id}-name`] = "Required";
        const cr = parseFloat(c.creditHours);
        if (!c.creditHours || isNaN(cr) || cr <= 0)
          errs[`${sem.id}-${c.id}-creditHours`] = "Invalid";
      }),
    );
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const result = calculateCGPA(semesters);
    setCgpa(result);
    if (parseFloat(result) >= 3.7) {
      resultRef.current?.focus();
    }
  };

  const bestSemester = useMemo(
    () =>
      semesters
        .map((sem, idx) => ({ idx, gpa: parseFloat(calculateCGPA([sem])) }))
        .sort((a, b) => b.gpa - a.gpa)[0],
    [semesters],
  );
  const isExcellent = cgpa && parseFloat(cgpa) >= 3.7;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4"
    >
      <h2 className="text-3xl font-bold text-gradient mb-8">CGPA Calculator</h2>
      <div className="space-y-8">
        <AnimatePresence>
          {semesters.map((sem, i) => (
            <motion.div key={sem.id} layout className="glass-card p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Semester {i + 1}</h3>
                <Button
                  variant="secondary"
                  onClick={() => removeSemester(sem.id)}
                  disabled={semesters.length <= MIN_SEM}
                >
                  Remove
                </Button>
              </div>
              <div className="space-y-4">
                {sem.courses.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-white/30 dark:bg-gray-800/30 p-4 rounded-xl"
                  >
                    <Input
                      label="Course"
                      value={c.name}
                      onChange={(e) =>
                        updateCourse(sem.id, c.id, "name", e.target.value)
                      }
                      error={errors[`${sem.id}-${c.id}-name`]}
                    />
                    <Input
                      label="Credits"
                      type="number"
                      value={c.creditHours}
                      onChange={(e) =>
                        updateCourse(
                          sem.id,
                          c.id,
                          "creditHours",
                          e.target.value,
                        )
                      }
                      error={errors[`${sem.id}-${c.id}-creditHours`]}
                    />
                    <Select
                      label="Grade"
                      options={GRADE_OPTIONS}
                      value={c.grade}
                      onChange={(e) =>
                        updateCourse(sem.id, c.id, "grade", e.target.value)
                      }
                    />
                    <Button
                      variant="secondary"
                      onClick={() => removeCourse(sem.id, c.id)}
                      disabled={sem.courses.length <= MIN_COURSES}
                    >
                      −
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addCourse(sem.id)}
                  disabled={sem.courses.length >= MAX_COURSES}
                >
                  + Add Course
                </Button>
              </div>
              {bestSemester?.idx === i && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                  Best
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex gap-4">
          <Button onClick={addSemester} disabled={semesters.length >= MAX_SEM}>
            Add Semester
          </Button>
          <Button onClick={handleCalculate}>Calculate CGPA</Button>
        </div>
        {cgpa && (
          <motion.div
            ref={resultRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`glass-card p-6 text-center relative overflow-hidden ${isExcellent ? "border-2 border-yellow-400" : ""}`}
          >
            {isExcellent && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className="relative z-10">
              <motion.div
                className="text-4xl font-bold text-gradient mb-2"
                animate={isExcellent ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {cgpa}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isExcellent
                  ? "🏆 Outstanding!"
                  : parseFloat(cgpa) >= 3.0
                    ? "Good job!"
                    : "Keep going!"}
              </p>
              {bestSemester && (
                <p className="text-sm text-gray-500">
                  Best: Semester {bestSemester.idx + 1} (GPA{" "}
                  {bestSemester.gpa.toFixed(2)})
                </p>
              )}
              <Button className="mt-4" onClick={() => setShowExport(true)}>
                Export Report
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        calculatorType="CGPA"
        resultData={{ semesters, cgpa }}
      />
    </motion.div>
  );
}
