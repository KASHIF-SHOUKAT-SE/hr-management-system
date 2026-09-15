import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/server/db";
import EmployeeModel from "@/server/models/Employee";

type EmployeeRouteContext = { params: Promise<{ id: string }> };

function mapEmployeeDocument(employee: Record<string, any>) {
  if (!employee) return null;

  return {
    id: employee._id?.toString?.() ?? employee.id,
    name: employee.name,
    email: employee.email,
    avatarUrl: employee.avatarUrl ?? "",
    jobTitle: employee.jobTitle,
    lineManager: employee.lineManager,
    department: employee.department,
    office: employee.office,
    status: employee.status,
    accountStatus: employee.accountStatus,
    joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString() : new Date().toISOString(),
    resignDate: employee.resignDate ? new Date(employee.resignDate).toISOString() : undefined,
    timezone: employee.timezone ?? "GMT +07:00",
    phoneNumber: employee.phoneNumber ?? "",
    calendarVisibility: employee.calendarVisibility ?? "Everyone",
    documents: employee.documents ?? [],
    job: employee.job ?? {},
    payroll: employee.payroll ?? {},
    profile: {
      gender: employee.profile?.gender ?? "Female",
      dateOfBirth: employee.profile?.dateOfBirth ? new Date(employee.profile.dateOfBirth).toISOString() : "1997-03-29",
      maritalStatus: employee.profile?.maritalStatus ?? "Single",
      nationality: employee.profile?.nationality ?? "Indonesian",
      personalTaxId: employee.profile?.personalTaxId ?? "",
      emailAddress: employee.profile?.emailAddress ?? employee.email,
      socialInsurance: employee.profile?.socialInsurance ?? "",
      healthInsurance: employee.profile?.healthInsurance ?? "",
      phoneNumber: employee.profile?.phoneNumber ?? employee.phoneNumber ?? "",
      primaryAddress: employee.profile?.primaryAddress ?? "",
      country: employee.profile?.country ?? "Indonesia",
      stateProvince: employee.profile?.stateProvince ?? "Central Java",
      city: employee.profile?.city ?? "Semarang",
      postCode: employee.profile?.postCode ?? "",
      emergencyContact: {
        fullName: employee.profile?.emergencyContact?.fullName ?? "",
        relationship: employee.profile?.emergencyContact?.relationship ?? "",
        phoneNumber: employee.profile?.emergencyContact?.phoneNumber ?? "",
        emailAddress: employee.profile?.emergencyContact?.emailAddress ?? "",
      },
    },
  };
}

export async function GET(_request: Request, { params }: EmployeeRouteContext) {
  try {
    await connectDatabase();
    const { id } = await params;
    const employee = await EmployeeModel.findById(id).lean();

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ data: mapEmployeeDocument(employee) });
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: EmployeeRouteContext) {
  try {
    await connectDatabase();
    const { id } = await params;
    const body = await request.json();

    const currentEmployee = await EmployeeModel.findById(id);
    if (!currentEmployee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const currentProfile = currentEmployee.profile ?? {};
    const nextProfile = {
      ...currentProfile,
      ...(body.profile ?? {}),
      emergencyContact: {
        ...(currentProfile.emergencyContact ?? {}),
        ...(body.profile?.emergencyContact ?? {}),
      },
    };

    if (body.name) currentEmployee.name = body.name;
    if (body.email) currentEmployee.email = body.email;
    if (body.jobTitle) currentEmployee.jobTitle = body.jobTitle;
    if (body.lineManager) currentEmployee.lineManager = body.lineManager;
    if (body.department) currentEmployee.department = body.department;
    if (body.office) currentEmployee.office = body.office;
    if (body.status) currentEmployee.status = body.status;
    if (body.accountStatus) currentEmployee.accountStatus = body.accountStatus;
    if (body.phoneNumber !== undefined) currentEmployee.phoneNumber = body.phoneNumber;
    if (body.timezone !== undefined) currentEmployee.timezone = body.timezone;
    if (body.calendarVisibility !== undefined) currentEmployee.calendarVisibility = body.calendarVisibility;
    if (body.documents !== undefined) {
      currentEmployee.documents = body.documents;
      currentEmployee.markModified("documents");
    }
    if (body.profile) currentEmployee.profile = nextProfile;

    const updateFields: Record<string, unknown> = {
      ...(body.name ? { name: body.name } : {}),
      ...(body.email ? { email: body.email } : {}),
      ...(body.jobTitle ? { jobTitle: body.jobTitle } : {}),
      ...(body.lineManager ? { lineManager: body.lineManager } : {}),
      ...(body.department ? { department: body.department } : {}),
      ...(body.office ? { office: body.office } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.accountStatus ? { accountStatus: body.accountStatus } : {}),
      ...(body.phoneNumber !== undefined ? { phoneNumber: body.phoneNumber } : {}),
      ...(body.timezone !== undefined ? { timezone: body.timezone } : {}),
      ...(body.calendarVisibility !== undefined ? { calendarVisibility: body.calendarVisibility } : {}),
      ...(body.profile ? { profile: nextProfile } : {}),
      ...(body.job ? { job: { ...(currentEmployee.job ?? {}), ...body.job } } : {}),
      ...(body.payroll ? { payroll: { ...(currentEmployee.payroll ?? {}), ...body.payroll } } : {}),
      ...(body.documents !== undefined ? { documents: body.documents } : {}),
    };

    const updatedEmployee = Object.keys(updateFields).length > 0
      ? await EmployeeModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true, strict: false }).lean()
      : await currentEmployee.save();
    const updatedEmployeeData = typeof updatedEmployee.toObject === "function"
      ? updatedEmployee.toObject()
      : updatedEmployee;

    return NextResponse.json({
      data: mapEmployeeDocument(updatedEmployeeData),
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Failed to update employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE() { return NextResponse.json({ message: "Employee deletion ready for implementation." }, { status: 501 }); }
