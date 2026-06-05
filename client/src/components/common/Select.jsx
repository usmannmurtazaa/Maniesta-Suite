import { useId } from 'react';

export default function Select({ label, options, error, className = '', ...props }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`select-base ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}