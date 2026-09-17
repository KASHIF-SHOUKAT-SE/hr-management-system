import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { Holiday } from "@/server/models/Holiday";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const id = params.id;
    const body = await request.json();

    const updatedHoliday = await Holiday.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHoliday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHoliday);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const id = params.id;

    const deletedHoliday = await Holiday.findByIdAndDelete(id);

    if (!deletedHoliday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Holiday deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
