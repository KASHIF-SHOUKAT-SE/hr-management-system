import { NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import EmployeeModel from "@/server/models/Employee";
import type { EmployeeSummaryResponse } from "@/features/dashboard/dashboard.types";

export async function GET() {
  try {
    await connectDatabase();

    // Fetch all employees from MongoDB
    const dbEmployees = await EmployeeModel.find({}).sort({ createdAt: -1 }).lean();

    // Calculate real dynamic counts by status
    const totalCount = dbEmployees.length;
    let onboarding = 0;
    let terminated = 0;
    let onLeave = 0;
    let active = 0;

    for (const emp of dbEmployees) {
      if (emp.status === "onboarding") onboarding++;
      else if (emp.status === "terminated") terminated++;
      else if (emp.status === "on-leave") onLeave++;
      else active++;
    }

    const response: EmployeeSummaryResponse = {
      totalCount,
      slices: [
        { label: "Active", value: active, color: "#16A34A" },
        { label: "Onboarding", value: onboarding, color: "#FBBF24" },
        { label: "Terminated", value: terminated, color: "#3B82F6" },
        { label: "On Leave", value: onLeave, color: "#F97316" },
      ],
      employees: dbEmployees.map((emp) => ({
        id: emp._id.toString(),
        name: emp.name,
        email: emp.email,
        jobTitle: emp.jobTitle,
        lineManager: emp.lineManager,
        department: emp.department,
        office: emp.office,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch employee summary from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee summary" },
      { status: 500 }
    );
  }
}
