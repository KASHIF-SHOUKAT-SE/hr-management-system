"use client";

import { useState } from "react";
import { Calendar, FileText } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { HolidayTab } from "@/components/time-off/HolidayTab";
import { TypesPoliciesTab } from "@/components/time-off/TypesPoliciesTab";

export default function TimeOffSettingsPage() {
  const [activeTab, setActiveTab] = useState("holiday");

  const tabs = [
    { id: "holiday", label: "Holiday", icon: <Calendar className="h-4 w-4" /> },
    { id: "types-policies", label: "Types & Policies", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setting Time Off</h1>
        <p className="text-sm text-gray-500 mt-1">Setting your Time off here</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          orientation="vertical" 
        />
        
        <div className="flex-1 w-full">
          {activeTab === "holiday" && <HolidayTab />}
          {activeTab === "types-policies" && <TypesPoliciesTab />}
        </div>
      </div>
    </div>
  );
}
