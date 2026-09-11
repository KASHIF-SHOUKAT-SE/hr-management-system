import type { ReactNode, ButtonHTMLAttributes } from "react";

type ActionColor = "green" | "blue" | "red" | "gray";

interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ActionColor;
  children: ReactNode;
}

const colorMap: Record<ActionColor, string> = {
  green: "bg-emerald-500 text-white hover:bg-emerald-600",
  blue: "bg-blue-500 text-white hover:bg-blue-600",
  red: "bg-red-500 text-white hover:bg-red-600",
  gray: "bg-gray-200 text-gray-600 hover:bg-gray-300",
};

/**
 * Small circular icon button used in table action columns.
 * Colors: green (approve), blue (edit), red (delete).
 */
export function ActionIconButton({
  color = "gray",
  children,
  className = "",
  ...props
}: ActionIconButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${colorMap[color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
