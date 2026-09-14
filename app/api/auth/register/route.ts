import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import User from "@/server/models/User";

export async function POST(request: Request) {
  try {
    await connectDatabase();
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email aur password zaroori hain." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password kam az kam 6 characters ka hona chahiye." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Ye email pehle se registered hai." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json(
      { success: true, message: "Account ban gaya. Ab login karein." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { success: false, message: "Kuch masla ho gaya, dobara try karein." },
      { status: 500 }
    );
  }
}
