import { useId } from 'react';

export default function Input({ label, error, className = '', ...props }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`input-base ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}