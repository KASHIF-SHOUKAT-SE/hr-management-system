"use client";

import { Info } from "lucide-react";
import type { LeaveBalance } from "@/features/time-off/timeOff.types";

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  return (
    <div className="flex h-24 flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">{balance.type}</span>
        <button type="button" className="text-gray-400 hover:text-gray-600">
          <Info className="h-4 w-4" />
        </button>
      </div>
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-900">{balance.remainingDays} Days</span>
      </div>
    </div>
  );
}

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
  isLoading?: boolean;
}

export function LeaveBalanceCards({ balances, isLoading }: LeaveBalanceCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {balances.slice(0, 4).map((balance) => (
        <LeaveBalanceCard key={balance.id} balance={balance} />
      ))}
    </div>
  );
}
