import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Employee, GetEmployeesRequest, GetEmployeesResponse, GetEmployeeFiltersResponse } from "./employees.types";

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  joinDate: string;
}

export interface UpdateEmployeeRequest {
  id: string;
  employee: Partial<Employee> & {
    profile?: Record<string, unknown>;
    job?: Record<string, unknown>;
    payroll?: Record<string, unknown>;
    timezone?: string;
    calendarVisibility?: "Everyone" | "Only me";
    documents?: Array<{
      id: string;
      name: string;
      category: "Personal Documents" | "Payslips";
      url: string;
    }>;
  };
}

export const employeesApi = createApi({
  reducerPath: "employeesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/employees/${id}`,
      transformResponse: (response: { data: Employee }) => response.data,
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    }),
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
    createEmployee: builder.mutation<Employee, CreateEmployeeRequest>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation<Employee, UpdateEmployeeRequest>({
      query: ({ id, employee }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: employee,
      }),
      transformResponse: (response: { data: Employee }) => response.data,
      invalidatesTags: (result, error, { id }) => ["Employees", { type: "Employees", id }],
    }),
  }),
});

export const {
  useGetEmployeeByIdQuery,
  useGetEmployeesQuery,
  useGetEmployeeFiltersQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} = employeesApi;
