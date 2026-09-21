"use client";

import { useState, useMemo } from "react";
import { EmployeePageHeader } from "@/components/employees/EmployeePageHeader";
import { EmployeeFilterBar } from "@/components/employees/EmployeeFilterBar";
import { EmployeeDataGrid } from "@/components/employees/EmployeeDataGrid";
import { Pagination } from "@/components/ui/Pagination";
import { useGetEmployeesQuery, useGetEmployeeFiltersQuery } from "@/features/employees/employeesApi";
import { EmployeeForm } from "@/components/forms/EmployeeForm";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [office, setOffice] = useState("All Offices");
  const [jobTitle, setJobTitle] = useState("All Job Titles");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetEmployeesQuery({
    page,
    limit,
    search,
    office,
    jobTitle,
    status,
  });

  const { data: filtersData } = useGetEmployeeFiltersQuery();

  const officeOptions = useMemo(() => {
    const base = [{ label: "All Offices", value: "All Offices" }];
    if (!filtersData?.offices) return base;
    return [...base, ...filtersData.offices.map((officeName) => ({ label: officeName, value: officeName }))];
  }, [filtersData]);

  const jobTitleOptions = useMemo(() => {
    const base = [{ label: "All Job Titles", value: "All Job Titles" }];
    if (!filtersData?.jobTitles) return base;
    return [...base, ...filtersData.jobTitles.map((title) => ({ label: title, value: title }))];
  }, [filtersData]);

  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-350">
      <EmployeePageHeader onAddNew={() => setIsEmployeeFormOpen(true)} />

      <div className="mb-8 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
        <EmployeeFilterBar
          search={search}
          onSearchChange={(value) => handleFilterChange(setSearch, value)}
          office={office}
          onOfficeChange={(value) => handleFilterChange(setOffice, value)}
          officeOptions={officeOptions}
          jobTitle={jobTitle}
          onJobTitleChange={(value) => handleFilterChange(setJobTitle, value)}
          jobTitleOptions={jobTitleOptions}
          status={status}
          onStatusChange={(value) => handleFilterChange(setStatus, value)}
        />

        <div className="overflow-x-auto p-4">
          <EmployeeDataGrid rows={data?.data || []} isLoading={isLoading || isFetching} />
        </div>

        {data && data.totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 p-4">
            <span className="text-sm text-gray-500">
              Showing {(data.page - 1) * limit + 1} to {Math.min(data.page * limit, data.totalCount)} of {data.totalCount} entries
            </span>
            <Pagination currentPage={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <EmployeeForm
        isOpen={isEmployeeFormOpen}
        onClose={() => setIsEmployeeFormOpen(false)}
      />
    </div>
  );
}
