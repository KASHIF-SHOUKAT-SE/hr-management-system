"use client";

import { Calendar } from "lucide-react";

interface DateRangeInputProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * A read-only styled date range display input with a calendar icon.
 * For now it shows a text value; can be wired to a date picker later.
 */
export function DateRangeInput({
  value,
  onChange,
  className = "",
}: DateRangeInputProps) {
  return (
    <div
      className={`flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm ${className}`}
    >
      <span className="flex-1 whitespace-nowrap">{value}</span>
      <Calendar className="h-4 w-4 text-gray-400" />
    </div>
  );
}
