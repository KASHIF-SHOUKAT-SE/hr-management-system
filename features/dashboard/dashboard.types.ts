/* ─── Dashboard data contracts ─── */

export interface StatItem {
  label: string;
  value: number;
  changePercent: number; // positive = up, negative = down
  icon: "employees" | "applicants" | "new" | "resigned";
}

export interface TeamPerformancePoint {
  month: string; // "Jan", "Feb", ...
  projectTeam: number;
  productTeam: number;
}

export interface EmployeeSummarySlice {
  label: string; // "Others", "Onboarding", etc.
  value: number;
  color: string;
}

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  jobTitle: string;
  lineManager: string; // @mention style
  department: string;
  office: string;
}

/* ─── API response wrappers ─── */

export interface DashboardStatsResponse {
  stats: StatItem[];
}

export interface TeamPerformanceResponse {
  data: TeamPerformancePoint[];
}

export interface EmployeeSummaryResponse {
  slices: EmployeeSummarySlice[];
  totalCount: number;
  employees: EmployeeRow[];
}
