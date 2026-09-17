"use client";

import { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateHolidayMutation, useUpdateHolidayMutation } from "@/features/time-off/timeOffApi";
import { Holiday, CreateHolidayPayload } from "@/features/time-off/timeOff.types";

interface HolidayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  holidayToEdit: Holiday | null;
}

export function HolidayDrawer({ isOpen, onClose, holidayToEdit }: HolidayDrawerProps) {
  const [isRendered, setIsRendered] = useState(false);
  const isEditing = !!holidayToEdit;
  
  // Form State
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [createHoliday, { isLoading: isCreating }] = useCreateHolidayMutation();
  const [updateHoliday, { isLoading: isUpdating }] = useUpdateHolidayMutation();

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      
      // Populate form if editing
      if (holidayToEdit) {
        setName(holidayToEdit.name);
        setFromDate(holidayToEdit.from.split("T")[0]);
        setToDate(holidayToEdit.to.split("T")[0]);
      } else {
        setName("");
        setFromDate("");
        setToDate("");
      }
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen, holidayToEdit]);

  if (!isRendered && !isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !fromDate || !toDate) return;
    
    const payload: CreateHolidayPayload = {
      name,
      from: new Date(fromDate).toISOString(),
      to: new Date(toDate).toISOString(),
    };

    try {
      if (isEditing && holidayToEdit) {
        await updateHoliday({ id: holidayToEdit._id, payload }).unwrap();
      } else {
        await createHoliday(payload).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save holiday:", error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit Holiday" : "New Holiday"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Holiday Name <span className="text-red-500">*</span>
              </label>
              <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <input
                  type="text"
                  placeholder="e.g. Eid Mubarak"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  From <span className="text-red-500">*</span>
                </label>
                <div className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input 
                    type="date" 
                    className="w-full bg-transparent text-sm text-gray-700 outline-none" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  To <span className="text-red-500">*</span>
                </label>
                <div className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input 
                    type="date" 
                    className="w-full bg-transparent text-sm text-gray-700 outline-none" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={onClose} disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button variant="dark" className="w-full" onClick={handleSubmit} isLoading={isCreating || isUpdating}>
              {isEditing ? "Save Changes" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
