"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { EmployeeDirectory } from "@/components/employees/EmployeeDirectory";
import { directoryEmployees } from "@/features/employees/directoryData";

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredEmployees = directoryEmployees.filter((employee) =>
    [employee.name, employee.jobTitle, employee.email]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  return (
    <div className="mx-auto max-w-350">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directory</h1>
          <p className="mt-1 text-sm text-gray-500">This is directory board</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employee"
            aria-label="Search employees"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <EmployeeDirectory employees={filteredEmployees} />

      {filteredEmployees.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-500">
          No employees found.
        </p>
      )}
    </div>
  );
}
