"use client";

import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export function UserMenu() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100"
    >
      <Avatar name="Pristia Candra" size={34} />
      <span className="text-sm font-medium text-gray-700">Pristia</span>
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </button>
  );
}
