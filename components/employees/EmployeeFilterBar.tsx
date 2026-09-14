import { Search } from "lucide-react";
import { SelectMenu } from "@/components/ui/SelectMenu";

interface FilterOption {
  label: string;
  value: string;
}

interface EmployeeFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  office: string;
  onOfficeChange: (val: string) => void;
  officeOptions: FilterOption[];
  jobTitle: string;
  onJobTitleChange: (val: string) => void;
  jobTitleOptions: FilterOption[];
  status: string;
  onStatusChange: (val: string) => void;
}

const statusOptions = [
  { label: "All Status", value: "All Status" },
  { label: "Active", value: "Active" },
  { label: "On Boarding", value: "On Boarding" },
  { label: "Probation", value: "Probation" },
  { label: "On Leave", value: "On Leave" },
];

export function EmployeeFilterBar({
  search,
  onSearchChange,
  office,
  onOfficeChange,
  officeOptions,
  jobTitle,
  onJobTitleChange,
  jobTitleOptions,
  status,
  onStatusChange,
}: EmployeeFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-t-2xl border-b border-gray-100">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search employee"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-[160px]">
          <SelectMenu
            value={office}
            options={officeOptions}
            onChange={onOfficeChange}
          />
        </div>
        <div className="w-[160px]">
          <SelectMenu
            value={jobTitle}
            options={jobTitleOptions}
            onChange={onJobTitleChange}
          />
        </div>
        <div className="w-[160px]">
          <SelectMenu
            value={status}
            options={statusOptions}
            onChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
