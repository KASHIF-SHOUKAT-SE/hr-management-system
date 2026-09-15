import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { Holiday } from "@/server/models/Holiday";

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();
    
    // Default sorting by "from" date ascending
    const data = await Holiday.find().sort({ from: 1 });
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();
    const body = await request.json();

    const newHoliday = new Holiday(body);
    await newHoliday.save();
    
    return NextResponse.json(newHoliday, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
