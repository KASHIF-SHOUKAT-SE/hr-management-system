import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  avatarUrl?: string;
  jobTitle: string;
  lineManager: string;
  department: string;
  office: string;
  status: "active" | "onboarding" | "probation" | "on-leave" | "terminated";
  accountStatus: "activated" | "need-invitation";
  joinDate: Date;
  resignDate?: Date;
  timezone?: string;
  phoneNumber?: string;
  calendarVisibility?: "Everyone" | "Only me";
  documents?: Array<{
    id: string;
    name: string;
    category: "Personal Documents" | "Payslips";
    url: string;
  }>;
  job?: {
    employeeId?: string;
    serviceYear?: string;
    positionType?: string;
    employmentType?: string;
    contractNumber?: string;
    contractName?: string;
    contractType?: string;
    effectiveDate?: Date | string;
    workSchedule?: string;
  };
  payroll?: {
    employmentType?: string;
    jobTitle?: string;
    jobDate?: Date | string;
    geofencing?: string;
    lastWorkingDate?: Date | string;
    totalCompensation?: string;
    salary?: string;
    recurring?: string;
    oneOff?: string;
    offset?: string;
  };
  profile?: {
    gender?: string;
    dateOfBirth?: Date | string;
    maritalStatus?: string;
    nationality?: string;
    personalTaxId?: string;
    emailAddress?: string;
    socialInsurance?: string;
    healthInsurance?: string;
    phoneNumber?: string;
    primaryAddress?: string;
    country?: string;
    stateProvince?: string;
    city?: string;
    postCode?: string;
    emergencyContact?: {
      fullName?: string;
      relationship?: string;
      phoneNumber?: string;
      emailAddress?: string;
    };
  };
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    jobTitle: { type: String, required: true },
    lineManager: { type: String, required: true },
    department: { type: String, required: true },
    office: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "onboarding", "probation", "on-leave", "terminated"],
      default: "active",
    },
    accountStatus: {
      type: String,
      enum: ["activated", "need-invitation"],
      default: "need-invitation",
    },
    joinDate: { type: Date, default: Date.now },
    resignDate: { type: Date },
    timezone: { type: String, default: "GMT +07:00" },
    phoneNumber: { type: String },
    calendarVisibility: { type: String, enum: ["Everyone", "Only me"], default: "Everyone" },
    documents: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, enum: ["Personal Documents", "Payslips"], required: true },
      url: { type: String, required: true },
    }],
    job: {
      employeeId: { type: String },
      serviceYear: { type: String },
      positionType: { type: String },
      employmentType: { type: String },
      contractNumber: { type: String },
      contractName: { type: String },
      contractType: { type: String },
      effectiveDate: { type: Date },
      workSchedule: { type: String },
    },
    payroll: {
      employmentType: { type: String },
      jobTitle: { type: String },
      jobDate: { type: Date },
      geofencing: { type: String },
      lastWorkingDate: { type: Date },
      totalCompensation: { type: String },
      salary: { type: String },
      recurring: { type: String },
      oneOff: { type: String },
      offset: { type: String },
    },
    profile: {
      gender: { type: String },
      dateOfBirth: { type: Date },
      maritalStatus: { type: String },
      nationality: { type: String },
      personalTaxId: { type: String },
      emailAddress: { type: String },
      socialInsurance: { type: String },
      healthInsurance: { type: String },
      phoneNumber: { type: String },
      primaryAddress: { type: String },
      country: { type: String },
      stateProvince: { type: String },
      city: { type: String },
      postCode: { type: String },
      emergencyContact: {
        fullName: { type: String },
        relationship: { type: String },
        phoneNumber: { type: String },
        emailAddress: { type: String },
      },
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev (Next.js hot reload)
const EmployeeModel: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default EmployeeModel;

// Re-export the old type for backwards compatibility
export type Employee = {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  status: "active" | "inactive";
};
