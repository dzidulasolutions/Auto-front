import { forwardRef } from "react";
import { IconlyLoader } from "./icons";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/85 disabled:bg-black/40",
  secondary: "bg-surface text-foreground hover:bg-border disabled:text-muted",
  ghost: "text-foreground hover:bg-surface disabled:text-muted",
  danger: "bg-error text-white hover:bg-error/90 disabled:bg-error/40",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-5 text-body",
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`font-ui font-medium rounded-control inline-flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <IconlyLoader size={16} color="currentColor" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export default Button;