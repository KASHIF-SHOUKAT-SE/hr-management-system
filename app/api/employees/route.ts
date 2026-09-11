import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import EmployeeModel from "@/server/models/Employee";

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const office = searchParams.get("office") || "";
    const jobTitle = searchParams.get("jobTitle") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Build the query object
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (office && office !== "All Offices") {
      query.office = office;
    }

    if (jobTitle && jobTitle !== "All Job Titles") {
      query.jobTitle = jobTitle;
    }

    if (status && status !== "All Status") {
      // Mapping "Active" -> "active", "On Boarding" -> "onboarding", "Probation" -> "probation", "On Leave" -> "on-leave"
      const statusMap: Record<string, string> = {
        "Active": "active",
        "On Boarding": "onboarding",
        "Probation": "probation",
        "On Leave": "on-leave",
      };
      
      const mappedStatus = statusMap[status];
      if (mappedStatus) {
        query.status = mappedStatus;
      } else {
        query.status = status.toLowerCase();
      }
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    const [employees, totalCount] = await Promise.all([
      EmployeeModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      EmployeeModel.countDocuments(query),
    ]);

    // Map _id to id for the frontend
    const formattedEmployees = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      _id: undefined,
      __v: undefined,
    }));

    return NextResponse.json({
      data: formattedEmployees,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return Response.json(
    { message: "Employee creation ready for implementation." },
    { status: 501 }
  );
}
