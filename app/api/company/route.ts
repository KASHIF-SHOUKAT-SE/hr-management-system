import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { connectDatabase } from "@/server/db";
import CompanyModel from "@/server/models/Company";
import UserModel from "@/server/models/User";
import EmployeeModel from "@/server/models/Employee";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const data = await req.json();
    const { companyName, domain, companySize, industry, role, customRole, useCase } = data;

    if (!companyName || !domain) {
      return NextResponse.json(
        { error: "Company name and domain are required" },
        { status: 400 }
      );
    }

    await connectDatabase();

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create Company
    const newCompany = await CompanyModel.create({
      name: companyName,
      domain,
      size: companySize,
      industry,
      role,
      customRole,
      useCase,
      adminId: userId,
    });

    // Update User with companyId
    user.companyId = newCompany._id;
    await user.save();

    // Create First Employee for the admin
    await EmployeeModel.create({
      name: user.name,
      email: user.email,
      jobTitle: customRole || role || "Admin",
      lineManager: "N/A",
      department: "Management",
      office: "HQ",
      status: "active",
      accountStatus: "activated",
      companyId: newCompany._id,
    });

    // Generate new token with companyId
    const newToken = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: newCompany._id.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json(
      { success: true, message: "Company created successfully" },
      { status: 201 }
    );

    response.cookies.set("auth-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Company Creation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
