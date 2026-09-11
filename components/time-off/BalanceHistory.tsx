"use client";

import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { type ColDef, type ICellRendererParams } from "ag-grid-community";
import "@/lib/ag-grid-setup";
import { format } from "date-fns";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { DateRangeInput } from "@/components/ui/DateRangeInput";
import { Avatar } from "@/components/ui/Avatar";
import type { BalanceHistoryEntry } from "@/features/time-off/timeOff.types";

/* ── Cell Renderers ── */

function DateRenderer(params: ICellRendererParams<BalanceHistoryEntry>) {
  if (!params.value) return null;
  return <span className="text-sm font-medium text-gray-700">{format(new Date(params.value), "dd MMM yyyy")}</span>;
}

function ChangedByRenderer(params: ICellRendererParams<BalanceHistoryEntry>) {
  if (!params.value) return null;
  const { name, avatarUrl } = params.value;
  return (
    <div className="flex items-center gap-2 py-2">
      <Avatar name={name} src={avatarUrl} size={24} />
      <span className="text-sm text-gray-600">{name}</span>
    </div>
  );
}

function ChangeDaysRenderer(params: ICellRendererParams<BalanceHistoryEntry>) {
  if (params.value === undefined || params.value === null) return null;
  const val = params.value;
  const isPositive = val > 0;
  return (
    <span className={`text-sm font-medium ${isPositive ? "text-emerald-600" : "text-gray-900"}`}>
      {isPositive ? `+${val}` : val} Days
    </span>
  );
}

/* ── Component ── */

interface BalanceHistoryProps {
  rows: BalanceHistoryEntry[];
  isLoading?: boolean;
  typeOptions: { label: string; value: string }[];
  type: string;
  onTypeChange: (val: string) => void;
}

export function BalanceHistory({
  rows,
  isLoading,
  typeOptions,
  type,
  onTypeChange,
}: BalanceHistoryProps) {
  const columnDefs = useMemo<ColDef<BalanceHistoryEntry>[]>(
    () => [
      { headerName: "Date", field: "date", flex: 1, minWidth: 140, cellRenderer: DateRenderer },
      { headerName: "Event", field: "event", flex: 1, minWidth: 150 },
      { headerName: "Type", field: "type", flex: 1, minWidth: 140 },
      { 
        headerName: "Changed By", 
        field: "changedBy", 
        flex: 1.2, 
        minWidth: 180, 
        cellRenderer: ChangedByRenderer,
        valueFormatter: (params) => params.value?.name || ""
      },
      { headerName: "Change (Days)", field: "changeDays", flex: 1, minWidth: 130, cellRenderer: ChangeDaysRenderer },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);

  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold text-gray-900">Balance History</h2>
        
        <div className="flex flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-md lg:flex-none">
          <DateRangeInput value="01 Jan 2023 - 10 Mar 2023" />
          <SelectMenu value={type} options={typeOptions} onChange={onTypeChange} />
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 pb-5 pt-2 ag-theme-alpine w-full flex-1">
        <AgGridReact<BalanceHistoryEntry>
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={64}
          headerHeight={48}
          loading={isLoading}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
