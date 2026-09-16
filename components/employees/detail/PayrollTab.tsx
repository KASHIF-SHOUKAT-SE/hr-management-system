import { InfoField, InputField, SectionCard } from "./DetailFields";
import type { EmployeeDetailRecord, PayrollData } from "./employeeDetail.types";

type PayrollTabProps = {
  employee: EmployeeDetailRecord;
  payrollDraft: PayrollData;
  payrollInfoEditing: boolean;
  compensationEditing: boolean;
  onTogglePayrollInfo: () => void;
  onToggleCompensation: () => void;
  onCancelPayrollInfo: () => void;
  onCancelCompensation: () => void;
  onSavePayrollInfo: () => void;
  onSaveCompensation: () => void;
  onPayrollChange: (field: keyof PayrollData, value: string) => void;
};

export function PayrollTab({ employee, payrollDraft, payrollInfoEditing, compensationEditing, onTogglePayrollInfo, onToggleCompensation, onCancelPayrollInfo, onCancelCompensation, onSavePayrollInfo, onSaveCompensation, onPayrollChange }: PayrollTabProps) {
  return <div className="mt-5 space-y-5">
    <SectionCard title="Payroll Information" isEditing={payrollInfoEditing} onToggleEdit={onTogglePayrollInfo} onCancel={onCancelPayrollInfo} onSave={onSavePayrollInfo}>
      <div className="grid gap-4 sm:grid-cols-2">{payrollInfoEditing ? <>
        <InputField label="Employment Type" value={payrollDraft.employmentType} onChange={(value) => onPayrollChange("employmentType", value)} />
        <InputField label="Job Title" value={payrollDraft.jobTitle} onChange={(value) => onPayrollChange("jobTitle", value)} />
        <InputField label="Job Date" type="date" value={payrollDraft.jobDate} onChange={(value) => onPayrollChange("jobDate", value)} />
        <InputField label="Geofencing" value={payrollDraft.geofencing} onChange={(value) => onPayrollChange("geofencing", value)} />
        <InputField label="Last Working Date" type="date" value={payrollDraft.lastWorkingDate} onChange={(value) => onPayrollChange("lastWorkingDate", value)} />
        <InputField label="Total Compensation" value={payrollDraft.totalCompensation} onChange={(value) => onPayrollChange("totalCompensation", value)} />
      </> : <>
        <InfoField label="Employment Type" value={employee.payroll?.employmentType ?? "-"} />
        <InfoField label="Job Title" value={employee.payroll?.jobTitle ?? "-"} />
        <InfoField label="Job Date" value={employee.payroll?.jobDate ?? "-"} />
        <InfoField label="Geofencing" value={employee.payroll?.geofencing ?? "-"} />
        <InfoField label="Last Working Date" value={employee.payroll?.lastWorkingDate ?? "-"} />
        <InfoField label="Total Compensation" value={employee.payroll?.totalCompensation ?? "-"} />
      </>}</div>
    </SectionCard>
    <SectionCard title="Compensation Breakdown" isEditing={compensationEditing} onToggleEdit={onToggleCompensation} onCancel={onCancelCompensation} onSave={onSaveCompensation}>
      <div className="grid gap-4 sm:grid-cols-3">{compensationEditing ? <>
        <InputField label="Salary" value={payrollDraft.salary} onChange={(value) => onPayrollChange("salary", value)} />
        <InputField label="Recurring" value={payrollDraft.recurring} onChange={(value) => onPayrollChange("recurring", value)} />
        <InputField label="One-off" value={payrollDraft.oneOff} onChange={(value) => onPayrollChange("oneOff", value)} />
        <InputField label="Offset" value={payrollDraft.offset} onChange={(value) => onPayrollChange("offset", value)} />
      </> : <>
        <InfoField label="Salary" value={employee.payroll?.salary ?? "-"} />
        <InfoField label="Recurring" value={employee.payroll?.recurring ?? "-"} />
        <InfoField label="One-off" value={employee.payroll?.oneOff ?? "-"} />
        <InfoField label="Offset" value={employee.payroll?.offset ?? "-"} />
      </>}</div>
    </SectionCard>
  </div>;
}
