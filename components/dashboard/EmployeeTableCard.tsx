"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { dummyEmployees, EmployeeGrid } from "@/components/grids/EmployeeGrid";
import { Dropdown } from "@/components/ui/Dropdown";
import { useGetEmployeeSummaryQuery } from "@/features/dashboard/dashboardApi";
import type { EmployeeRow } from "@/features/dashboard/dashboard.types";

interface EmployeeTableCardProps {
  rows?: EmployeeRow[];
}

export function EmployeeTableCard({ rows: initialRows }: EmployeeTableCardProps) {
  const [search, setSearch] = useState("");
  const [office, setOffice] = useState("All Offices");
  const [jobTitle, setJobTitle] = useState("All Job Titles");
  const [status, setStatus] = useState("All Status");

  // Fetch real data from MongoDB via RTK Query
  const { data: apiData, isLoading } = useGetEmployeeSummaryQuery({});

  const allEmployees: EmployeeRow[] = useMemo(() => {
    if (initialRows && initialRows.length > 0) return initialRows;
    if (apiData?.employees && apiData.employees.length > 0) return apiData.employees;
    return dummyEmployees;
  }, [initialRows, apiData]);

  // Client-side filtering
  const filteredRows = useMemo(() => {
    return allEmployees.filter((emp) => {
      const matchesSearch =
        search === "" ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());

      const matchesOffice =
        office === "All Offices" || emp.office.toLowerCase() === office.toLowerCase();

      const matchesJobTitle =
        jobTitle === "All Job Titles" ||
        emp.jobTitle.toLowerCase() === jobTitle.toLowerCase();

      return matchesSearch && matchesOffice && matchesJobTitle;
    });
  }, [allEmployees, search, office, jobTitle]);

  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Employees</h3>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {isLoading ? "Loading..." : `${filteredRows.length} Total`}
          </span>
        </div>
        <div className="relative w-52">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee"
            className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex items-center gap-3">
        <Dropdown
          value={office}
          options={["All Offices", "Unipixel Office", "Jakarta Office", "Remote"]}
          onChange={setOffice}
        />
        <Dropdown
          value={jobTitle}
          options={[
            "All Job Titles",
            "UI UX Designer",
            "UI Designer",
            "Graphic Designer",
            "Frontend Developer",
            "Backend Developer",
            "Product Manager",
            "DevOps Engineer",
            "HR Lead",
            "QA Engineer",
            "Mobile Developer",
          ]}
          onChange={setJobTitle}
        />
        <Dropdown
          value={status}
          options={["All Status", "Active", "On Leave", "Terminated"]}
          onChange={setStatus}
        />
      </div>

      {/* Grid */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            Fetching employees from MongoDB...
          </div>
        ) : (
          <EmployeeGrid rows={filteredRows} compact pageSize={5} />
        )}
      </div>
    </div>
  );
}
