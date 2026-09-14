"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from "@/features/employees/employeesApi";

type ProfileData = {
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  personalTaxId: string;
  emailAddress: string;
  socialInsurance: string;
  healthInsurance: string;
  phoneNumber: string;
  primaryAddress: string;
  country: string;
  stateProvince: string;
  city: string;
  postCode: string;
  emergencyContact: {
    fullName: string;
    relationship: string;
    phoneNumber: string;
    emailAddress: string;
  };
};

type EmployeeDetailRecord = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  jobTitle: string;
  lineManager: string;
  department: string;
  office: string;
  status: "active" | "onboarding" | "probation" | "on-leave" | "terminated";
  accountStatus: "activated" | "need-invitation";
  phoneNumber?: string;
  timezone?: string;
  calendarVisibility?: "Everyone" | "Only me";
  joinDate?: string;
  profile?: ProfileData;
  job?: JobData;
  payroll?: PayrollData;
  documents?: EmployeeDocument[];
};

type JobData = {
  employeeId: string;
  serviceYear: string;
  positionType: string;
  employmentType: string;
  contractNumber: string;
  contractName: string;
  contractType: string;
  effectiveDate: string;
  workSchedule: string;
};

type PayrollData = {
  employmentType: string;
  jobTitle: string;
  jobDate: string;
  geofencing: string;
  lastWorkingDate: string;
  totalCompensation: string;
  salary: string;
  recurring: string;
  oneOff: string;
  offset: string;
};

type EmployeeDocument = {
  id: string;
  name: string;
  category: "Personal Documents" | "Payslips";
  url: string;
};

const fallbackEmployee: EmployeeDetailRecord = {
  id: "demo-employee-1",
  name: "Pristia Candra",
  email: "lincol@gmail.com",
  avatarUrl: "",
  jobTitle: "3D Designer",
  lineManager: "Skylar Calzoni",
  department: "Designer",
  office: "Unpixel Studio",
  status: "active",
  accountStatus: "activated",
  phoneNumber: "089318294893",
  timezone: "GMT +07:00",
  calendarVisibility: "Everyone",
  joinDate: "2025-03-12T00:00:00.000Z",
  profile: {
    gender: "Female",
    dateOfBirth: "1997-03-29",
    maritalStatus: "Single",
    nationality: "Indonesian",
    personalTaxId: "",
    emailAddress: "lincol@gmail.com",
    socialInsurance: "",
    healthInsurance: "Axa Insurance",
    phoneNumber: "089318294893",
    primaryAddress: "Banyumanik Street, Central Java, Semarang Indonesia",
    country: "Indonesia",
    stateProvince: "Central Java",
    city: "Semarang",
    postCode: "03125",
    emergencyContact: {
      fullName: "Albert Johnson",
      relationship: "Brother",
      phoneNumber: "08123456789",
      emailAddress: "albert.johnson@email.com",
    },
  },
  job: {
    employeeId: "UN1203",
    serviceYear: "3 Years 7 Months",
    positionType: "-",
    employmentType: "Fulltime",
    contractNumber: "#12345",
    contractName: "Fulltime Remote",
    contractType: "Fulltime Remote",
    effectiveDate: "2019-08-20",
    workSchedule: "Monday - Friday, 09:00 - 18:00",
  },
  payroll: {
    employmentType: "Contractor",
    jobTitle: "Junior UI/UX Designer",
    jobDate: "2020-02-16",
    geofencing: "30 Sep 2024",
    lastWorkingDate: "",
    totalCompensation: "$ 3,729.00",
    salary: "",
    recurring: "$ 0",
    oneOff: "$ 0",
    offset: "",
  },
};

const initialDocuments: EmployeeDocument[] = [
  {
    id: "cv-lincoln",
    name: "CV_lincoln_v1.pdf",
    category: "Personal Documents",
    url: "data:text/plain;charset=utf-8,Employee%20document%20preview",
  },
  {
    id: "payslip-august",
    name: "Payslips_20_Aug.pdf",
    category: "Payslips",
    url: "data:text/plain;charset=utf-8,Payslip%20August%20preview",
  },
  {
    id: "payslip-october",
    name: "Payslips_20_Oct.pdf",
    category: "Payslips",
    url: "data:text/plain;charset=utf-8,Payslip%20October%20preview",
  },
];

const labelClass = "text-[11px] font-medium text-gray-500";
const valueClass = "text-sm font-medium text-gray-900";

function toDetailRecord(data: Partial<EmployeeDetailRecord> | undefined): EmployeeDetailRecord {
  const profile = data?.profile ?? fallbackEmployee.profile!;
  return {
    ...fallbackEmployee,
    ...data,
    calendarVisibility: data?.calendarVisibility ?? fallbackEmployee.calendarVisibility,
    profile: {
      ...fallbackEmployee.profile,
      ...profile,
      emergencyContact: {
        ...fallbackEmployee.profile!.emergencyContact,
        ...(profile?.emergencyContact ?? {}),
      },
    },
    job: { ...fallbackEmployee.job, ...(data?.job ?? {}) },
    payroll: { ...fallbackEmployee.payroll, ...(data?.payroll ?? {}) },
    documents: data?.documents ?? initialDocuments,
  };
}

function SectionCard({
  title,
  children,
  isEditing,
  onToggleEdit,
  onSave,
  onCancel,
}: {
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onToggleEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-emerald-200 hover:text-emerald-600"
          aria-label={isEditing ? "Cancel edit" : `Edit ${title}`}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </button>
      </div>

      <div className="p-5">{children}</div>

      {isEditing && (
        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-[#219653] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d8650]"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className={labelClass}>{label}</div>
      <div className={valueClass}>{value || "-"}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  selectOptions,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  selectOptions?: string[];
}) {
  const inputClassName =
    "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#219653] focus:ring-2 focus:ring-[#219653]/10";

  return (
    <label className="space-y-1.5">
      <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {selectOptions ? (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClassName}>
          {selectOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
      )}
    </label>
  );
}

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employeeId = params?.id ?? "demo-employee-1";
  const { data, isLoading } = useGetEmployeeByIdQuery(employeeId);
  const [updateEmployee] = useUpdateEmployeeMutation();

  const [employee, setEmployee] = useState<EmployeeDetailRecord>(fallbackEmployee);
  const [isSaving, setIsSaving] = useState(false);
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
  const [addressDraft, setAddressDraft] = useState<Pick<ProfileData, "primaryAddress" | "country" | "stateProvince" | "city" | "postCode">>({
    primaryAddress: fallbackEmployee.profile!.primaryAddress,
    country: fallbackEmployee.profile!.country,
    stateProvince: fallbackEmployee.profile!.stateProvince,
    city: fallbackEmployee.profile!.city,
    postCode: fallbackEmployee.profile!.postCode,
  });
  const [emergencyDraft, setEmergencyDraft] = useState(fallbackEmployee.profile!.emergencyContact);

  useEffect(() => {
    if (data) {
      const resolved = toDetailRecord(data as Partial<EmployeeDetailRecord>);
      setEmployee(resolved);
      setPersonalDraft({ ...resolved.profile! });
      setAddressDraft({
        primaryAddress: resolved.profile!.primaryAddress,
        country: resolved.profile!.country,
        stateProvince: resolved.profile!.stateProvince,
        city: resolved.profile!.city,
        postCode: resolved.profile!.postCode,
      });
      setEmergencyDraft({ ...resolved.profile!.emergencyContact });
      setJobDraft({ ...resolved.job! });
      setPayrollDraft({ ...resolved.payroll! });
      setTimezoneDraft(resolved.timezone ?? "GMT +07:00");
      setCalendarVisibilityDraft(resolved.calendarVisibility ?? "Everyone");
      setDocuments(resolved.documents ?? []);
    }
  }, [data]);

  const tabs = useMemo(() => ["General", "Job", "Payroll", "Documents", "Setting"], []);
  const [activeTab, setActiveTab] = useState("General");

  const statusColor = employee.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";

  const updateDraft = (field: keyof ProfileData, value: string) => {
    setPersonalDraft((current) => ({ ...current, [field]: value }));
  };

  const updateAddressDraft = (field: keyof typeof addressDraft, value: string) => {
    setAddressDraft((current) => ({ ...current, [field]: value }));
  };

  const updateEmergencyDraft = (field: keyof typeof emergencyDraft, value: string) => {
    setEmergencyDraft((current) => ({ ...current, [field]: value }));
  };

  const updateJobDraft = (field: keyof JobData, value: string) => {
    setJobDraft((current) => ({ ...current, [field]: value }));
  };

  const updatePayrollDraft = (field: keyof PayrollData, value: string) => {
    setPayrollDraft((current) => ({ ...current, [field]: value }));
  };

  const handleDocumentUpload = async (category: EmployeeDocument["category"], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const nextDocuments = [...documents, { id: `${file.name}-${file.lastModified}`, name: file.name, category, url }];
    try {
      const response = await updateEmployee({ id: employeeId, employee: { documents: nextDocuments } }).unwrap();
      setDocuments(response.documents ?? nextDocuments);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to upload document.");
    }
    event.target.value = "";
  };

  const removeDocument = async (documentId: string) => {
    const nextDocuments = documents.filter((document) => document.id !== documentId);
    try {
      const response = await updateEmployee({ id: employeeId, employee: { documents: nextDocuments } }).unwrap();
      setDocuments(response.documents ?? nextDocuments);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to remove document.");
    }
  };

  const handleCardSave = async (
    type: "personal" | "address" | "emergency" | "jobInfo" | "contract" | "payrollInfo" | "compensation" | "accountSettings" | "privacy",
    nextProfile: Partial<ProfileData> = {}
  ) => {
    setIsSaving(true);
    setSaveError("");

    try {
      const profileChanges =
        type === "address"
          ? {
              primaryAddress: addressDraft.primaryAddress,
              country: addressDraft.country,
              stateProvince: addressDraft.stateProvince,
              city: addressDraft.city,
              postCode: addressDraft.postCode,
            }
          : type === "emergency"
            ? { emergencyContact: { ...emergencyDraft } }
            : nextProfile;
      const updatedEmployee = {
        ...employee,
        name: employee.name,
        email: employee.email,
        phoneNumber: nextProfile.phoneNumber ?? employee.phoneNumber ?? "",
        profile: {
          ...employee.profile,
          ...profileChanges,
        },
        job: type === "jobInfo" || type === "contract" ? jobDraft : employee.job,
        payroll: type === "payrollInfo" || type === "compensation" ? payrollDraft : employee.payroll,
        timezone: type === "accountSettings" ? timezoneDraft : employee.timezone,
        calendarVisibility: type === "privacy" ? calendarVisibilityDraft : employee.calendarVisibility,
      };

      const response = await updateEmployee({ id: employeeId, employee: updatedEmployee }).unwrap();
      const resolved = toDetailRecord({
        ...(response as Partial<EmployeeDetailRecord>),
        payroll: type === "payrollInfo" || type === "compensation" ? payrollDraft : response.payroll,
        timezone: type === "accountSettings" ? timezoneDraft : response.timezone,
        calendarVisibility: type === "privacy" ? calendarVisibilityDraft : response.calendarVisibility,
      });
      setEmployee(resolved);
      setPersonalDraft({ ...resolved.profile! });
      setAddressDraft({
        primaryAddress: resolved.profile!.primaryAddress,
        country: resolved.profile!.country,
        stateProvince: resolved.profile!.stateProvince,
        city: resolved.profile!.city,
        postCode: resolved.profile!.postCode,
      });
      setEmergencyDraft({ ...resolved.profile!.emergencyContact });
      setJobDraft({ ...resolved.job! });
      setPayrollDraft({ ...resolved.payroll! });
      setTimezoneDraft(resolved.timezone ?? "GMT +07:00");
      setCalendarVisibilityDraft(resolved.calendarVisibility ?? "Everyone");

      if (type === "personal") setPersonalEditing(false);
      if (type === "address") setAddressEditing(false);
      if (type === "emergency") setEmergencyEditing(false);
      if (type === "jobInfo") setJobInfoEditing(false);
      if (type === "contract") setContractEditing(false);
      if (type === "payrollInfo") setPayrollInfoEditing(false);
      if (type === "compensation") setCompensationEditing(false);
      if (type === "accountSettings") setAccountSettingsEditing(false);
      if (type === "privacy") setPrivacyEditing(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
      setSaveError(error instanceof Error ? error.message : "Unable to save employee details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl animate-pulse rounded-2xl bg-white p-8 text-gray-500">Loading employee details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <span className="text-gray-400">&lt;</span>
          <span>Detail Employee</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col items-center pt-3">
              <div className="mb-4">
                <Avatar name={employee.name} src={employee.avatarUrl} size={90} />
              </div>
              <h2 className="text-[28px] font-bold text-gray-900">{employee.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{employee.jobTitle}</p>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                {employee.status}
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{employee.phoneNumber || "089318294893"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                <Clock3 className="h-4 w-4 text-gray-500" />
                <span>{employee.timezone || "GMT +07:00"}</span>
              </div>
            </div>

            <div className="my-5 h-px bg-gray-200" />

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-medium">Department</span>
                <span className="font-semibold text-gray-900">{employee.department}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-medium">Office</span>
                <span className="font-semibold text-gray-900">{employee.office}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Avatar name={employee.lineManager} size={28} />
                  <span className="text-gray-700">{employee.lineManager}</span>
                </div>
                <span className="text-xs uppercase text-gray-400">Manager</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#111827] px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-black"
            >
              <span>Action</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </aside>

          <main className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab ? "text-[#219653]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute inset-x-2 -bottom-2.75 h-0.5 rounded-full bg-[#219653]" />}
                </button>
              ))}
            </div>

            {saveError && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </p>
            )}

            {activeTab === "General" && (
              <div className="mt-5 space-y-5">
                <SectionCard
                  title="Personal Info"
                  isEditing={personalEditing}
                  onToggleEdit={() => setPersonalEditing((current) => !current)}
                  onCancel={() => {
                    setPersonalDraft({ ...employee.profile! });
                    setPersonalEditing(false);
                  }}
                  onSave={() => handleCardSave("personal", personalDraft)}
                >
                  {!personalEditing ? (
                    <div className="grid gap-4 sm:grid-cols-2">
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
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField label="Full Name" value={employee.name} onChange={(value) => setEmployee((current) => ({ ...current, name: value }))} required />
                      <InputField label="Gender" value={personalDraft.gender} onChange={(value) => updateDraft("gender", value)} selectOptions={["Female", "Male", "Other"]} />
                      <InputField label="Date of Birth" type="date" value={personalDraft.dateOfBirth} onChange={(value) => updateDraft("dateOfBirth", value)} />
                      <InputField label="Marital Status" value={personalDraft.maritalStatus} onChange={(value) => updateDraft("maritalStatus", value)} selectOptions={["Single", "Married", "Divorced"]} />
                      <InputField label="Nationality" value={personalDraft.nationality} onChange={(value) => updateDraft("nationality", value)} />
                      <InputField label="Personal Tax ID" value={personalDraft.personalTaxId} onChange={(value) => updateDraft("personalTaxId", value)} />
                      <InputField label="Email Address" type="email" value={personalDraft.emailAddress} onChange={(value) => updateDraft("emailAddress", value)} required />
                      <InputField label="Social Insurance" value={personalDraft.socialInsurance} onChange={(value) => updateDraft("socialInsurance", value)} />
                      <InputField label="Health Insurance" value={personalDraft.healthInsurance} onChange={(value) => updateDraft("healthInsurance", value)} />
                      <InputField label="Phone Number" value={personalDraft.phoneNumber} onChange={(value) => updateDraft("phoneNumber", value)} />
                    </div>
                  )}
                </SectionCard>

                <SectionCard
                  title="Address"
                  isEditing={addressEditing}
                  onToggleEdit={() => setAddressEditing((current) => !current)}
                  onCancel={() => {
                    setAddressDraft({
                      primaryAddress: employee.profile!.primaryAddress,
                      country: employee.profile!.country,
                      stateProvince: employee.profile!.stateProvince,
                      city: employee.profile!.city,
                      postCode: employee.profile!.postCode,
                    });
                    setAddressEditing(false);
                  }}
                  onSave={() => handleCardSave("address", {
                    ...personalDraft,
                    primaryAddress: addressDraft.primaryAddress,
                    country: addressDraft.country,
                    stateProvince: addressDraft.stateProvince,
                    city: addressDraft.city,
                    postCode: addressDraft.postCode,
                  })}
                >
                  {!addressEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InfoField label="Primary Address" value={employee.profile?.primaryAddress ?? ""} />
                        <InfoField label="Country" value={employee.profile?.country ?? "Indonesia"} />
                        <InfoField label="State/Province" value={employee.profile?.stateProvince ?? "Central Java"} />
                        <InfoField label="City" value={employee.profile?.city ?? "Semarang"} />
                        <InfoField label="Post Code" value={employee.profile?.postCode ?? "03125"} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <InputField label="Primary Address" value={addressDraft.primaryAddress} onChange={(value) => updateAddressDraft("primaryAddress", value)} />
                      </div>
                      <InputField label="Country" value={addressDraft.country} onChange={(value) => updateAddressDraft("country", value)} />
                      <InputField label="State/Province" value={addressDraft.stateProvince} onChange={(value) => updateAddressDraft("stateProvince", value)} />
                      <InputField label="City" value={addressDraft.city} onChange={(value) => updateAddressDraft("city", value)} />
                      <InputField label="Post Code" value={addressDraft.postCode} onChange={(value) => updateAddressDraft("postCode", value)} />
                    </div>
                  )}
                </SectionCard>

                <SectionCard
                  title="Emergency Contact"
                  isEditing={emergencyEditing}
                  onToggleEdit={() => setEmergencyEditing((current) => !current)}
                  onCancel={() => {
                    setEmergencyDraft({ ...employee.profile!.emergencyContact });
                    setEmergencyEditing(false);
                  }}
                  onSave={() => handleCardSave("emergency", {
                    ...personalDraft,
                    emergencyContact: emergencyDraft,
                  })}
                >
                  {!emergencyEditing ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoField label="Full Name" value={employee.profile?.emergencyContact?.fullName ?? "Albert Johnson"} />
                      <InfoField label="Relationship" value={employee.profile?.emergencyContact?.relationship ?? "Brother"} />
                      <InfoField label="Phone Number" value={employee.profile?.emergencyContact?.phoneNumber ?? "08123456789"} />
                      <InfoField label="Email Address" value={employee.profile?.emergencyContact?.emailAddress ?? "albert.johnson@email.com"} />
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField label="Full Name" value={emergencyDraft.fullName} onChange={(value) => updateEmergencyDraft("fullName", value)} required />
                      <InputField label="Relationship" value={emergencyDraft.relationship} onChange={(value) => updateEmergencyDraft("relationship", value)} />
                      <InputField label="Phone Number" value={emergencyDraft.phoneNumber} onChange={(value) => updateEmergencyDraft("phoneNumber", value)} />
                      <InputField label="Email Address" type="email" value={emergencyDraft.emailAddress} onChange={(value) => updateEmergencyDraft("emailAddress", value)} />
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {activeTab === "Job" && (
              <div className="mt-5 space-y-5">
                <SectionCard
                  title="Employment Information"
                  isEditing={jobInfoEditing}
                  onToggleEdit={() => setJobInfoEditing((current) => !current)}
                  onCancel={() => {
                    setJobDraft({ ...employee.job! });
                    setJobInfoEditing(false);
                  }}
                  onSave={() => handleCardSave("jobInfo")}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {jobInfoEditing ? (
                      <>
                        <InputField label="Employee ID" value={jobDraft.employeeId} onChange={(value) => updateJobDraft("employeeId", value)} />
                        <InputField label="Service Year" value={jobDraft.serviceYear} onChange={(value) => updateJobDraft("serviceYear", value)} />
                        <InputField label="Position Type" value={jobDraft.positionType} onChange={(value) => updateJobDraft("positionType", value)} />
                        <InputField label="Employment Type" value={jobDraft.employmentType} onChange={(value) => updateJobDraft("employmentType", value)} />
                        <InputField label="Effective Date" type="date" value={jobDraft.effectiveDate} onChange={(value) => updateJobDraft("effectiveDate", value)} />
                        <InputField label="Work Schedule" value={jobDraft.workSchedule} onChange={(value) => updateJobDraft("workSchedule", value)} />
                      </>
                    ) : (
                      <>
                        <InfoField label="Employee ID" value={employee.job?.employeeId ?? "-"} />
                        <InfoField label="Service Year" value={employee.job?.serviceYear ?? "-"} />
                        <InfoField label="Position Type" value={employee.job?.positionType ?? "-"} />
                        <InfoField label="Employment Type" value={employee.job?.employmentType ?? "-"} />
                        <InfoField label="Effective Date" value={employee.job?.effectiveDate ?? "-"} />
                        <InfoField label="Work Schedule" value={employee.job?.workSchedule ?? "-"} />
                      </>
                    )}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Contract Timeline"
                  isEditing={contractEditing}
                  onToggleEdit={() => setContractEditing((current) => !current)}
                  onCancel={() => setContractEditing(false)}
                  onSave={() => handleCardSave("contract")}
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    {contractEditing ? (
                      <>
                        <InputField label="Contract Number" value={jobDraft.contractNumber} onChange={(value) => updateJobDraft("contractNumber", value)} />
                        <InputField label="Contract Name" value={jobDraft.contractName} onChange={(value) => updateJobDraft("contractName", value)} />
                        <InputField label="Contract Type" value={jobDraft.contractType} onChange={(value) => updateJobDraft("contractType", value)} />
                      </>
                    ) : (
                      <>
                        <InfoField label="Contract Number" value={employee.job?.contractNumber ?? "-"} />
                        <InfoField label="Contract Name" value={employee.job?.contractName ?? "-"} />
                        <InfoField label="Contract Type" value={employee.job?.contractType ?? "-"} />
                      </>
                    )}
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "Payroll" && (
              <div className="mt-5 space-y-5">
                <SectionCard
                  title="Payroll Information"
                  isEditing={payrollInfoEditing}
                  onToggleEdit={() => setPayrollInfoEditing((current) => !current)}
                  onCancel={() => {
                    setPayrollDraft({ ...employee.payroll! });
                    setPayrollInfoEditing(false);
                  }}
                  onSave={() => handleCardSave("payrollInfo")}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {payrollInfoEditing ? (
                      <>
                        <InputField label="Employment Type" value={payrollDraft.employmentType} onChange={(value) => updatePayrollDraft("employmentType", value)} />
                        <InputField label="Job Title" value={payrollDraft.jobTitle} onChange={(value) => updatePayrollDraft("jobTitle", value)} />
                        <InputField label="Job Date" type="date" value={payrollDraft.jobDate} onChange={(value) => updatePayrollDraft("jobDate", value)} />
                        <InputField label="Geofencing" value={payrollDraft.geofencing} onChange={(value) => updatePayrollDraft("geofencing", value)} />
                        <InputField label="Last Working Date" type="date" value={payrollDraft.lastWorkingDate} onChange={(value) => updatePayrollDraft("lastWorkingDate", value)} />
                        <InputField label="Total Compensation" value={payrollDraft.totalCompensation} onChange={(value) => updatePayrollDraft("totalCompensation", value)} />
                      </>
                    ) : (
                      <>
                        <InfoField label="Employment Type" value={employee.payroll?.employmentType ?? "-"} />
                        <InfoField label="Job Title" value={employee.payroll?.jobTitle ?? "-"} />
                        <InfoField label="Job Date" value={employee.payroll?.jobDate ?? "-"} />
                        <InfoField label="Geofencing" value={employee.payroll?.geofencing ?? "-"} />
                        <InfoField label="Last Working Date" value={employee.payroll?.lastWorkingDate ?? "-"} />
                        <InfoField label="Total Compensation" value={employee.payroll?.totalCompensation ?? "-"} />
                      </>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Compensation Breakdown" isEditing={compensationEditing} onToggleEdit={() => setCompensationEditing((current) => !current)} onCancel={() => setCompensationEditing(false)} onSave={() => handleCardSave("compensation")}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {compensationEditing ? (
                      <>
                        <InputField label="Salary" value={payrollDraft.salary} onChange={(value) => updatePayrollDraft("salary", value)} />
                        <InputField label="Recurring" value={payrollDraft.recurring} onChange={(value) => updatePayrollDraft("recurring", value)} />
                        <InputField label="One-off" value={payrollDraft.oneOff} onChange={(value) => updatePayrollDraft("oneOff", value)} />
                        <InputField label="Offset" value={payrollDraft.offset} onChange={(value) => updatePayrollDraft("offset", value)} />
                      </>
                    ) : (
                      <>
                        <InfoField label="Salary" value={employee.payroll?.salary ?? "-"} />
                        <InfoField label="Recurring" value={employee.payroll?.recurring ?? "-"} />
                        <InfoField label="One-off" value={employee.payroll?.oneOff ?? "-"} />
                        <InfoField label="Offset" value={employee.payroll?.offset ?? "-"} />
                      </>
                    )}
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "Documents" && (
              <div className="mt-5 space-y-5">
                <SectionCard title="Personal Documents" isEditing={false} onToggleEdit={() => undefined} onSave={() => undefined} onCancel={() => undefined}>
                  <div className="space-y-3">
                    {documents.filter((document) => document.category === "Personal Documents").map((document) => (
                      <div key={document.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700"><FileText className="h-4 w-4 text-gray-400" />{document.name}</div>
                        <div className="flex items-center gap-2">
                          <a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.name}`} className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"><ExternalLink className="h-3.5 w-3.5" /></a>
                          <button type="button" onClick={() => removeDocument(document.id)} aria-label={`Delete ${document.name}`} className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                      <p className="text-sm font-medium text-gray-700">Drag &amp; Drop here to upload</p>
                      <p className="mt-1 text-xs text-gray-500">Or select a file from your computer</p>
                      <span className="mt-4 rounded-xl bg-[#111827] px-4 py-2 text-sm font-medium text-white">Upload File</span>
                      <input type="file" className="hidden" onChange={(event) => handleDocumentUpload("Personal Documents", event)} />
                    </label>
                  </div>
                </SectionCard>
                <SectionCard title="Payslips" isEditing={false} onToggleEdit={() => undefined} onSave={() => undefined} onCancel={() => undefined}>
                  <div className="space-y-3">
                    {documents.filter((document) => document.category === "Payslips").map((document) => (
                      <div key={document.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                        <span className="flex items-center gap-3 text-sm text-gray-700"><FileText className="h-4 w-4 text-gray-400" />{document.name}</span>
                        <div className="flex items-center gap-2"><a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.name}`} className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"><ExternalLink className="h-3.5 w-3.5" /></a><button type="button" onClick={() => removeDocument(document.id)} aria-label={`Delete ${document.name}`} className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" /></button></div>
                      </div>
                    ))}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-sm font-medium text-white hover:bg-black">
                      <span>Upload Payslip</span>
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(event) => handleDocumentUpload("Payslips", event)} />
                    </label>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "Setting" && (
              <div className="mt-5 space-y-5">
                <SectionCard title="Account Settings" isEditing={accountSettingsEditing} onToggleEdit={() => setAccountSettingsEditing((current) => !current)} onCancel={() => { setTimezoneDraft(employee.timezone ?? "GMT +07:00"); setAccountSettingsEditing(false); }} onSave={() => handleCardSave("accountSettings")}>
                  {accountSettingsEditing ? (
                    <InputField label="Timezone" value={timezoneDraft} onChange={setTimezoneDraft} />
                  ) : (
                    <InfoField label="Timezone" value={employee.timezone ?? "GMT +07:00"} />
                  )}
                </SectionCard>
                <SectionCard title="Privacy" isEditing={privacyEditing} onToggleEdit={() => setPrivacyEditing((current) => !current)} onCancel={() => { setCalendarVisibilityDraft(employee.calendarVisibility ?? "Everyone"); setPrivacyEditing(false); }} onSave={() => handleCardSave("privacy")}>
                  {privacyEditing ? (
                    <InputField label="Who can see your birthday on calendar?" value={calendarVisibilityDraft} onChange={(value) => setCalendarVisibilityDraft(value as "Everyone" | "Only me")} selectOptions={["Everyone", "Only me"]} />
                  ) : (
                    <InfoField label="Who can see your birthday on calendar?" value={employee.calendarVisibility ?? "Everyone"} />
                  )}
                </SectionCard>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
