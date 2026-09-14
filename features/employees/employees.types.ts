export interface Employee {
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
  joinDate: string;
  resignDate?: string;
  timezone?: string;
  calendarVisibility?: "Everyone" | "Only me";
  documents?: Array<{
    id: string;
    name: string;
    category: "Personal Documents" | "Payslips";
    url: string;
  }>;
  job?: Record<string, string>;
  payroll?: Record<string, string>;
}

export interface GetEmployeesRequest {
  page?: number;
  limit?: number;
  search?: string;
  office?: string;
  jobTitle?: string;
  status?: string;
}

export interface GetEmployeesResponse {
  data: Employee[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetEmployeeFiltersResponse {
  offices: string[];
  jobTitles: string[];
}

