"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectMenuProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectMenu({
  value,
  options,
  onChange,
  placeholder = "Select...",
  className = "",
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-56 origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none" style={{ animation: "fadeInDown 0.15s ease-out" }}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  isSelected ? "bg-emerald-50 font-medium text-emerald-900" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-4 w-4 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
