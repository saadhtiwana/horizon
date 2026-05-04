import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-glow active:bg-primary-dim disabled:bg-primary-dim disabled:opacity-60 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-glow)]",
  secondary:
    "bg-surface-2 text-foreground border border-border-strong hover:bg-surface-3 disabled:opacity-50",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-50",
  danger:
    "bg-transparent text-danger border border-border-strong hover:bg-danger/10 disabled:opacity-50",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px]",
  md: "h-9 px-4 text-[13px]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`press inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-[-0.005em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
});
