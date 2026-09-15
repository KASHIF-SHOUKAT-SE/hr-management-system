"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import {
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import "@/lib/ag-grid-setup"; // Centralized module registration
import { MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AccountBadge } from "@/components/ui/AccountBadge";
import type { Employee } from "@/features/employees/employees.types";

/* ── Cell Renderers ── */

function EmployeeNameRenderer(params: ICellRendererParams<Employee>) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center gap-3 py-1">
      <Avatar name={data.name} src={data.avatarUrl} size={32} />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-gray-900">
          {data.name}
        </div>
      </div>
    </div>
  );
}

function LineManagerRenderer(params: ICellRendererParams<Employee>) {
  if (!params.value) return null;
  return <span className="text-sm font-medium text-gray-500">{params.value}</span>;
}

function StatusRenderer(params: ICellRendererParams<Employee>) {
  if (!params.value) return null;
  return <StatusBadge status={params.value} />;
}

function AccountRenderer(params: ICellRendererParams<Employee>) {
  if (!params.value) return null;
  return <AccountBadge status={params.value} />;
}

function ActionsRenderer() {
  return (
    <button
      type="button"
      className="flex h-full items-center justify-center text-gray-400 transition-colors hover:text-emerald-500"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-emerald-50">
        <MoreHorizontal className="h-4 w-4" />
      </div>
    </button>
  );
}

interface EmployeeDataGridProps {
  rows: Employee[];
  isLoading?: boolean;
}

export function EmployeeDataGrid({ rows, isLoading = false }: EmployeeDataGridProps) {
  const router = useRouter();

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: "Employee Name",
        field: "name",
        minWidth: 200,
        flex: 2,
        cellRenderer: EmployeeNameRenderer,
        cellClass: "cursor-pointer",
      },
      {
        headerName: "Job Title",
        field: "jobTitle",
        minWidth: 150,
        flex: 1.5,
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
        minWidth: 140,
        flex: 1,
      },
      {
        headerName: "Office",
        field: "office",
        minWidth: 140,
        flex: 1,
      },
      {
        headerName: "Employee Status",
        field: "status",
        minWidth: 150,
        flex: 1,
        cellRenderer: StatusRenderer,
      },
      {
        headerName: "Account",
        field: "accountStatus",
        minWidth: 130,
        flex: 1,
        cellRenderer: AccountRenderer,
      },
      {
        headerName: "",
        field: "id",
        width: 60,
        maxWidth: 60,
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
      sortable: false,
      resizable: false,
    }),
    []
  );

  // AG Grid v36: rowSelection must be an object, not a string
  const rowSelection = useMemo(() => ({
    mode: "multiRow" as const,
    checkboxes: true,
    headerCheckbox: true,
  }), []);

  return (
    <div className="ag-theme-alpine w-full flex-1 min-h-[500px]">
      <AgGridReact<Employee>
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={56}
        headerHeight={48}
        rowSelection={rowSelection}
        onRowClicked={(event) => {
          if (event.data?.id) {
            router.push(`/employees/${event.data.id}`);
          }
        }}
        loading={isLoading}
        domLayout="autoHeight"
      />
    </div>
  );
}
