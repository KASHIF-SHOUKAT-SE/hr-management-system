import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { LeavePolicy } from "@/server/models/LeavePolicy";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const id = params.id;
    const body = await request.json();

    const updatedPolicy = await LeavePolicy.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPolicy) {
      return NextResponse.json({ error: "LeavePolicy not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPolicy);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const id = params.id;

    const deletedPolicy = await LeavePolicy.findByIdAndDelete(id);

    if (!deletedPolicy) {
      return NextResponse.json({ error: "LeavePolicy not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "LeavePolicy deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
