"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HolidayDrawer } from "./HolidayDrawer";
import { useGetHolidaysQuery, useDeleteHolidayMutation } from "@/features/time-off/timeOffApi";
import { Holiday } from "@/features/time-off/timeOff.types";
import { Spinner } from "@/components/ui/Spinner";

export function HolidayTab() {
  const { data, isLoading } = useGetHolidaysQuery();
  const [deleteHoliday, { isLoading: isDeleting }] = useDeleteHolidayMutation();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [holidayToEdit, setHolidayToEdit] = useState<Holiday | null>(null);

  const holidays = data?.data || [];

  const handleEdit = (holiday: Holiday) => {
    setHolidayToEdit(holiday);
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setHolidayToEdit(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this holiday?")) {
      try {
        await deleteHoliday(id).unwrap();
      } catch (error) {
        console.error("Failed to delete holiday:", error);
      }
    }
  };

  const renderDate = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isSameDay(fromDate, toDate)) {
      return format(fromDate, "dd MMM yyyy");
    }
    
    return `${format(fromDate, "dd MMM yyyy")} - ${format(toDate, "dd MMM yyyy")}`;
  };

  return (
    <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Holidays</h3>
        <Button variant="dark" onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Holiday
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Spinner className="h-6 w-6 text-emerald-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-xs text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Holiday Name</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {holidays.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    No holidays added yet.
                  </td>
                </tr>
              ) : (
                holidays.map((holiday) => (
                  <tr key={holiday._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{holiday.name}</td>
                    <td className="px-4 py-3 text-gray-600">{renderDate(holiday.from, holiday.to)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(holiday)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(holiday._id)}
                          disabled={isDeleting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <HolidayDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        holidayToEdit={holidayToEdit} 
      />
    </div>
  );
}
