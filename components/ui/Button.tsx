

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "w-full py-2.5 rounded-lg text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-[#0F3D2E] text-white hover:bg-[#0c3125]"
      : "border border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <button {...props} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}