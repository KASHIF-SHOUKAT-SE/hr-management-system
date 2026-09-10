import { apiRequest } from "@/lib/axios";
import type { Employee } from "@/server/models/Employee";

export function getEmployees() { return apiRequest<Employee[]>("/employees"); }
