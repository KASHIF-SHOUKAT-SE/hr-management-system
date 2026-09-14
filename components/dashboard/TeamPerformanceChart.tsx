"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Dropdown } from "@/components/ui/Dropdown";
import { Calendar } from "lucide-react";
import type { TeamPerformancePoint } from "@/features/dashboard/dashboard.types";

const defaultData: TeamPerformancePoint[] = [
  { month: "Jan", projectTeam: 35000, productTeam: 42000 },
  { month: "Feb", projectTeam: 38000, productTeam: 40000 },
  { month: "Mar", projectTeam: 42000, productTeam: 45000 },
  { month: "Apr", projectTeam: 48000, productTeam: 43000 },
  { month: "May", projectTeam: 44000, productTeam: 47000 },
  { month: "Jun", projectTeam: 52000, productTeam: 50000 },
  { month: "Jul", projectTeam: 50000, productTeam: 48000 },
];

interface TeamPerformanceChartProps {
  data?: TeamPerformancePoint[];
}

function formatYAxis(value: number) {
  return `${value / 1000}k`;
}

export function TeamPerformanceChart({
  data = defaultData,
}: TeamPerformanceChartProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Team Performance
          </h3>
          <div className="mt-2 flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-500">Project Team</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-500">Product Team</span>
            </div>
          </div>
        </div>
        <Dropdown
          value="Last 7 month"
          options={["Last 7 month", "Last 30 days", "Last 12 months"]}
          icon={<Calendar className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Chart */}
      <div className="mt-4 flex-1" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={formatYAxis}
              domain={[30000, 60000]}
              dx={-4}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
              formatter={(value) => {
                const num = Number(value);
                return [`${(num / 1000).toFixed(1)}k`];
              }}
            />
            <Line
              type="monotone"
              dataKey="projectTeam"
              stroke="#16A34A"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#16A34A", stroke: "#fff", strokeWidth: 2 }}
              name="Project Team"
            />
            <Line
              type="monotone"
              dataKey="productTeam"
              stroke="#FBBF24"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#FBBF24", stroke: "#fff", strokeWidth: 2 }}
              name="Product Team"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
