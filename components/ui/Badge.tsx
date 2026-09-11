import { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "error" | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ children, variant = "default", dot = false }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-yellow-50 text-yellow-600",
    error: "bg-red-50 text-red-600",
    default: "bg-gray-100 text-gray-600",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    default: "bg-gray-500",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
