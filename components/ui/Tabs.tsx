import React from "react";

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function Tabs({ tabs, activeTab, onChange, orientation = "horizontal" }: TabsProps) {
  const isVertical = orientation === "vertical";
  
  return (
    <div className={`flex ${isVertical ? "flex-col gap-2 w-64 border-r border-gray-100 pr-4" : "border-b border-gray-200"}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        if (isVertical) {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.icon && (
                <span className={isActive ? "text-emerald-500" : "text-gray-400"}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        }

        // Horizontal (default) styling
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-1 pb-4 pt-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {tab.icon && (
              <span className={isActive ? "text-emerald-500" : "text-gray-400"}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
