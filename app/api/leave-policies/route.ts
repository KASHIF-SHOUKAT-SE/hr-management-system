import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { LeavePolicy } from "@/server/models/LeavePolicy";

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();
    const data = await LeavePolicy.find().populate("leaveType").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();
    const body = await request.json();

    const newPolicy = new LeavePolicy(body);
    await newPolicy.save();
    
    return NextResponse.json(newPolicy, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
