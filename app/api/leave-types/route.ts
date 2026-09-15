import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { LeaveType } from "@/server/models/LeaveType";
import { LeavePolicy } from "@/server/models/LeavePolicy";

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();
    const searchParams = request.nextUrl.searchParams;
    const includePolicies = searchParams.get("includePolicies") === "true";
    const activeOnly = searchParams.get("activeOnly") === "true";

    const query = activeOnly ? { isActive: true } : {};
    let types = await LeaveType.find(query).sort({ createdAt: 1 }).lean();

    if (includePolicies) {
      // Fetch policies for all these types
      const typeIds = types.map((t: any) => t._id);
      const policies = await LeavePolicy.find({ leaveType: { $in: typeIds } }).lean();
      
      types = types.map((t: any) => ({
        ...t,
        policies: policies.filter((p: any) => p.leaveType.toString() === t._id.toString())
      }));
    }

    return NextResponse.json({ data: types });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();
    const body = await request.json();

    // Generate code from name if not provided
    if (!body.code && body.name) {
      body.code = body.name.toUpperCase().replace(/\s+/g, "_");
    }

    const newType = new LeaveType(body);
    await newType.save();
    
    return NextResponse.json(newType, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
