import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // If the user hasn't completed company onboarding, redirect them to onboarding
    // unless they are already on the onboarding routes.
    // Wait, the matcher only covers dashboard routes anyway, so this is perfect!
    if (!payload.companyId) {
      return NextResponse.redirect(new URL("/company-info", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT Verification failed in proxy:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/attendance/:path*",
    "/leaves/:path*",
    "/payroll/:path*",
    "/settings/:path*",
  ],
};












