import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) { return NextResponse.next(); }

export const config = { matcher: ["/dashboard/:path*", "/employees/:path*", "/departments/:path*", "/attendance/:path*", "/leaves/:path*", "/payroll/:path*", "/settings/:path*"] };
