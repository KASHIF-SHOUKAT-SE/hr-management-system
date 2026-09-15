"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useGetLeaveTypesQuery, useUpdateLeaveTypeMutation } from "@/features/time-off/timeOffApi";
import { AddTypeDrawer } from "./AddTypeDrawer";
import { AddPolicyDrawer } from "./AddPolicyDrawer";
import { LeaveType, LeavePolicy } from "@/features/time-off/timeOff.types";

export function TypesPoliciesTab() {
  const { data, isLoading } = useGetLeaveTypesQuery({ includePolicies: true });
  const [updateLeaveType] = useUpdateLeaveTypeMutation();
  
  const [isTypeDrawerOpen, setIsTypeDrawerOpen] = useState(false);
  const [isPolicyDrawerOpen, setIsPolicyDrawerOpen] = useState(false);
  const [preselectedTypeId, setPreselectedTypeId] = useState<string | undefined>();

  const types = data?.data || [];

  const handleToggleType = async (type: LeaveType) => {
    try {
      await updateLeaveType({ id: type._id, payload: { isActive: !type.isActive } }).unwrap();
    } catch (error) {
      console.error("Failed to toggle type:", error);
    }
  };

  const handleAddPolicy = (typeId?: string) => {
    setPreselectedTypeId(typeId);
    setIsPolicyDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-gray-900">Types and Policies</h3>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsTypeDrawerOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Type
          </Button>
          <Button variant="dark" onClick={() => handleAddPolicy()} className="gap-2">
            <Plus className="h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      {types.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No Leave Types found. Create a new type to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {types.map((type) => (
            <div key={type._id} className="flex flex-col">
              {/* Type Header */}
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-gray-900">{type.name}</h4>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {type.isPaid ? "Paid" : "Unpaid"}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {type.unit}
                  </span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={type.isActive}
                    onChange={() => handleToggleType(type)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                </label>
              </div>

              {/* Policies Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50/50 text-xs text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Policy Name</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Eligibility</th>
                      <th className="px-4 py-3 font-medium w-24 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {!type.policies || type.policies.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-xs text-gray-400">
                          No policies defined. 
                          <button 
                            className="ml-2 text-emerald-600 hover:underline"
                            onClick={() => handleAddPolicy(type._id)}
                          >
                            Add Policy
                          </button>
                        </td>
                      </tr>
                    ) : (
                      type.policies.map((policy: LeavePolicy) => (
                        <tr key={policy._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{policy.name}</td>
                          <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]">
                            {policy.description || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{policy.eligibility}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100">
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTypeDrawer isOpen={isTypeDrawerOpen} onClose={() => setIsTypeDrawerOpen(false)} />
      <AddPolicyDrawer 
        isOpen={isPolicyDrawerOpen} 
        onClose={() => setIsPolicyDrawerOpen(false)} 
        preselectedTypeId={preselectedTypeId}
      />
    </div>
  );
}
