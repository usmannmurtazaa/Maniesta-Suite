import { useId } from 'react';

export default function Input({ label, error, className = '', ...props }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium transition-colors ${
            error
              ? 'text-red-500'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`input-base w-full ${
          error ? 'input-error' : ''
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="text-red-500 text-xs mt-0.5" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}