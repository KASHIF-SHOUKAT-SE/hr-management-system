"use client";

import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import "@/lib/ag-grid-setup";
import { Download, FileUp, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DateRangeInput } from "@/components/ui/DateRangeInput";
import type { TeamLeaveRequest } from "@/features/time-off/timeOff.types";
import Image from "next/image";

interface TimeOffDataGridProps {
  title?: string;
  rows: TeamLeaveRequest[];
  isLoading: boolean;
  typeOptions: { label: string; value: string }[];
  type: string;
  onTypeChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (val: number) => void;
}

// Custom Cell Renderers
function EmployeeRenderer(params: ICellRendererParams<TeamLeaveRequest>) {
  const employee = params.data?.employee;
  if (!employee) return <div className="py-2">-</div>;

  return (
    <div className="flex h-full items-center gap-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-100 shrink-0">
        {employee.avatarUrl ? (
          <Image src={employee.avatarUrl} alt={employee.name} width={32} height={32} className="object-cover" />
        ) : (
          <span className="text-xs font-semibold text-gray-500">
            {employee.name.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-col justify-center leading-tight">
        <span className="text-sm font-medium text-gray-900">{employee.name}</span>
        <span className="text-xs text-gray-500">{employee.email}</span>
      </div>
    </div>
  );
}

function DateRenderer(params: ICellRendererParams<TeamLeaveRequest>) {
  if (!params.value) return <span>-</span>;
  const date = new Date(params.value);
  return (
    <span className="text-sm font-medium text-gray-600">
      {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
    </span>
  );
}

function TotalDaysRenderer(params: ICellRendererParams<TeamLeaveRequest>) {
  return <span className="text-sm font-medium text-gray-900">{params.value} Days</span>;
}

function AttachmentRenderer(params: ICellRendererParams<TeamLeaveRequest>) {
  if (!params.value) return <span className="text-sm text-gray-400">-</span>;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>{params.value}</span>
      <FileUp className="h-4 w-4 text-gray-400" />
    </div>
  );
}

function StatusRenderer(params: ICellRendererParams<TeamLeaveRequest>) {
  if (!params.value) return null;
  const statusStr = params.value.toLowerCase();
  let type: "active" | "error" | "warning" | "default" = "warning";
  if (statusStr === "approved") type = "active";
  if (statusStr === "rejected") type = "error";

  return (
    <div className="flex h-full items-center">
      <StatusBadge status={type} text={params.value.toUpperCase()} />
    </div>
  );
}

export function TimeOffDataGrid({
  title = "Team Time Off",
  rows,
  isLoading,
  typeOptions,
  type,
  onTypeChange,
  status,
  onStatusChange,
  page,
  totalPages,
  onPageChange,
}: TimeOffDataGridProps) {
  const columnDefs = useMemo<ColDef<TeamLeaveRequest>[]>(
    () => [
      {
        headerName: "Employee Name",
        field: "employee",
        flex: 2,
        minWidth: 200,
        cellRenderer: EmployeeRenderer,
      },
      { headerName: "From", field: "from", flex: 1, minWidth: 120, cellRenderer: DateRenderer },
      { headerName: "To", field: "to", flex: 1, minWidth: 120, cellRenderer: DateRenderer },
      { headerName: "Total", field: "totalDays", flex: 0.8, minWidth: 100, cellRenderer: TotalDaysRenderer },
      { headerName: "Type", field: "type", flex: 1.2, minWidth: 130 },
      { headerName: "Attachment", field: "attachmentName", flex: 1.2, minWidth: 150, cellRenderer: AttachmentRenderer },
      { headerName: "Status", field: "status", flex: 1, minWidth: 130, cellRenderer: StatusRenderer },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);

  const statusOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employee" 
              className="h-10 w-full md:w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <Button variant="dark" className="h-10 px-4 rounded-xl flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
            <button className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <DateRangeInput 
          startDate="01 Jan 2023" 
          endDate="10 Mar 2023" 
          onChange={() => {}} 
        />
        <SelectMenu 
          options={typeOptions} 
          value={type} 
          onChange={onTypeChange} 
        />
        <SelectMenu 
          options={statusOptions} 
          value={status} 
          onChange={onStatusChange} 
        />
      </div>

      {/* Data Grid */}
      <div className="ag-theme-alpine h-[500px] w-full">
        {isLoading && rows.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Loading Team Requests...</p>
          </div>
        ) : (
          <AgGridReact
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={64}
            headerHeight={48}
            suppressCellFocus={true}
            rowSelection={{ mode: "multiRow", checkboxes: true, headerCheckbox: true }}
            suppressDragLeaveHidesColumns={true}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                page === i + 1 ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <span className="mx-1 text-gray-400">...</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100">
            10
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Showing {(page - 1) * 8 + 1} to {Math.min(page * 8, 50)} of 50 entries</span>
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="rounded-lg border border-gray-200 bg-white px-2 py-1 outline-none focus:border-emerald-500">
              <option>8</option>
              <option>10</option>
              <option>20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
