import { Users, Briefcase, UserPlus, UserMinus } from "lucide-react";
import { TrendBadge } from "@/components/ui/TrendBadge";
import type { StatItem } from "@/features/dashboard/dashboard.types";

const iconMap = {
  employees: Users,
  applicants: Briefcase,
  new: UserPlus,
  resigned: UserMinus,
} as const;

const iconBgMap = {
  employees: "bg-blue-50 text-blue-600",
  applicants: "bg-purple-50 text-purple-600",
  new: "bg-emerald-50 text-emerald-600",
  resigned: "bg-orange-50 text-orange-600",
} as const;

interface StatCardProps {
  stat: StatItem;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.icon];
  const iconStyle = iconBgMap[stat.icon];

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Value + Trend */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl font-bold text-gray-900">
          {stat.value.toLocaleString()}
        </span>
        <TrendBadge value={stat.changePercent} />
      </div>

      {/* Label */}
      <span className="text-sm text-gray-500">{stat.label}</span>
    </article>
  );
}
