import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-taupe text-white hover:bg-taupe/90 shadow-sm",
  secondary:
    "bg-brand-gold text-taupe hover:bg-brand-gold/90 shadow-sm",
  outline:
    "border border-border bg-white text-taupe hover:border-taupe/30 hover:bg-surface",
  ghost: "bg-transparent text-taupe hover:bg-surface",
};

const sizes = {
  sm: "min-h-11 px-3.5 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-11 px-6 py-3 text-sm font-semibold",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function ButtonNative({
  className,
  variant = "primary",
  size = "md",
  ...props
}: NativeButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
