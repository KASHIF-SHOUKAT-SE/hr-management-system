"use client";

import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import "@/lib/ag-grid-setup"; // Centralized module registration
import { MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { EmployeeRow } from "@/features/dashboard/dashboard.types";

/* ── Cell Renderers ── */

function EmployeeNameRenderer(params: ICellRendererParams<EmployeeRow>) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center gap-3 py-1">
      <Avatar name={data.name} src={data.avatarUrl} size={32} />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-gray-900">
          {data.name}
        </div>
        <div className="truncate text-xs text-gray-400">{data.email}</div>
      </div>
    </div>
  );
}

function LineManagerRenderer(params: ICellRendererParams<EmployeeRow>) {
  if (!params.value) return null;
  return (
    <span className="text-sm text-emerald-600">{params.value}</span>
  );
}

function ActionsRenderer() {
  return (
    <button
      type="button"
      className="flex h-full items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
    >
      <MoreHorizontal className="h-4 w-4" />
    </button>
  );
}

/* ── Dummy data ── */

export const dummyEmployees: EmployeeRow[] = [
  {
    id: "1",
    name: "Pristia Candra",
    email: "pristia@unipixel.com",
    jobTitle: "UI UX Designer",
    lineManager: "@Pristiacandra",
    department: "Team Product",
    office: "Unipixel Office",
  },
  {
    id: "2",
    name: "Hanna Baptista",
    email: "hanna@unipixel.com",
    jobTitle: "Graphic Designer",
    lineManager: "@Pristiacandra",
    department: "Team Product",
    office: "Unipixel Office",
  },
  {
    id: "3",
    name: "Rayhan Saris",
    email: "rayhan@unipixel.com",
    jobTitle: "Frontend Developer",
    lineManager: "@Pristiacandra",
    department: "Team Product",
    office: "Unipixel Office",
  },
  {
    id: "4",
    name: "Alisa Sahara",
    email: "alisa@unipixel.com",
    jobTitle: "Backend Developer",
    lineManager: "@Pristiacandra",
    department: "Engineering",
    office: "Unipixel Office",
  },
  {
    id: "5",
    name: "Dimas Pratama",
    email: "dimas@unipixel.com",
    jobTitle: "Product Manager",
    lineManager: "@Pristiacandra",
    department: "Team Product",
    office: "Jakarta Office",
  },
];

/* ── Grid Component ── */

interface EmployeeGridProps {
  rows?: EmployeeRow[];
  compact?: boolean;
  pageSize?: number;
}

export function EmployeeGrid({
  rows = dummyEmployees,
  compact = false,
  pageSize = 10,
}: EmployeeGridProps) {
  const columnDefs = useMemo<ColDef<EmployeeRow>[]>(
    () => [
      {
        headerName: "Employee Name",
        field: "name",
        minWidth: 220,
        flex: 2,
        cellRenderer: EmployeeNameRenderer,
      },
      {
        headerName: "Job Title",
        field: "jobTitle",
        minWidth: 140,
        flex: 1,
      },
      {
        headerName: "Line Manager",
        field: "lineManager",
        minWidth: 140,
        flex: 1,
        cellRenderer: LineManagerRenderer,
      },
      {
        headerName: "Department",
        field: "department",
        minWidth: 130,
        flex: 1,
      },
      {
        headerName: "Office",
        field: "office",
        minWidth: 130,
        flex: 1,
      },
      {
        headerName: "",
        field: "id",
        width: 50,
        maxWidth: 50,
        cellRenderer: ActionsRenderer,
        suppressSizeToFit: true,
        resizable: false,
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  // AG Grid v36: rowSelection must be an object
  const rowSelection = useMemo(() => ({
    mode: "multiRow" as const,
    checkboxes: true,
    headerCheckbox: true,
  }), []);

  const rowHeight = compact ? 48 : 56;
  const paginationPageSizeSelector = useMemo(
    () => Array.from(new Set([pageSize, 20, 50, 100])),
    [pageSize]
  );

  return (
    <div
      className="ag-theme-alpine w-full"
      style={{ height: Math.min(rows.length, pageSize) * rowHeight + 48 }}
    >
      <AgGridReact<EmployeeRow>
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={rowHeight}
        headerHeight={44}
        rowSelection={rowSelection}
        pagination={rows.length > pageSize}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[5, 10, 20, 50, 100]}
      />
    </div>
  );
}
