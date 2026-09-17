import { InfoField, InputField, SectionCard } from "./DetailFields";
import type { EmployeeDetailRecord, JobData } from "./employeeDetail.types";

type JobTabProps = {
  employee: EmployeeDetailRecord;
  jobDraft: JobData;
  jobInfoEditing: boolean;
  contractEditing: boolean;
  onToggleJobInfo: () => void;
  onToggleContract: () => void;
  onCancelJobInfo: () => void;
  onCancelContract: () => void;
  onSaveJobInfo: () => void;
  onSaveContract: () => void;
  onJobChange: (field: keyof JobData, value: string) => void;
};

export function JobTab({ employee, jobDraft, jobInfoEditing, contractEditing, onToggleJobInfo, onToggleContract, onCancelJobInfo, onCancelContract, onSaveJobInfo, onSaveContract, onJobChange }: JobTabProps) {
  return <div className="mt-5 space-y-5">
    <SectionCard title="Employment Information" isEditing={jobInfoEditing} onToggleEdit={onToggleJobInfo} onCancel={onCancelJobInfo} onSave={onSaveJobInfo}>
      <div className="grid gap-4 sm:grid-cols-2">{jobInfoEditing ? <>
        <InputField label="Employee ID" value={jobDraft.employeeId} onChange={(value) => onJobChange("employeeId", value)} />
        <InputField label="Service Year" value={jobDraft.serviceYear} onChange={(value) => onJobChange("serviceYear", value)} />
        <InputField label="Position Type" value={jobDraft.positionType} onChange={(value) => onJobChange("positionType", value)} />
        <InputField label="Employment Type" value={jobDraft.employmentType} onChange={(value) => onJobChange("employmentType", value)} />
        <InputField label="Effective Date" type="date" value={jobDraft.effectiveDate} onChange={(value) => onJobChange("effectiveDate", value)} />
        <InputField label="Work Schedule" value={jobDraft.workSchedule} onChange={(value) => onJobChange("workSchedule", value)} />
      </> : <>
        <InfoField label="Employee ID" value={employee.job?.employeeId ?? "-"} />
        <InfoField label="Service Year" value={employee.job?.serviceYear ?? "-"} />
        <InfoField label="Position Type" value={employee.job?.positionType ?? "-"} />
        <InfoField label="Employment Type" value={employee.job?.employmentType ?? "-"} />
        <InfoField label="Effective Date" value={employee.job?.effectiveDate ?? "-"} />
        <InfoField label="Work Schedule" value={employee.job?.workSchedule ?? "-"} />
      </>}</div>
    </SectionCard>
    <SectionCard title="Contract Timeline" isEditing={contractEditing} onToggleEdit={onToggleContract} onCancel={onCancelContract} onSave={onSaveContract}>
      <div className="grid gap-4 sm:grid-cols-3">{contractEditing ? <>
        <InputField label="Contract Number" value={jobDraft.contractNumber} onChange={(value) => onJobChange("contractNumber", value)} />
        <InputField label="Contract Name" value={jobDraft.contractName} onChange={(value) => onJobChange("contractName", value)} />
        <InputField label="Contract Type" value={jobDraft.contractType} onChange={(value) => onJobChange("contractType", value)} />
      </> : <>
        <InfoField label="Contract Number" value={employee.job?.contractNumber ?? "-"} />
        <InfoField label="Contract Name" value={employee.job?.contractName ?? "-"} />
        <InfoField label="Contract Type" value={employee.job?.contractType ?? "-"} />
      </>}</div>
    </SectionCard>
  </div>;
}
