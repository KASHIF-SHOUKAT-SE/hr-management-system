"use client";

import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { type ColDef, type ICellRendererParams } from "ag-grid-community";
import "@/lib/ag-grid-setup";
import { CalendarIcon, Plus, RefreshCw, Link as LinkIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActionIconButton } from "@/components/ui/ActionIconButton";
import { Pagination } from "@/components/ui/Pagination";
import { DateRangeInput } from "@/components/ui/DateRangeInput";
import type { LeaveRequest } from "@/features/time-off/timeOff.types";

/* ── Cell Renderers ── */

function DateRenderer(params: ICellRendererParams<LeaveRequest>) {
  if (!params.value) return null;
  return <span className="text-sm font-medium text-gray-700">{format(new Date(params.value), "dd MMM yyyy")}</span>;
}

function TotalDaysRenderer(params: ICellRendererParams<LeaveRequest>) {
  if (!params.value) return null;
  return <span className="text-sm text-gray-600">{params.value} Days</span>;
}

function AttachmentRenderer(params: ICellRendererParams<LeaveRequest>) {
  if (!params.value) return <span className="text-sm text-gray-400">-</span>;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{params.value}</span>
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
    </div>
  );
}

function StatusRenderer(params: ICellRendererParams<LeaveRequest>) {
  if (!params.value) return null;
  return <StatusBadge status={params.value === "approved" ? "active" : params.value === "rejected" ? "error" : "warning"} />;
}

function ActionsRenderer(params: ICellRendererParams<LeaveRequest> & { onViewRequest?: () => void }) {
  return (
    <div className="flex h-full items-center gap-2 py-1">
      <ActionIconButton color="green" title="Approve">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </ActionIconButton>
      <ActionIconButton color="blue" title="View/Edit" onClick={params.onViewRequest}>
        <LinkIcon className="h-3.5 w-3.5" />
      </ActionIconButton>
      <ActionIconButton color="red" title="Delete">
        <Trash2 className="h-3.5 w-3.5" />
      </ActionIconButton>
    </div>
  );
}

/* ── Component ── */

interface RequestTimeListProps {
  rows: LeaveRequest[];
  isLoading?: boolean;
  typeOptions: { label: string; value: string }[];
  type: string;
  onTypeChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (val: number) => void;
  onAddNewRequest: () => void;
  onViewRequest: () => void;
}

export function RequestTimeList({
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
  onAddNewRequest,
  onViewRequest,
}: RequestTimeListProps) {
  const columnDefs = useMemo<ColDef<LeaveRequest>[]>(
    () => [
      { headerName: "From", field: "from", flex: 1, minWidth: 140, cellRenderer: DateRenderer },
      { headerName: "To", field: "to", flex: 1, minWidth: 140, cellRenderer: DateRenderer },
      { headerName: "Total", field: "totalDays", flex: 0.8, minWidth: 100, cellRenderer: TotalDaysRenderer },
      { headerName: "Type", field: "type", flex: 1, minWidth: 120 },
      { headerName: "Attachment", field: "attachmentName", flex: 1.2, minWidth: 150, cellRenderer: AttachmentRenderer },
      { headerName: "Status", field: "status", flex: 1, minWidth: 130, cellRenderer: StatusRenderer },
      { 
        headerName: "Action", 
        field: "id", 
        flex: 1.2, 
        minWidth: 160, 
        cellRenderer: ActionsRenderer, 
        cellRendererParams: { onViewRequest },
        sortable: false 
      },
    ],
    [onViewRequest]
  );

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);
  
  const statusOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-gray-900">Request Time List</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<RefreshCw className="h-4 w-4" />}>
            Sync With Google
          </Button>
          <Button variant="dark" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddNewRequest}>
            Add New Request
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 lg:w-3/4">
        <DateRangeInput value="01 Jan 2023 - 10 Mar 2023" />
        <SelectMenu value={type} options={typeOptions} onChange={onTypeChange} />
        <SelectMenu value={status} options={statusOptions} onChange={onStatusChange} />
      </div>

      {/* Grid */}
      <div className="px-5 pb-5 ag-theme-alpine w-full flex-1">
        <AgGridReact<LeaveRequest>
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={64}
          headerHeight={48}
          loading={isLoading}
          domLayout="autoHeight"
        />
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <span className="text-sm text-gray-500" />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
