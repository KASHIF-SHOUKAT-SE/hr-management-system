"use client";

import { StatCard } from "./StatCard";
import { useGetStatsQuery } from "@/features/dashboard/dashboardApi";
import type { StatItem } from "@/features/dashboard/dashboard.types";

const fallbackStats: StatItem[] = [
  { label: "Total Employees", value: 12, changePercent: 25.5, icon: "employees" },
  { label: "Job Applicants", value: 1150, changePercent: 4.1, icon: "applicants" },
  { label: "New Employees", value: 2, changePercent: 5.1, icon: "new" },
  { label: "Resigned Employees", value: 1, changePercent: -25.5, icon: "resigned" },
];

interface StatCardGridProps {
  stats?: StatItem[];
}

export function StatCardGrid({ stats: initialStats }: StatCardGridProps) {
  const { data: apiData } = useGetStatsQuery();

  const stats = initialStats ?? (apiData?.stats && apiData.stats.length > 0 ? apiData.stats : fallbackStats);

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
