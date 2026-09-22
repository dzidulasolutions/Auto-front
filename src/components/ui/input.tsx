import { forwardRef, useId } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ error, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1.5">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full h-11 px-4 bg-surface border border-primary/5 text-sm placeholder:text-muted outline-none transition-shadow rounded-control focus-visible:ring-2 ${
            error ? "ring-2 ring-error" : "focus-visible:ring-black"
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-small text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;