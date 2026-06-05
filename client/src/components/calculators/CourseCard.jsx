import { motion } from 'framer-motion';
import Input from '../common/Input';
import Select from '../common/Select';
import { gradePoints } from '../../utils/grades';

export default function CourseCard({ id, index, removable, onRemove, data, onChange, scale }) {
  const grades = gradePoints(scale);
  const gradeOptions = grades.map((g, i) => ({ value: i, label: g.g }));

  return (
    <motion.div
      layout
      className="glass p-5 rounded-2xl mb-4 grid grid-cols-1 sm:grid-cols-5 gap-4 items-end relative"
    >
      <span className="hidden sm:flex items-center justify-center text-xs font-mono text-gray-400 dark:text-gray-500">
        {index + 1}
      </span>
      <div className="sm:col-span-2">
        <Input
          label="Course Code"
          value={data.code}
          onChange={e => onChange(id, 'code', e.target.value)}
          placeholder="CS101"
        />
      </div>
      <Input
        label="Credits"
        type="number"
        min="0"
        step="0.5"
        value={data.credits}
        onChange={e => onChange(id, 'credits', e.target.value)}
      />
      <Select
        label="Grade"
        options={gradeOptions}
        value={data.gradeIdx}
        onChange={e => onChange(id, 'gradeIdx', parseInt(e.target.value))}
      />
      {removable && (
        <button
          onClick={() => onRemove(id)}
          className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
          aria-label="Remove course"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}