"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from "date-fns";
import { Button } from "./Button";

interface DateRangeInputProps {
  startDate?: string;
  endDate?: string;
  onChange?: (start: Date | null, end: Date | null) => void;
  className?: string;
}

export function DateRangeInput({
  startDate = "01 Jan 2023",
  endDate = "10 Mar 2023",
  onChange,
  className = "",
}: DateRangeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 0, 1)); // Mock default to Jan 2023 based on design
  const [selectedStart, setSelectedStart] = useState<Date | null>(new Date(2023, 0, 12));
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(new Date(2023, 0, 15));
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-semibold text-sm text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">
          {format(addDays(startDate, i), "Eee").substring(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isSelectedStart = selectedStart && isSameDay(day, selectedStart);
        const isSelectedEnd = selectedEnd && isSameDay(day, selectedEnd);
        const isBetween = selectedStart && selectedEnd && day > selectedStart && day < selectedEnd;
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        let cellClass = "flex h-8 w-8 items-center justify-center rounded-full text-sm cursor-pointer mx-auto transition-colors ";
        
        if (!isCurrentMonth) {
          cellClass += "text-gray-300 pointer-events-none ";
        } else if (isSelectedStart || isSelectedEnd) {
          cellClass += "bg-emerald-500 text-white font-semibold shadow-sm ";
        } else if (isBetween) {
          cellClass += "bg-emerald-50 text-emerald-700 font-medium ";
        } else {
          cellClass += "text-gray-700 hover:bg-gray-100 ";
        }

        days.push(
          <div
            className="py-1"
            key={day.toString()}
            onClick={() => {
              if (!selectedStart || (selectedStart && selectedEnd)) {
                setSelectedStart(cloneDay);
                setSelectedEnd(null);
              } else if (cloneDay < selectedStart) {
                setSelectedEnd(selectedStart);
                setSelectedStart(cloneDay);
              } else {
                setSelectedEnd(cloneDay);
              }
            }}
          >
            <div className={cellClass}>{formattedDate}</div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const displayValue = selectedStart && selectedEnd 
    ? `${format(selectedStart, "dd MMM yyyy")} - ${format(selectedEnd, "dd MMM yyyy")}`
    : `${startDate} - ${endDate}`;

  return (
    <div className="relative" ref={popoverRef}>
      <div
        className={`flex h-10 cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500 transition-all ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{displayValue}</span>
        <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 w-[320px] rounded-2xl bg-white p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 mb-1">Set Date</h3>
          </div>
          
          <div className="mb-4">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-10 border-gray-200"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="dark" 
              className="flex-1 rounded-xl h-10"
              onClick={() => {
                if (onChange) onChange(selectedStart, selectedEnd);
                setIsOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
