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
