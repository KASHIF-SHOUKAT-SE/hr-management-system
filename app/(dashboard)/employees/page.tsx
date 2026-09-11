"use client";

import { useState, useMemo } from "react";
import { EmployeePageHeader } from "@/components/employees/EmployeePageHeader";
import { EmployeeFilterBar } from "@/components/employees/EmployeeFilterBar";
import { EmployeeDataGrid } from "@/components/employees/EmployeeDataGrid";
import { Pagination } from "@/components/ui/Pagination";
import { useGetEmployeesQuery, useGetEmployeeFiltersQuery } from "@/features/employees/employeesApi";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [office, setOffice] = useState("All Offices");
  const [jobTitle, setJobTitle] = useState("All Job Titles");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch real data from MongoDB via RTK Query with filters
  const { data, isLoading, isFetching } = useGetEmployeesQuery({
    page,
    limit,
    search,
    office,
    jobTitle,
    status,
  });

  // Fetch dynamic filters
  const { data: filtersData } = useGetEmployeeFiltersQuery();

  const officeOptions = useMemo(() => {
    const base = [{ label: "All Offices", value: "All Offices" }];
    if (!filtersData?.offices) return base;
    return [...base, ...filtersData.offices.map(o => ({ label: o, value: o }))];
  }, [filtersData]);

  const jobTitleOptions = useMemo(() => {
    const base = [{ label: "All Job Titles", value: "All Job Titles" }];
    if (!filtersData?.jobTitles) return base;
    return [...base, ...filtersData.jobTitles.map(j => ({ label: j, value: j }))];
  }, [filtersData]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // Reset to page 1 on filter change
  };

  const handleOfficeChange = (val: string) => {
    setOffice(val);
    setPage(1);
  };

  const handleJobTitleChange = (val: string) => {
    setJobTitle(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <EmployeePageHeader />

      <div className="flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 mb-8">
        <EmployeeFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          office={office}
          onOfficeChange={handleOfficeChange}
          officeOptions={officeOptions}
          jobTitle={jobTitle}
          onJobTitleChange={handleJobTitleChange}
          jobTitleOptions={jobTitleOptions}
          status={status}
          onStatusChange={handleStatusChange}
        />

        <div className="p-4 overflow-x-auto">
          <EmployeeDataGrid rows={data?.data || []} isLoading={isLoading || isFetching} />
        </div>

        {data && data.totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 p-4">
            <span className="text-sm text-gray-500">
              Showing {(data.page - 1) * limit + 1} to{" "}
              {Math.min(data.page * limit, data.totalCount)} of {data.totalCount}{" "}
              entries
            </span>
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
