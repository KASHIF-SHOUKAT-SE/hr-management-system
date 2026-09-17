import { InfoField, InputField, SectionCard } from "./DetailFields";
import type { AddressDraft, EmployeeDetailRecord, ProfileData } from "./employeeDetail.types";

type GeneralTabProps = {
  employee: EmployeeDetailRecord;
  personalDraft: ProfileData;
  addressDraft: AddressDraft;
  emergencyDraft: ProfileData["emergencyContact"];
  personalEditing: boolean;
  addressEditing: boolean;
  emergencyEditing: boolean;
  onTogglePersonal: () => void;
  onToggleAddress: () => void;
  onToggleEmergency: () => void;
  onCancelPersonal: () => void;
  onCancelAddress: () => void;
  onCancelEmergency: () => void;
  onSavePersonal: () => void;
  onSaveAddress: () => void;
  onSaveEmergency: () => void;
  onEmployeeNameChange: (value: string) => void;
  onPersonalChange: (field: keyof ProfileData, value: string) => void;
  onAddressChange: (field: keyof AddressDraft, value: string) => void;
  onEmergencyChange: (field: keyof ProfileData["emergencyContact"], value: string) => void;
};

export function GeneralTab({
  employee,
  personalDraft,
  addressDraft,
  emergencyDraft,
  personalEditing,
  addressEditing,
  emergencyEditing,
  onTogglePersonal,
  onToggleAddress,
  onToggleEmergency,
  onCancelPersonal,
  onCancelAddress,
  onCancelEmergency,
  onSavePersonal,
  onSaveAddress,
  onSaveEmergency,
  onEmployeeNameChange,
  onPersonalChange,
  onAddressChange,
  onEmergencyChange,
}: GeneralTabProps) {
  return (
    <div className="mt-5 space-y-5">
      <SectionCard title="Personal Info" isEditing={personalEditing} onToggleEdit={onTogglePersonal} onCancel={onCancelPersonal} onSave={onSavePersonal}>
        {!personalEditing ? <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Full Name" value={employee.name} />
          <InfoField label="Gender" value={employee.profile?.gender ?? "Female"} />
          <InfoField label="Date of Birth" value={employee.profile?.dateOfBirth ? new Date(employee.profile.dateOfBirth).toLocaleDateString("en-GB") : "23 May 1997"} />
          <InfoField label="Marital Status" value={employee.profile?.maritalStatus ?? "Single"} />
          <InfoField label="Nationality" value={employee.profile?.nationality ?? "Indonesian"} />
          <InfoField label="Personal Tax ID" value={employee.profile?.personalTaxId || "-"} />
          <InfoField label="Email Address" value={employee.profile?.emailAddress ?? employee.email} />
          <InfoField label="Social Insurance" value={employee.profile?.socialInsurance || "-"} />
          <InfoField label="Health Insurance" value={employee.profile?.healthInsurance || "Axa Insurance"} />
          <InfoField label="Phone Number" value={employee.profile?.phoneNumber ?? employee.phoneNumber ?? "089318294893"} />
        </div> : <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Full Name" value={employee.name} onChange={onEmployeeNameChange} required />
          <InputField label="Gender" value={personalDraft.gender} onChange={(value) => onPersonalChange("gender", value)} selectOptions={["Female", "Male", "Other"]} />
          <InputField label="Date of Birth" type="date" value={personalDraft.dateOfBirth} onChange={(value) => onPersonalChange("dateOfBirth", value)} />
          <InputField label="Marital Status" value={personalDraft.maritalStatus} onChange={(value) => onPersonalChange("maritalStatus", value)} selectOptions={["Single", "Married", "Divorced"]} />
          <InputField label="Nationality" value={personalDraft.nationality} onChange={(value) => onPersonalChange("nationality", value)} />
          <InputField label="Personal Tax ID" value={personalDraft.personalTaxId} onChange={(value) => onPersonalChange("personalTaxId", value)} />
          <InputField label="Email Address" type="email" value={personalDraft.emailAddress} onChange={(value) => onPersonalChange("emailAddress", value)} required />
          <InputField label="Social Insurance" value={personalDraft.socialInsurance} onChange={(value) => onPersonalChange("socialInsurance", value)} />
          <InputField label="Health Insurance" value={personalDraft.healthInsurance} onChange={(value) => onPersonalChange("healthInsurance", value)} />
          <InputField label="Phone Number" value={personalDraft.phoneNumber} onChange={(value) => onPersonalChange("phoneNumber", value)} />
        </div>}
      </SectionCard>

      <SectionCard title="Address" isEditing={addressEditing} onToggleEdit={onToggleAddress} onCancel={onCancelAddress} onSave={onSaveAddress}>
        {!addressEditing ? <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Primary Address" value={employee.profile?.primaryAddress ?? ""} />
          <InfoField label="Country" value={employee.profile?.country ?? "Indonesia"} />
          <InfoField label="State/Province" value={employee.profile?.stateProvince ?? "Central Java"} />
          <InfoField label="City" value={employee.profile?.city ?? "Semarang"} />
          <InfoField label="Post Code" value={employee.profile?.postCode ?? "03125"} />
        </div> : <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><InputField label="Primary Address" value={addressDraft.primaryAddress} onChange={(value) => onAddressChange("primaryAddress", value)} /></div>
          <InputField label="Country" value={addressDraft.country} onChange={(value) => onAddressChange("country", value)} />
          <InputField label="State/Province" value={addressDraft.stateProvince} onChange={(value) => onAddressChange("stateProvince", value)} />
          <InputField label="City" value={addressDraft.city} onChange={(value) => onAddressChange("city", value)} />
          <InputField label="Post Code" value={addressDraft.postCode} onChange={(value) => onAddressChange("postCode", value)} />
        </div>}
      </SectionCard>

      <SectionCard title="Emergency Contact" isEditing={emergencyEditing} onToggleEdit={onToggleEmergency} onCancel={onCancelEmergency} onSave={onSaveEmergency}>
        {!emergencyEditing ? <div className="grid gap-4 sm:grid-cols-2">
          <InfoField label="Full Name" value={employee.profile?.emergencyContact?.fullName ?? "Albert Johnson"} />
          <InfoField label="Relationship" value={employee.profile?.emergencyContact?.relationship ?? "Brother"} />
          <InfoField label="Phone Number" value={employee.profile?.emergencyContact?.phoneNumber ?? "08123456789"} />
          <InfoField label="Email Address" value={employee.profile?.emergencyContact?.emailAddress ?? "albert.johnson@email.com"} />
        </div> : <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Full Name" value={emergencyDraft.fullName} onChange={(value) => onEmergencyChange("fullName", value)} required />
          <InputField label="Relationship" value={emergencyDraft.relationship} onChange={(value) => onEmergencyChange("relationship", value)} />
          <InputField label="Phone Number" value={emergencyDraft.phoneNumber} onChange={(value) => onEmergencyChange("phoneNumber", value)} />
          <InputField label="Email Address" type="email" value={emergencyDraft.emailAddress} onChange={(value) => onEmergencyChange("emailAddress", value)} />
        </div>}
      </SectionCard>
    </div>
  );
}
