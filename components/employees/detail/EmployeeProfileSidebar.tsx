import { ChevronDown, Clock3, Mail, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { EmployeeDetailRecord } from "./employeeDetail.types";

export function EmployeeProfileSidebar({ employee }: { employee: EmployeeDetailRecord }) {
  return <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col items-center pt-3">
      <div className="mb-4"><Avatar name={employee.name} src={employee.avatarUrl} size={90} /></div>
      <h2 className="text-[28px] font-bold text-gray-900">{employee.name}</h2>
      <p className="mt-1 text-sm text-gray-500">{employee.jobTitle}</p>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />{employee.status}<ChevronDown className="h-3.5 w-3.5" /></div>
    </div>
    <div className="mt-6 space-y-3 text-sm text-gray-600">
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"><Mail className="h-4 w-4 text-gray-500" /><span>{employee.email}</span></div>
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"><Phone className="h-4 w-4 text-gray-500" /><span>{employee.phoneNumber || "089318294893"}</span></div>
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"><Clock3 className="h-4 w-4 text-gray-500" /><span>{employee.timezone || "GMT +07:00"}</span></div>
    </div>
    <div className="my-5 h-px bg-gray-200" />
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between text-gray-600"><span className="font-medium">Department</span><span className="font-semibold text-gray-900">{employee.department}</span></div>
      <div className="flex items-center justify-between text-gray-600"><span className="font-medium">Office</span><span className="font-semibold text-gray-900">{employee.office}</span></div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"><div className="flex items-center gap-2"><Avatar name={employee.lineManager} size={28} /><span className="text-gray-700">{employee.lineManager}</span></div><span className="text-xs uppercase text-gray-400">Manager</span></div>
    </div>
    <button type="button" className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#111827] px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-black"><span>Action</span><ChevronDown className="h-4 w-4" /></button>
  </aside>;
}
