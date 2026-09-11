import { NextResponse } from "next/server";
import type { TeamPerformanceResponse } from "@/features/dashboard/dashboard.types";

export async function GET() {
  const response: TeamPerformanceResponse = {
    data: [
      { month: "Jan", projectTeam: 35000, productTeam: 42000 },
      { month: "Feb", projectTeam: 38000, productTeam: 40000 },
      { month: "Mar", projectTeam: 42000, productTeam: 45000 },
      { month: "Apr", projectTeam: 48000, productTeam: 43000 },
      { month: "May", projectTeam: 44000, productTeam: 47000 },
      { month: "Jun", projectTeam: 52000, productTeam: 50000 },
      { month: "Jul", projectTeam: 50000, productTeam: 48000 },
    ],
  };

  return NextResponse.json(response);
}
