import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GetEmployeesRequest, GetEmployeesResponse, GetEmployeeFiltersResponse } from "./employees.types";

export const employeesApi = createApi({
  reducerPath: "employeesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query<GetEmployeesResponse, GetEmployeesRequest>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.search) searchParams.append("search", params.search);
        if (params.office && params.office !== "All Offices") searchParams.append("office", params.office);
        if (params.jobTitle && params.jobTitle !== "All Job Titles") searchParams.append("jobTitle", params.jobTitle);
        if (params.status && params.status !== "All Status") searchParams.append("status", params.status);

        return {
          url: `/employees?${searchParams.toString()}`,
        };
      },
      providesTags: ["Employees"],
    }),
    getEmployeeFilters: builder.query<GetEmployeeFiltersResponse, void>({
      query: () => "/employees/filters",
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetEmployeesQuery, useGetEmployeeFiltersQuery } = employeesApi;
