import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendBadgeProps {
  value: number; // positive = green up, negative = red down
  className?: string;
}

export function TrendBadge({ value, className = "" }: TrendBadgeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isPositive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      } ${className}`}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isPositive ? "+" : ""}
      {value}%
    </span>
  );
}
