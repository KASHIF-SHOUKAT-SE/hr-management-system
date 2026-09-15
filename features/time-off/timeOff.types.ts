/* ── Leave Balance ── */

export interface LeaveBalance {
  id: string;
  type: string;
  remainingDays: number;
  totalDays: number;
}

/* ── Leave Request ── */

export type LeaveRequestStatus = "approved" | "pending" | "rejected";

export interface LeaveRequest {
  id: string;
  from: string;
  to: string;
  totalDays: number;
  type: string;
  attachmentName: string | null;
  status: LeaveRequestStatus;
  note?: string;
}

export interface TeamLeaveRequest extends LeaveRequest {
  employee: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface CreateLeaveRequestPayload {
  from: string;
  to: string;
  totalDays: number;
  type: string;
  note: string;
  attachmentName: string | null;
}

export interface GetLeaveRequestsParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

export interface GetLeaveRequestsResponse {
  data: LeaveRequest[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── Balance History ── */

export interface BalanceHistoryEntry {
  id: string;
  date: string;
  event: string;
  type: string;
  changedBy: {
    name: string;
    avatarUrl?: string;
  };
  changeDays: number;
}

export interface GetBalanceHistoryParams {
  type?: string;
}

export interface GetBalanceHistoryResponse {
  data: BalanceHistoryEntry[];
}

/* ── Filter Options ── */

export interface TimeOffFiltersResponse {
  types: string[];
}

/* ── Holidays ── */

export interface Holiday {
  _id: string;
  name: string;
  from: string;
  to: string;
}

export interface CreateHolidayPayload {
  name: string;
  from: string;
  to: string;
}

/* ── Leave Types & Policies ── */

export interface LeaveType {
  _id: string;
  name: string;
  code: string;
  isPaid: boolean;
  unit: "Days" | "Hours";
  isActive: boolean;
  policies?: LeavePolicy[];
}

export interface CreateLeaveTypePayload {
  name: string;
  isPaid: boolean;
  unit: "Days" | "Hours";
  isActive?: boolean;
}

export interface LeavePolicy {
  _id: string;
  name: string;
  leaveType: string | LeaveType;
  description?: string;
  eligibility: string;
  accrualFrequency: "Yearly" | "Monthly" | "Weekly" | "None";
  entitlementAmount: number;
  maxCarryOver: number;
  carryOverExpiration: number;
  durationAllowed: {
    isHourlyAllowed: boolean;
    standardWorkingHours: number;
  };
}

export interface CreateLeavePolicyPayload {
  name: string;
  leaveType: string;
  description?: string;
  eligibility?: string;
  accrualFrequency?: "Yearly" | "Monthly" | "Weekly" | "None";
  entitlementAmount: number;
  maxCarryOver?: number;
  carryOverExpiration?: number;
  durationAllowed?: {
    isHourlyAllowed: boolean;
    standardWorkingHours: number;
  };
}

