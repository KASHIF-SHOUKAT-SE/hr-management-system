"use client";

import { useEffect, useState } from "react";
import { X, FileUp, Calendar, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { useCreateLeaveRequestMutation, useGetLeaveTypesQuery } from "@/features/time-off/timeOffApi";
import { useRouter } from "next/navigation";

export type TimeOffDrawerMode = "view" | "create" | "edit";

interface TimeOffDrawerProps {
  isOpen: boolean;
  mode: TimeOffDrawerMode;
  onClose: () => void;
  onEditClick?: () => void;
  initialData?: any;
}

export function TimeOffDrawer({ isOpen, mode, onClose, onEditClick, initialData }: TimeOffDrawerProps) {
  const router = useRouter();
  const [isRendered, setIsRendered] = useState(false);
  
  const { data: typesData } = useGetLeaveTypesQuery({ activeOnly: true });
  
  // Form State
  const [timeOffType, setTimeOffType] = useState("Annual");
  const [dayType, setDayType] = useState<"single" | "multiple">("multiple");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [note, setNote] = useState("");
  const [assignTo, setAssignTo] = useState("");

  const [createLeaveRequest, { isLoading: isCreating }] = useCreateLeaveRequestMutation();

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      if (typesData?.data && typesData.data.length > 0 && !timeOffType) {
        setTimeOffType(typesData.data[0].name);
      }
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen, typesData, timeOffType]);

  if (!isRendered && !isOpen) return null;

  const typeOptions = typesData?.data?.length 
    ? typesData.data.map(t => ({ label: t.name, value: t.name }))
    : [
        { label: "Annual", value: "Annual" },
        { label: "Sick Leave", value: "Sick Leave" },
        { label: "Engagement", value: "Engagement" },
      ];

  const handleSubmit = async () => {
    try {
      // Calculate basic mock total days
      let totalDays = 1;
      if (dayType === "multiple" && fromDate && toDate) {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
      }

      await createLeaveRequest({
        type: timeOffType,
        from: fromDate || new Date().toISOString().split("T")[0],
        to: dayType === "single" ? fromDate : (toDate || new Date().toISOString().split("T")[0]),
        totalDays,
        note,
        attachmentName: null, // mock for now
      }).unwrap();

      onClose();
      // Redirect to team time off page to show the new request
      router.push("/leaves/employee");
    } catch (error) {
      console.error("Failed to create request:", error);
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
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "view" ? "Detail Time Off" : mode === "edit" ? "Edit Time Off" : "Add New Time Off"}
            </h2>
            {mode === "view" && (
              <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
                PENDING
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {mode === "view" ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <p className="font-medium text-gray-900">01 Mar 2023</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <p className="font-medium text-gray-900">01 Jan 2023</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="font-bold text-gray-900">3 Days</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-900">Engagement</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Attachment</p>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <span className="text-sm text-gray-700">File.pdf</span>
                  <FileUp className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Form Fields for Create/Edit */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Time Off Type <span className="text-red-500">*</span>
                </label>
                <SelectMenu 
                  value={timeOffType} 
                  options={typeOptions} 
                  onChange={setTimeOffType} 
                  placeholder="Select type" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDayType("single")}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                    dayType === "single" 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500" 
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className={`mr-2 h-4 w-4 rounded-full border-2 ${dayType === "single" ? "border-emerald-500 flex items-center justify-center" : "border-gray-300"}`}>
                    {dayType === "single" && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </div>
                  Single Day
                </button>
                <button
                  type="button"
                  onClick={() => setDayType("multiple")}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                    dayType === "multiple" 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500" 
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className={`mr-2 h-4 w-4 rounded-full border-2 ${dayType === "multiple" ? "border-emerald-500 flex items-center justify-center" : "border-gray-300"}`}>
                    {dayType === "multiple" && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </div>
                  Multiple Day
                </button>
              </div>

              {dayType === "single" ? (
                <div>
                  <div className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <input 
                      type="date" 
                      className="w-full bg-transparent text-sm text-gray-700 outline-none" 
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <input 
                      type="date" 
                      className="w-full bg-transparent text-sm text-gray-700 outline-none" 
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <input 
                      type="date" 
                      className="w-full bg-transparent text-sm text-gray-700 outline-none" 
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Give notes"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Attachment</label>
                <button type="button" className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                  <span className="text-sm text-gray-500">Upload attachment</span>
                  <FileUp className="h-5 w-5 text-gray-400" />
                </button>
                <p className="mt-1.5 text-xs text-gray-400">
                  Max file size : 5MB. File format : pdf, docx, png, and jpeg
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Assign To</label>
                <div className="flex h-10 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input
                    type="text"
                    placeholder="Search member name..."
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                  />
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={onClose} disabled={isCreating}>
              {mode === "view" ? "Cancel Request" : "Cancel"}
            </Button>
            {mode === "view" ? (
              <Button variant="dark" className="w-full" onClick={onEditClick}>
                Edit
              </Button>
            ) : (
              <Button variant="dark" className="w-full" onClick={handleSubmit} isLoading={isCreating}>
                {mode === "edit" ? "Save Changes" : "Create"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
