"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateLeaveTypeMutation } from "@/features/time-off/timeOffApi";
import { CreateLeaveTypePayload } from "@/features/time-off/timeOff.types";

interface AddTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTypeDrawer({ isOpen, onClose }: AddTypeDrawerProps) {
  const [isRendered, setIsRendered] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [unit, setUnit] = useState<"Days" | "Hours">("Days");

  const [createLeaveType, { isLoading }] = useCreateLeaveTypeMutation();

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      setName("");
      setIsPaid(true);
      setUnit("Days");
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered && !isOpen) return null;

  const handleSubmit = async () => {
    if (!name) return;
    
    const payload: CreateLeaveTypePayload = {
      name,
      isPaid,
      unit,
      isActive: true, // defaults to active when created
    };

    try {
      await createLeaveType(payload).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create leave type:", error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">Add Type</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type Name <span className="text-red-500">*</span>
              </label>
              <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <input
                  type="text"
                  placeholder="e.g. Engagement"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Paid/Unpaid <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                    isPaid 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500" 
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className={`mr-2 h-4 w-4 rounded-full border-2 ${isPaid ? "border-emerald-500 flex items-center justify-center" : "border-gray-300"}`}>
                    {isPaid && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </div>
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                    !isPaid 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500" 
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className={`mr-2 h-4 w-4 rounded-full border-2 ${!isPaid ? "border-emerald-500 flex items-center justify-center" : "border-gray-300"}`}>
                    {!isPaid && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </div>
                  Unpaid
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Unit <span className="text-red-500">*</span>
              </label>
              <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <select
                  className="w-full bg-transparent text-sm text-gray-900 outline-none"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "Days" | "Hours")}
                >
                  <option value="Days">Days</option>
                  <option value="Hours">Hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="dark" className="w-full" onClick={handleSubmit} isLoading={isLoading}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
