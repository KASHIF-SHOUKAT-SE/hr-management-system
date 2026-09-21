"use client";

import { Mail, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { DirectoryEmployee } from "@/features/employees/directoryData";

interface EmployeeDirectoryProps {
  employees: DirectoryEmployee[];
}

export function EmployeeDirectory({ employees }: EmployeeDirectoryProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {employees.map((employee) => (
        <article
          key={employee.id}
          className="flex min-h-54 flex-col items-center rounded-xl border border-gray-100 bg-white px-5 py-6 text-center shadow-[0_3px_18px_rgba(17,24,39,0.04)] transition-shadow hover:shadow-[0_8px_28px_rgba(17,24,39,0.08)]"
        >
          <Avatar
            name={employee.name}
            src={employee.avatarUrl}
            size={52}
            className="mb-3 ring-4 ring-gray-50"
          />
          <h2 className="text-sm font-semibold text-gray-900">{employee.name}</h2>
          <p className="mt-1 text-xs text-gray-400">{employee.jobTitle}</p>

          <div className="mt-5 w-full border-t border-gray-100 pt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="max-w-[calc(100%-24px)] truncate">{employee.email}</span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span>{employee.phone}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}









