import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { LeaveType } from "@/server/models/LeaveType";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const id = params.id;
    const body = await request.json();

    const updatedType = await LeaveType.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedType) {
      return NextResponse.json({ error: "LeaveType not found" }, { status: 404 });
    }

    return NextResponse.json(updatedType);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const id = params.id;

    const deletedType = await LeaveType.findByIdAndDelete(id);

    if (!deletedType) {
      return NextResponse.json({ error: "LeaveType not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "LeaveType deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
