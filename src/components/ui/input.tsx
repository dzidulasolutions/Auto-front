import { forwardRef, useId } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-small font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`h-11 px-4 bg-surface text-body placeholder:text-muted outline-none transition-shadow rounded-control focus-visible:ring-2 ${
            error ? "ring-2 ring-error" : "focus-visible:ring-black"
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-small text-error">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-small text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;