import { forwardRef, useId } from "react";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  placeholder: string;
}

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ error, placeholder, id, className = "", children, ...props }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1.5">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          defaultValue=""
          className={`w-full h-11 px-4 bg-surface text-body outline-none transition-shadow rounded-control focus-visible:ring-2 ${
            error ? "ring-2 ring-error" : "focus-visible:ring-black"
          } ${!props.value && "text-muted"} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {children}
        </select>
        {error && <p className="text-small text-error">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

export default Select;