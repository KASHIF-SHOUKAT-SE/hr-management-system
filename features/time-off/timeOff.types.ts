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
