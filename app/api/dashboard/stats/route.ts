import { NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import EmployeeModel from "@/server/models/Employee";
import type { DashboardStatsResponse } from "@/features/dashboard/dashboard.types";

export async function GET() {
  try {
    await connectDatabase();

    const totalEmployees = await EmployeeModel.countDocuments({});
    const newEmployees = await EmployeeModel.countDocuments({ status: "onboarding" });
    const resignedEmployees = await EmployeeModel.countDocuments({ status: "terminated" });

    const response: DashboardStatsResponse = {
      stats: [
        { label: "Total Employees", value: totalEmployees, changePercent: 25.5, icon: "employees" },
        { label: "Job Applicants", value: 1150, changePercent: 4.1, icon: "applicants" },
        { label: "New Employees", value: newEmployees, changePercent: 5.1, icon: "new" },
        { label: "Resigned Employees", value: resignedEmployees, changePercent: -25.5, icon: "resigned" },
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch dashboard stats from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
