"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  CalendarOff,
  Clock,
  Wallet,
  TrendingUp,
  UserPlus,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  Settings,
  Sun,
  Moon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  subItems?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { 
    label: "Employees", 
    href: "/employees", 
    icon: Users,
    subItems: [
      { label: "Manage Employees", href: "/employees" },
      { label: "Directory", href: "/employees/directory" },
      { label: "ORG Chart", href: "/employees/org-chart" },
    ]
  },
  { label: "Checklist", href: "/checklist", icon: CheckSquare, subItems: [] },
  { 
    label: "Time Off", 
    href: "/leaves", 
    icon: CalendarOff, 
    subItems: [
      { label: "My Time Off", href: "/leaves" },
      { label: "Team Time Off", href: "/leaves/team" },
      { label: "Employee Time Off", href: "/leaves/employee" },
      { label: "Settings", href: "/leaves/settings" },
    ]
  },
  { label: "Attendance", href: "/attendance", icon: Clock, subItems: [] },
  { label: "Payroll", href: "/payroll", icon: Wallet, subItems: [] },
  { label: "Performance", href: "/performance", icon: TrendingUp, subItems: [] },
  { label: "Recruitment", href: "/recruitment", icon: UserPlus, subItems: [] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // By default, open the accordion of the currently active path's parent
  const activeParent = navItems.find((item) => pathname.startsWith(item.href))?.label;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    [activeParent || ""]: true
  });

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={`flex flex-col border-r border-gray-100 bg-white transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
            H
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-gray-900">
              HRDashboard
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="mt-2 flex-1 space-y-1 px-3 overflow-y-auto scrollbar-hide" aria-label="Main navigation">
        {navItems.map((item) => {
          const { label, href, icon: Icon, subItems } = item;
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
          const hasSubItems = subItems && subItems.length > 0;
          const isExpanded = expandedItems[label];

          // Dashboard uses the green pill active style. Others use a text color active style if they have submenus
          const isDashboard = label === "Dashboard";

          return (
            <div key={label} className="flex flex-col">
              {isDashboard ? (
                <Link
                  href={href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {!collapsed && <span className="flex-1">{label}</span>}
                </Link>
              ) : (
                <div 
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive ? "text-emerald-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    if (hasSubItems) toggleExpand(label);
                    else window.location.href = href;
                  }}
                >
                  <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{label}</span>
                      {hasSubItems || item.subItems ? (
                        isExpanded ? (
                          <ChevronUp className={`h-4 w-4 ${isActive ? "text-emerald-500" : "text-gray-300"}`} />
                        ) : (
                          <ChevronDown className={`h-4 w-4 ${isActive ? "text-emerald-500" : "text-gray-300"}`} />
                        )
                      ) : null}
                    </>
                  )}
                </div>
              )}

              {/* Sub-items Rendering */}
              {!collapsed && hasSubItems && isExpanded && (
                <div className="ml-[22px] mt-1 pl-4 border-l border-gray-100 flex flex-col gap-1 relative before:absolute before:left-[-1px] before:top-0 before:h-full before:w-[1px] before:bg-gray-100">
                  {subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                          isSubActive
                            ? "bg-gray-50 text-gray-900"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {/* Connecting horizontal line */}
                        <div className="absolute -left-[17px] top-1/2 h-[1px] w-[12px] bg-gray-100" />
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="mt-auto space-y-1 border-t border-gray-100 px-3 pt-4 pb-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <HelpCircle className="h-[18px] w-[18px] text-gray-400" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Help Center</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                8
              </span>
            </>
          )}
        </button>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="h-[18px] w-[18px] text-gray-400" />
          {!collapsed && <span>Setting</span>}
        </Link>

        {!collapsed && (
          <div className="mt-3 flex items-center rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-all ${
                theme === "light"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-all ${
                theme === "dark"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
