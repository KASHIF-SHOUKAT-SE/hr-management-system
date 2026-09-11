import { Button } from "@/components/ui/Button";
import { Download, Plus } from "lucide-react";

export function EmployeePageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your Employee</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Download
        </Button>
        <Button variant="dark" leftIcon={<Plus className="h-4 w-4" />}>
          Add New
        </Button>
      </div>
    </div>
  );
}
