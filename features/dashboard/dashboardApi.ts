import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  DashboardStatsResponse,
  TeamPerformanceResponse,
  EmployeeSummaryResponse,
} from "./dashboard.types";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/dashboard" }),
  tagTypes: ["Stats", "TeamPerformance", "EmployeeSummary"],
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),
    getTeamPerformance: builder.query<TeamPerformanceResponse, { range?: string }>({
      query: ({ range } = {}) => ({
        url: "/team-performance",
        params: range ? { range } : undefined,
      }),
      providesTags: ["TeamPerformance"],
    }),
    getEmployeeSummary: builder.query<EmployeeSummaryResponse, { range?: string }>({
      query: ({ range } = {}) => ({
        url: "/employee-summary",
        params: range ? { range } : undefined,
      }),
      providesTags: ["EmployeeSummary"],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetTeamPerformanceQuery,
  useGetEmployeeSummaryQuery,
} = dashboardApi;
