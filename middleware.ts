import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	const secret = process.env.JWT_SECRET;

	if (!token || !secret) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		await jwtVerify(token, new TextEncoder().encode(secret));
		return NextResponse.next();
	} catch {
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("token");
		return response;
	}
}

export const config = { matcher: ["/dashboard/:path*", "/employees/:path*", "/departments/:path*", "/attendance/:path*", "/leaves/:path*", "/payroll/:path*", "/settings/:path*"] };
