import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import { TimeOffRequest } from "@/server/models/TimeOffRequest";

// Static data for leave balances
const leaveBalances = [
  { id: "1", type: "Annual", remainingDays: 3, totalDays: 12 },
  { id: "2", type: "Engagement", remainingDays: 3, totalDays: 5 },
  { id: "3", type: "Sick Leave", remainingDays: 1, totalDays: 14 },
  { id: "4", type: "Wedding", remainingDays: 3, totalDays: 3 },
  { id: "5", type: "Maternity", remainingDays: 90, totalDays: 90 },
  { id: "6", type: "Paternity", remainingDays: 5, totalDays: 5 },
];

const balanceHistory = [
  { id: "h1", date: "2023-03-01", event: "Take Time Off", type: "Engagement", changedBy: { name: "Pixel Office", avatarUrl: "" }, changeDays: -10 },
  { id: "h2", date: "2023-02-15", event: "Adjustment", type: "Annual", changedBy: { name: "HR Admin", avatarUrl: "" }, changeDays: 5 },
  { id: "h3", date: "2023-01-01", event: "Annual Reset", type: "Annual", changedBy: { name: "System", avatarUrl: "" }, changeDays: 12 },
  { id: "h4", date: "2023-01-01", event: "Annual Reset", type: "Sick Leave", changedBy: { name: "System", avatarUrl: "" }, changeDays: 14 },
  { id: "h5", date: "2023-04-10", event: "Take Time Off", type: "Annual", changedBy: { name: "Pixel Office", avatarUrl: "" }, changeDays: -3 },
];

export async function GET(request: NextRequest) {
  await connectDatabase();
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get("section") || "balance";

  if (section === "balance") {
    return NextResponse.json({ data: leaveBalances });
  }

  if (section === "history") {
    const type = searchParams.get("type") || "";
    let filtered = [...balanceHistory];
    if (type && type !== "All Type") {
      filtered = filtered.filter((h) => h.type === type);
    }
    return NextResponse.json({ data: filtered });
  }

  if (section === "types") {
    const uniqueTypes = [...new Set(leaveBalances.map((b) => b.type))];
    return NextResponse.json({ types: uniqueTypes });
  }

  if (section === "requests" || section === "team-requests") {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    const query: any = {};
    if (type && type !== "All Type") query.type = type;
    if (status && status !== "All Status") query.status = status.toLowerCase();
    
    // For "requests" we'd normally filter by logged-in user ID, but we mock it here.
    // For "team-requests", we show all.

    const totalCount = await TimeOffRequest.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const data = await TimeOffRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ data, totalCount, page, limit, totalPages });
  }

  return NextResponse.json({ error: "Invalid section" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();
    const body = await request.json();

    // In a real app, employee info would come from the auth session.
    // Here we just mock it for the new request.
    const newRequest = new TimeOffRequest({
      ...body,
      status: "pending",
      employee: {
        name: "Current User",
        email: "user@example.com",
        avatarUrl: ""
      }
    });

    await newRequest.save();
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
