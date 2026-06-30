import { clsx } from "@/lib/clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
  secondary:
    "bg-white text-slate-900 ring-1 ring-inset ring-stone-200 hover:bg-stone-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700",
  ghost: "bg-transparent text-slate-700 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "min-h-[44px] px-4 text-[15px]",
  lg: "min-h-[48px] px-5 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
