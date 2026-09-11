import { NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import EmployeeModel from "@/server/models/Employee";

export async function GET() {
  try {
    await connectDatabase();

    const [offices, jobTitles] = await Promise.all([
      EmployeeModel.distinct("office"),
      EmployeeModel.distinct("jobTitle"),
    ]);

    // Ensure valid non-null string arrays and sort alphabetically
    const formattedOffices = offices
      .filter((o) => typeof o === "string" && o.trim() !== "")
      .sort();
      
    const formattedJobTitles = jobTitles
      .filter((j) => typeof j === "string" && j.trim() !== "")
      .sort();

    return NextResponse.json({
      offices: formattedOffices,
      jobTitles: formattedJobTitles,
    });
  } catch (error) {
    console.error("Failed to fetch employee filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee filters" },
      { status: 500 }
    );
  }
}
