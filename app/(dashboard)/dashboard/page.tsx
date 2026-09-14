import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { TeamPerformanceChart } from "@/components/dashboard/TeamPerformanceChart";
import { EmployeeTableCard } from "@/components/dashboard/EmployeeTableCard";
import { TotalEmployeeChart } from "@/components/dashboard/TotalEmployeeChart";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <GreetingHeader />

      {/* Row 1: Stats + Performance Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
        <StatCardGrid />
        <TeamPerformanceChart />
      </div>

      {/* Row 2: Employees Table + Total Employee Donut */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <EmployeeTableCard />
        <TotalEmployeeChart />
      </div>
    </div>
  );
}
