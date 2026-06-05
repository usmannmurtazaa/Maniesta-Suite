import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { calculateGPA, gradePoints } from "../../utils/calculations";
import ExportModal from "./ExportModal";
import { useTrackPageView } from "../../hooks/useAnalytics";

const GRADE_OPTIONS = Object.keys(gradePoints).map((g) => ({
  value: g,
  label: g,
}));
const MIN = 3,
  MAX = 8;

export default function GPACalculator() {
  useTrackPageView("gpa_calculator");
  const [courses, setCourses] = useState(
    [...Array(MIN)].map((_, i) => ({
      id: i,
      name: "",
      creditHours: "",
      grade: "A",
    })),
  );
  const [gpa, setGpa] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [errors, setErrors] = useState({});
  const resultRef = useRef(null);

  const updateCourse = (id, field, value) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
    setErrors((prev) => {
      const { [`${id}-${field}`]: _, ...rest } = prev;
      return rest;
    });
  };

  const addCourse = () =>
    courses.length < MAX &&
    setCourses((prev) => [
      ...prev,
      { id: Date.now(), name: "", creditHours: "", grade: "A" },
    ]);
  const removeCourse = (id) =>
    courses.length > MIN &&
    setCourses((prev) => prev.filter((c) => c.id !== id));

  const validate = () => {
    const errs = {};
    courses.forEach((c) => {
      if (!c.name.trim()) errs[`${c.id}-name`] = "Required";
      const cr = parseFloat(c.creditHours);
      if (!c.creditHours || isNaN(cr) || cr <= 0)
        errs[`${c.id}-creditHours`] = "Invalid";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const result = calculateGPA(courses);
    setGpa(result);
    if (parseFloat(result) >= 3.7) {
      resultRef.current?.focus();
    }
  };

  const isExcellent = gpa && parseFloat(gpa) >= 3.7;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="glass-card p-6 md:p-10 space-y-6">
        <h2 className="text-3xl font-bold text-gradient">GPA Calculator</h2>
        <AnimatePresence>
          {courses.map((c) => (
            <motion.div
              key={c.id}
              layout
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-white/30 dark:bg-gray-800/30 p-4 rounded-xl"
            >
              <Input
                label="Course"
                value={c.name}
                onChange={(e) => updateCourse(c.id, "name", e.target.value)}
                error={errors[`${c.id}-name`]}
              />
              <Input
                label="Credits"
                type="number"
                value={c.creditHours}
                onChange={(e) =>
                  updateCourse(c.id, "creditHours", e.target.value)
                }
                error={errors[`${c.id}-creditHours`]}
              />
              <Select
                label="Grade"
                options={GRADE_OPTIONS}
                value={c.grade}
                onChange={(e) => updateCourse(c.id, "grade", e.target.value)}
              />
              <Button
                variant="secondary"
                onClick={() => removeCourse(c.id)}
                disabled={courses.length <= MIN}
              >
                −
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex gap-4">
          <Button onClick={addCourse} disabled={courses.length >= MAX}>
            Add Course
          </Button>
          <Button onClick={handleCalculate}>Calculate GPA</Button>
        </div>
        {gpa && (
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
                {gpa}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isExcellent
                  ? "🏆 Outstanding!"
                  : parseFloat(gpa) >= 3.0
                    ? "Good job!"
                    : "Keep going!"}
              </p>
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
        calculatorType="GPA"
        resultData={{ courses, gpa }}
      />
    </motion.div>
  );
}
