"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from "@/features/employees/employeesApi";
import { DocumentsTab } from "./DocumentsTab";
import { EmployeeProfileSidebar } from "./EmployeeProfileSidebar";
import { GeneralTab } from "./GeneralTab";
import { JobTab } from "./JobTab";
import { PayrollTab } from "./PayrollTab";
import { SettingTab } from "./SettingTab";
import type { AddressDraft, EmployeeDetailRecord, EmployeeDocument, JobData, PayrollData, ProfileData, SaveCardType } from "./employeeDetail.types";

type EmployeeDetailApiData = Omit<Partial<EmployeeDetailRecord>, "job" | "payroll"> & {
  job?: Record<string, string>;
  payroll?: Record<string, string>;
};

const fallbackEmployee: EmployeeDetailRecord = {
  id: "demo-employee-1", name: "Pristia Candra", email: "lincol@gmail.com", avatarUrl: "", jobTitle: "3D Designer", lineManager: "Skylar Calzoni", department: "Designer", office: "Unpixel Studio", status: "active", accountStatus: "activated", phoneNumber: "089318294893", timezone: "GMT +07:00", calendarVisibility: "Everyone", joinDate: "2025-03-12T00:00:00.000Z",
  profile: { gender: "Female", dateOfBirth: "1997-03-29", maritalStatus: "Single", nationality: "Indonesian", personalTaxId: "", emailAddress: "lincol@gmail.com", socialInsurance: "", healthInsurance: "Axa Insurance", phoneNumber: "089318294893", primaryAddress: "Banyumanik Street, Central Java, Semarang Indonesia", country: "Indonesia", stateProvince: "Central Java", city: "Semarang", postCode: "03125", emergencyContact: { fullName: "Albert Johnson", relationship: "Brother", phoneNumber: "08123456789", emailAddress: "albert.johnson@email.com" } },
  job: { employeeId: "UN1203", serviceYear: "3 Years 7 Months", positionType: "-", employmentType: "Fulltime", contractNumber: "#12345", contractName: "Fulltime Remote", contractType: "Fulltime Remote", effectiveDate: "2019-08-20", workSchedule: "Monday - Friday, 09:00 - 18:00" },
  payroll: { employmentType: "Contractor", jobTitle: "Junior UI/UX Designer", jobDate: "2020-02-16", geofencing: "30 Sep 2024", lastWorkingDate: "", totalCompensation: "$ 3,729.00", salary: "", recurring: "$ 0", oneOff: "$ 0", offset: "" },
};

const initialDocuments: EmployeeDocument[] = [
  { id: "cv-lincoln", name: "CV_lincoln_v1.pdf", category: "Personal Documents", url: "data:text/plain;charset=utf-8,Employee%20document%20preview" },
  { id: "payslip-august", name: "Payslips_20_Aug.pdf", category: "Payslips", url: "data:text/plain;charset=utf-8,Payslip%20August%20preview" },
  { id: "payslip-october", name: "Payslips_20_Oct.pdf", category: "Payslips", url: "data:text/plain;charset=utf-8,Payslip%20October%20preview" },
];

function toDetailRecord(data: EmployeeDetailApiData | undefined): EmployeeDetailRecord {
  const profile = data?.profile ?? fallbackEmployee.profile!;
  return {
    ...fallbackEmployee,
    ...data,
    calendarVisibility: data?.calendarVisibility ?? fallbackEmployee.calendarVisibility,
    profile: { ...fallbackEmployee.profile, ...profile, emergencyContact: { ...fallbackEmployee.profile!.emergencyContact, ...(profile.emergencyContact ?? {}) } },
    job: { ...fallbackEmployee.job!, ...(data?.job ?? {}) } as unknown as JobData,
    payroll: { ...fallbackEmployee.payroll!, ...(data?.payroll ?? {}) } as unknown as PayrollData,
    documents: data?.documents ?? initialDocuments,
  };
}

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employeeId = params?.id ?? "demo-employee-1";
  const { data, isLoading } = useGetEmployeeByIdQuery(employeeId);
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [employee, setEmployee] = useState<EmployeeDetailRecord>(fallbackEmployee);
  const [saveError, setSaveError] = useState("");
  const [personalEditing, setPersonalEditing] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);
  const [emergencyEditing, setEmergencyEditing] = useState(false);
  const [jobInfoEditing, setJobInfoEditing] = useState(false);
  const [contractEditing, setContractEditing] = useState(false);
  const [payrollInfoEditing, setPayrollInfoEditing] = useState(false);
  const [compensationEditing, setCompensationEditing] = useState(false);
  const [accountSettingsEditing, setAccountSettingsEditing] = useState(false);
  const [privacyEditing, setPrivacyEditing] = useState(false);
  const [jobDraft, setJobDraft] = useState<JobData>(fallbackEmployee.job!);
  const [payrollDraft, setPayrollDraft] = useState<PayrollData>(fallbackEmployee.payroll!);
  const [timezoneDraft, setTimezoneDraft] = useState(fallbackEmployee.timezone ?? "GMT +07:00");
  const [calendarVisibilityDraft, setCalendarVisibilityDraft] = useState<"Everyone" | "Only me">("Everyone");
  const [documents, setDocuments] = useState<EmployeeDocument[]>(initialDocuments);
  const [personalDraft, setPersonalDraft] = useState<ProfileData>(fallbackEmployee.profile!);
  const [addressDraft, setAddressDraft] = useState<AddressDraft>({ primaryAddress: fallbackEmployee.profile!.primaryAddress, country: fallbackEmployee.profile!.country, stateProvince: fallbackEmployee.profile!.stateProvince, city: fallbackEmployee.profile!.city, postCode: fallbackEmployee.profile!.postCode });
  const [emergencyDraft, setEmergencyDraft] = useState(fallbackEmployee.profile!.emergencyContact);
  const tabs = useMemo(() => ["General", "Job", "Payroll", "Documents", "Setting"], []);
  const [activeTab, setActiveTab] = useState("General");

  useEffect(() => {
    if (!data) return;
    const resolved = toDetailRecord(data as EmployeeDetailApiData);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmployee(resolved);
    setPersonalDraft({ ...resolved.profile! });
    setAddressDraft({ primaryAddress: resolved.profile!.primaryAddress, country: resolved.profile!.country, stateProvince: resolved.profile!.stateProvince, city: resolved.profile!.city, postCode: resolved.profile!.postCode });
    setEmergencyDraft({ ...resolved.profile!.emergencyContact });
    setJobDraft({ ...resolved.job! });
    setPayrollDraft({ ...resolved.payroll! });
    setTimezoneDraft(resolved.timezone ?? "GMT +07:00");
    setCalendarVisibilityDraft(resolved.calendarVisibility ?? "Everyone");
    setDocuments(resolved.documents ?? []);
  }, [data]);

  const updatePersonalDraft = (field: keyof ProfileData, value: string) => setPersonalDraft((current) => ({ ...current, [field]: value }));
  const updateAddressDraft = (field: keyof AddressDraft, value: string) => setAddressDraft((current) => ({ ...current, [field]: value }));
  const updateEmergencyDraft = (field: keyof ProfileData["emergencyContact"], value: string) => setEmergencyDraft((current) => ({ ...current, [field]: value }));
  const updateJobDraft = (field: keyof JobData, value: string) => setJobDraft((current) => ({ ...current, [field]: value }));
  const updatePayrollDraft = (field: keyof PayrollData, value: string) => setPayrollDraft((current) => ({ ...current, [field]: value }));

  const syncResolvedEmployee = (resolved: EmployeeDetailRecord) => {
    setEmployee(resolved);
    setPersonalDraft({ ...resolved.profile! });
    setAddressDraft({ primaryAddress: resolved.profile!.primaryAddress, country: resolved.profile!.country, stateProvince: resolved.profile!.stateProvince, city: resolved.profile!.city, postCode: resolved.profile!.postCode });
    setEmergencyDraft({ ...resolved.profile!.emergencyContact });
    setJobDraft({ ...resolved.job! });
    setPayrollDraft({ ...resolved.payroll! });
    setTimezoneDraft(resolved.timezone ?? "GMT +07:00");
    setCalendarVisibilityDraft(resolved.calendarVisibility ?? "Everyone");
  };

  const handleDocumentUpload = async (category: EmployeeDocument["category"], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
    const nextDocuments = [...documents, { id: `${file.name}-${file.lastModified}`, name: file.name, category, url }];
    try { const response = await updateEmployee({ id: employeeId, employee: { documents: nextDocuments } }).unwrap(); setDocuments(response.documents ?? nextDocuments); } catch (error) { setSaveError(error instanceof Error ? error.message : "Unable to upload document."); }
    event.target.value = "";
  };

  const removeDocument = async (documentId: string) => {
    const nextDocuments = documents.filter((document) => document.id !== documentId);
    try { const response = await updateEmployee({ id: employeeId, employee: { documents: nextDocuments } }).unwrap(); setDocuments(response.documents ?? nextDocuments); } catch (error) { setSaveError(error instanceof Error ? error.message : "Unable to remove document."); }
  };

  const handleCardSave = async (type: SaveCardType, nextProfile: Partial<ProfileData> = {}) => {
    setSaveError("");
    try {
      const profileChanges = type === "address" ? addressDraft : type === "emergency" ? { emergencyContact: { ...emergencyDraft } } : nextProfile;
      const updatedEmployee = { ...employee, name: employee.name, email: employee.email, phoneNumber: nextProfile.phoneNumber ?? employee.phoneNumber ?? "", profile: { ...employee.profile, ...profileChanges }, job: type === "jobInfo" || type === "contract" ? jobDraft : employee.job, payroll: type === "payrollInfo" || type === "compensation" ? payrollDraft : employee.payroll, timezone: type === "accountSettings" ? timezoneDraft : employee.timezone, calendarVisibility: type === "privacy" ? calendarVisibilityDraft : employee.calendarVisibility };
      const response = await updateEmployee({ id: employeeId, employee: updatedEmployee }).unwrap();
      const responseData = response as unknown as EmployeeDetailApiData;
      syncResolvedEmployee(toDetailRecord({ ...responseData, payroll: type === "payrollInfo" || type === "compensation" ? payrollDraft : responseData.payroll, timezone: type === "accountSettings" ? timezoneDraft : responseData.timezone, calendarVisibility: type === "privacy" ? calendarVisibilityDraft : responseData.calendarVisibility }));
      if (type === "personal") setPersonalEditing(false);
      if (type === "address") setAddressEditing(false);
      if (type === "emergency") setEmergencyEditing(false);
      if (type === "jobInfo") setJobInfoEditing(false);
      if (type === "contract") setContractEditing(false);
      if (type === "payrollInfo") setPayrollInfoEditing(false);
      if (type === "compensation") setCompensationEditing(false);
      if (type === "accountSettings") setAccountSettingsEditing(false);
      if (type === "privacy") setPrivacyEditing(false);
    } catch (error) { console.error("Failed to update employee:", error); setSaveError(error instanceof Error ? error.message : "Unable to save employee details."); }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 p-6"><div className="mx-auto max-w-7xl animate-pulse rounded-2xl bg-white p-8 text-gray-500">Loading employee details...</div></div>;

  return <div className="min-h-screen bg-gray-50 p-4 sm:p-6"><div className="mx-auto max-w-7xl">
    <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900"><span className="text-gray-400">&lt;</span><span>Detail Employee</span></div>
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <EmployeeProfileSidebar employee={employee} />
      <main className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`relative px-4 py-2 text-sm font-medium transition ${activeTab === tab ? "text-[#219653]" : "text-gray-500 hover:text-gray-700"}`}>{tab}{activeTab === tab && <span className="absolute inset-x-2 -bottom-2.75 h-0.5 rounded-full bg-[#219653]" />}</button>)}</div>
        {saveError && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p>}
        {activeTab === "General" && <GeneralTab employee={employee} personalDraft={personalDraft} addressDraft={addressDraft} emergencyDraft={emergencyDraft} personalEditing={personalEditing} addressEditing={addressEditing} emergencyEditing={emergencyEditing} onTogglePersonal={() => setPersonalEditing((current) => !current)} onToggleAddress={() => setAddressEditing((current) => !current)} onToggleEmergency={() => setEmergencyEditing((current) => !current)} onCancelPersonal={() => { setPersonalDraft({ ...employee.profile! }); setPersonalEditing(false); }} onCancelAddress={() => { setAddressDraft({ primaryAddress: employee.profile!.primaryAddress, country: employee.profile!.country, stateProvince: employee.profile!.stateProvince, city: employee.profile!.city, postCode: employee.profile!.postCode }); setAddressEditing(false); }} onCancelEmergency={() => { setEmergencyDraft({ ...employee.profile!.emergencyContact }); setEmergencyEditing(false); }} onSavePersonal={() => handleCardSave("personal", personalDraft)} onSaveAddress={() => handleCardSave("address", { ...personalDraft, ...addressDraft })} onSaveEmergency={() => handleCardSave("emergency", { ...personalDraft, emergencyContact: emergencyDraft })} onEmployeeNameChange={(value) => setEmployee((current) => ({ ...current, name: value }))} onPersonalChange={updatePersonalDraft} onAddressChange={updateAddressDraft} onEmergencyChange={updateEmergencyDraft} />}
        {activeTab === "Job" && <JobTab employee={employee} jobDraft={jobDraft} jobInfoEditing={jobInfoEditing} contractEditing={contractEditing} onToggleJobInfo={() => setJobInfoEditing((current) => !current)} onToggleContract={() => setContractEditing((current) => !current)} onCancelJobInfo={() => { setJobDraft({ ...employee.job! }); setJobInfoEditing(false); }} onCancelContract={() => setContractEditing(false)} onSaveJobInfo={() => handleCardSave("jobInfo")} onSaveContract={() => handleCardSave("contract")} onJobChange={updateJobDraft} />}
        {activeTab === "Payroll" && <PayrollTab employee={employee} payrollDraft={payrollDraft} payrollInfoEditing={payrollInfoEditing} compensationEditing={compensationEditing} onTogglePayrollInfo={() => setPayrollInfoEditing((current) => !current)} onToggleCompensation={() => setCompensationEditing((current) => !current)} onCancelPayrollInfo={() => { setPayrollDraft({ ...employee.payroll! }); setPayrollInfoEditing(false); }} onCancelCompensation={() => setCompensationEditing(false)} onSavePayrollInfo={() => handleCardSave("payrollInfo")} onSaveCompensation={() => handleCardSave("compensation")} onPayrollChange={updatePayrollDraft} />}
        {activeTab === "Documents" && <DocumentsTab documents={documents} onUpload={handleDocumentUpload} onRemove={removeDocument} />}
        {activeTab === "Setting" && <SettingTab timezone={timezoneDraft} calendarVisibility={calendarVisibilityDraft} accountSettingsEditing={accountSettingsEditing} privacyEditing={privacyEditing} onTimezoneChange={setTimezoneDraft} onCalendarVisibilityChange={setCalendarVisibilityDraft} onToggleAccountSettings={() => setAccountSettingsEditing((current) => !current)} onTogglePrivacy={() => setPrivacyEditing((current) => !current)} onCancelAccountSettings={() => { setTimezoneDraft(employee.timezone ?? "GMT +07:00"); setAccountSettingsEditing(false); }} onCancelPrivacy={() => { setCalendarVisibilityDraft(employee.calendarVisibility ?? "Everyone"); setPrivacyEditing(false); }} onSaveAccountSettings={() => handleCardSave("accountSettings")} onSavePrivacy={() => handleCardSave("privacy")} />}
      </main>
    </div>
  </div></div>;
}
