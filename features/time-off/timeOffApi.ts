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
  Holiday,
  CreateHolidayPayload,
  LeaveType,
  CreateLeaveTypePayload,
  LeavePolicy,
  CreateLeavePolicyPayload,
} from "./timeOff.types";

export const timeOffApi = createApi({
  reducerPath: "timeOffApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["LeaveBalance", "LeaveRequests", "BalanceHistory", "TeamLeaveRequests", "Holidays", "LeaveTypes", "LeavePolicies"],
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

    // Holidays
    getHolidays: builder.query<{ data: Holiday[] }, void>({
      query: () => "/holidays",
      providesTags: ["Holidays"],
    }),

    createHoliday: builder.mutation<Holiday, CreateHolidayPayload>({
      query: (payload) => ({
        url: "/holidays",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Holidays"],
    }),

    updateHoliday: builder.mutation<Holiday, { id: string; payload: CreateHolidayPayload }>({
      query: ({ id, payload }) => ({
        url: `/holidays/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Holidays"],
    }),

    deleteHoliday: builder.mutation<void, string>({
      query: (id) => ({
        url: `/holidays/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Holidays"],
    }),

    // Leave Types
    getLeaveTypes: builder.query<{ data: LeaveType[] }, { includePolicies?: boolean; activeOnly?: boolean } | void>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.includePolicies) sp.append("includePolicies", "true");
        if (params?.activeOnly) sp.append("activeOnly", "true");
        return `/leave-types?${sp.toString()}`;
      },
      providesTags: ["LeaveTypes"],
    }),

    createLeaveType: builder.mutation<LeaveType, CreateLeaveTypePayload>({
      query: (payload) => ({
        url: "/leave-types",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LeaveTypes", "LeavePolicies"],
    }),

    updateLeaveType: builder.mutation<LeaveType, { id: string; payload: Partial<CreateLeaveTypePayload> }>({
      query: ({ id, payload }) => ({
        url: `/leave-types/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["LeaveTypes", "LeavePolicies"],
    }),

    deleteLeaveType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/leave-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveTypes", "LeavePolicies"],
    }),

    // Leave Policies
    getLeavePolicies: builder.query<{ data: LeavePolicy[] }, void>({
      query: () => "/leave-policies",
      providesTags: ["LeavePolicies"],
    }),

    createLeavePolicy: builder.mutation<LeavePolicy, CreateLeavePolicyPayload>({
      query: (payload) => ({
        url: "/leave-policies",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LeavePolicies", "LeaveTypes"],
    }),

    updateLeavePolicy: builder.mutation<LeavePolicy, { id: string; payload: Partial<CreateLeavePolicyPayload> }>({
      query: ({ id, payload }) => ({
        url: `/leave-policies/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["LeavePolicies", "LeaveTypes"],
    }),

    deleteLeavePolicy: builder.mutation<void, string>({
      query: (id) => ({
        url: `/leave-policies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeavePolicies", "LeaveTypes"],
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
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
  useGetLeavePoliciesQuery,
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
  useDeleteLeavePolicyMutation,
} = timeOffApi;

