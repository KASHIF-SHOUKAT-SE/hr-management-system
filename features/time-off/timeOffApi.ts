import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LeaveBalance,
  GetLeaveRequestsParams,
  GetLeaveRequestsResponse,
  GetBalanceHistoryParams,
  GetBalanceHistoryResponse,
  TimeOffFiltersResponse,
  TeamLeaveRequest,
  CreateLeaveRequestPayload,
} from "./timeOff.types";

export const timeOffApi = createApi({
  reducerPath: "timeOffApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["LeaveBalance", "LeaveRequests", "BalanceHistory", "TeamLeaveRequests"],
  endpoints: (builder) => ({
    // Fetch leave balance cards
    getLeaveBalances: builder.query<{ data: LeaveBalance[] }, void>({
      query: () => "/time-off?section=balance",
      providesTags: ["LeaveBalance"],
    }),

    // Fetch leave requests (paginated + filtered)
    getLeaveRequests: builder.query<GetLeaveRequestsResponse, GetLeaveRequestsParams>({
      query: (params) => {
        const sp = new URLSearchParams({ section: "requests" });
        if (params.page) sp.append("page", params.page.toString());
        if (params.limit) sp.append("limit", params.limit.toString());
        if (params.type && params.type !== "All Type") sp.append("type", params.type);
        if (params.status && params.status !== "All Status") sp.append("status", params.status);
        return `/time-off?${sp.toString()}`;
      },
      providesTags: ["LeaveRequests"],
    }),

    // Fetch team leave requests (paginated + filtered)
    getTeamLeaveRequests: builder.query<{ data: TeamLeaveRequest[]; totalCount: number; page: number; limit: number; totalPages: number }, GetLeaveRequestsParams>({
      query: (params) => {
        const sp = new URLSearchParams({ section: "team-requests" });
        if (params.page) sp.append("page", params.page.toString());
        if (params.limit) sp.append("limit", params.limit.toString());
        if (params.type && params.type !== "All Type") sp.append("type", params.type);
        if (params.status && params.status !== "All Status") sp.append("status", params.status);
        return `/time-off?${sp.toString()}`;
      },
      providesTags: ["TeamLeaveRequests"],
    }),

    // Fetch balance history
    getBalanceHistory: builder.query<GetBalanceHistoryResponse, GetBalanceHistoryParams>({
      query: (params) => {
        const sp = new URLSearchParams({ section: "history" });
        if (params.type && params.type !== "All Type") sp.append("type", params.type);
        return `/time-off?${sp.toString()}`;
      },
      providesTags: ["BalanceHistory"],
    }),

    // Fetch unique types for filter dropdowns
    getTimeOffTypes: builder.query<TimeOffFiltersResponse, void>({
      query: () => "/time-off?section=types",
    }),

    // Create a new leave request
    createLeaveRequest: builder.mutation<void, CreateLeaveRequestPayload>({
      query: (payload) => ({
        url: "/time-off",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LeaveRequests", "TeamLeaveRequests"],
    }),
  }),
});

export const {
  useGetLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
  useGetTeamLeaveRequestsQuery,
  useGetBalanceHistoryQuery,
  useGetTimeOffTypesQuery,
  useCreateLeaveRequestMutation,
} = timeOffApi;
