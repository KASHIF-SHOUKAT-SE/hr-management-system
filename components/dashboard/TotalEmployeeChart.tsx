"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Dropdown } from "@/components/ui/Dropdown";
import { useGetEmployeeSummaryQuery } from "@/features/dashboard/dashboardApi";
import type { EmployeeSummarySlice } from "@/features/dashboard/dashboard.types";

const defaultSlices: EmployeeSummarySlice[] = [
  { label: "Active", value: 8, color: "#16A34A" },
  { label: "Onboarding", value: 2, color: "#FBBF24" },
  { label: "Terminated", value: 1, color: "#3B82F6" },
  { label: "On Leave", value: 1, color: "#F97316" },
];

interface TotalEmployeeChartProps {
  slices?: EmployeeSummarySlice[];
  totalCount?: number;
}

export function TotalEmployeeChart({
  slices: initialSlices,
  totalCount: initialTotal,
}: TotalEmployeeChartProps) {
  // Pull live dynamic breakdown from MongoDB
  const { data: apiData } = useGetEmployeeSummaryQuery({});

  const slices = initialSlices ?? (apiData?.slices && apiData.slices.length > 0 ? apiData.slices : defaultSlices);
  const total = initialTotal ?? (apiData?.totalCount ?? slices.reduce((sum, s) => sum + s.value, 0));

  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Total Employee
        </h3>
        <Dropdown
          value="All Time"
          options={["All Time", "This Year", "This Month"]}
        />
      </div>

      {/* Donut Chart */}
      <div className="relative mx-auto mt-4" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {slices.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-[11px] text-gray-400">Total Emp</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 space-y-2.5">
        {slices.map((slice) => (
          <div key={slice.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-gray-500">{slice.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {slice.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
