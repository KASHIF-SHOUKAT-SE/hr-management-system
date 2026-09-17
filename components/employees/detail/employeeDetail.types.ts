export type ProfileData = {
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

export type JobData = {
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

export type PayrollData = {
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

export type EmployeeDocument = {
  id: string;
  name: string;
  category: "Personal Documents" | "Payslips";
  url: string;
};

export type EmployeeDetailRecord = {
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

export type AddressDraft = Pick<ProfileData, "primaryAddress" | "country" | "stateProvince" | "city" | "postCode">;

export type SaveCardType =
  | "personal"
  | "address"
  | "emergency"
  | "jobInfo"
  | "contract"
  | "payrollInfo"
  | "compensation"
  | "accountSettings"
  | "privacy";
