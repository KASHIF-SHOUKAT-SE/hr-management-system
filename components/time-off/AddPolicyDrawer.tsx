"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateLeavePolicyMutation, useGetLeaveTypesQuery } from "@/features/time-off/timeOffApi";
import { CreateLeavePolicyPayload } from "@/features/time-off/timeOff.types";

interface AddPolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTypeId?: string;
}

export function AddPolicyDrawer({ isOpen, onClose, preselectedTypeId }: AddPolicyDrawerProps) {
  const [isRendered, setIsRendered] = useState(false);
  const { data: typesData } = useGetLeaveTypesQuery({ activeOnly: true });
  const activeTypes = typesData?.data || [];

  // Form State
  const [name, setName] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("All Employees");
  const [accrualFrequency, setAccrualFrequency] = useState<"Yearly" | "Monthly" | "Weekly" | "None">("Yearly");
  const [entitlementAmount, setEntitlementAmount] = useState<number>(0);
  const [maxCarryOver, setMaxCarryOver] = useState<number>(0);
  const [carryOverExpiration, setCarryOverExpiration] = useState<number>(0);
  const [isHourlyAllowed, setIsHourlyAllowed] = useState(false);
  const [standardWorkingHours, setStandardWorkingHours] = useState<number>(8);

  const [createLeavePolicy, { isLoading }] = useCreateLeavePolicyMutation();

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      
      // Reset state
      setName("");
      setLeaveType(preselectedTypeId || (activeTypes.length > 0 ? activeTypes[0]._id : ""));
      setDescription("");
      setEligibility("All Employees");
      setAccrualFrequency("Yearly");
      setEntitlementAmount(0);
      setMaxCarryOver(0);
      setCarryOverExpiration(0);
      setIsHourlyAllowed(false);
      setStandardWorkingHours(8);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen, preselectedTypeId, activeTypes]);

  if (!isRendered && !isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !leaveType) {
      alert("Policy name and Type are required.");
      return;
    }
    
    const payload: CreateLeavePolicyPayload = {
      name,
      leaveType,
      description,
      eligibility,
      accrualFrequency,
      entitlementAmount: Number(entitlementAmount),
      maxCarryOver: Number(maxCarryOver),
      carryOverExpiration: Number(carryOverExpiration),
      durationAllowed: {
        isHourlyAllowed,
        standardWorkingHours: Number(standardWorkingHours),
      },
    };

    try {
      await createLeavePolicy(payload).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create leave policy:", error);
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
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">Create Policy</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Policy Name <span className="text-red-500">*</span>
                </label>
                <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input
                    type="text"
                    placeholder="e.g. Annual Leave 2025"
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <select
                    className="w-full bg-transparent text-sm text-gray-900 outline-none"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="" disabled>Select Type</option>
                    {activeTypes.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Input description about policy"
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">Accrual</h3>
              
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Assignees <span className="text-red-500">*</span></label>
                <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <select
                    className="w-full bg-transparent text-sm text-gray-900 outline-none"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Full-time Employees">Full-time Employees</option>
                    <option value="Part-time Employees">Part-time Employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Accrual Frequency <span className="text-red-500">*</span></label>
                  <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <select
                      className="w-full bg-transparent text-sm text-gray-900 outline-none"
                      value={accrualFrequency}
                      onChange={(e) => setAccrualFrequency(e.target.value as any)}
                    >
                      <option value="Yearly">Yearly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Entitlement <span className="text-red-500">*</span></label>
                  <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      className="w-full bg-transparent text-sm text-gray-900 outline-none"
                      value={entitlementAmount}
                      onChange={(e) => setEntitlementAmount(Number(e.target.value))}
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">Days per unit</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">Carry Over</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Maximum carry over <span className="text-red-500">*</span></label>
                  <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                    <input
                      type="number"
                      min={0}
                      className="w-full bg-transparent text-sm text-gray-900 outline-none"
                      value={maxCarryOver}
                      onChange={(e) => setMaxCarryOver(Number(e.target.value))}
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">Days per year</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Carry Over Expiration <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <div className="flex h-11 flex-1 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                      <select className="w-full bg-transparent text-sm text-gray-900 outline-none">
                        <option value="Day">Day</option>
                        <option value="Month">Month</option>
                      </select>
                    </div>
                    <div className="flex h-11 w-16 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                      <input
                        type="number"
                        min={0}
                        className="w-full bg-transparent text-sm text-gray-900 outline-none text-center"
                        value={carryOverExpiration}
                        onChange={(e) => setCarryOverExpiration(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">Duration Allowed</h3>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Hourly</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-[400px]">
                      Employee can book time off hourly. Hours will be calculated by Standard working hours.
                      (Ex. Standard working hours = 8 hours/day, if taken off = 4/8 days).
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={isHourlyAllowed}
                      onChange={(e) => setIsHourlyAllowed(e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                  </label>
                </div>
                {isHourlyAllowed && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-700">Standard working hours:</span>
                    <div className="flex h-9 w-20 items-center rounded-lg border border-gray-200 bg-white px-2">
                      <input
                        type="number"
                        min={1}
                        max={24}
                        className="w-full bg-transparent text-sm text-center text-gray-900 outline-none"
                        value={standardWorkingHours}
                        onChange={(e) => setStandardWorkingHours(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              Save & Assign Employee
            </button>
            <div className="flex gap-4">
              <Button variant="outline" className="w-24" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="dark" className="w-24" onClick={handleSubmit} isLoading={isLoading}>
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
