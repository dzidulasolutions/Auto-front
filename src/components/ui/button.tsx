"use client";

import { forwardRef, useEffect, useState } from "react";
import { IconlyLoader } from "./icons";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingHint?: string;
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
  (
    { variant = "primary", size = "md", loading, loadingHint, disabled, className = "", children, ...props },
    ref,
  ) => {
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
      if (!loading) {
        setShowHint(false);
        return;
      }
      const t = setTimeout(() => setShowHint(true), 6000);
      return () => clearTimeout(t);
    }, [loading]);

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`font-ui font-medium rounded-control inline-flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        <span className="inline-flex items-center gap-2">
          {loading && <IconlyLoader size={16} color="currentColor" />}
          {loading && showHint && loadingHint ? loadingHint : children}
        </span>
      </button>
    );
  },
);
Button.displayName = "Button";

export default Button;