import mongoose from "mongoose";

const leavePolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    description: {
      type: String,
    },
    eligibility: {
      type: String,
      default: "All Employees", // mock simple string for "Assignees"
    },
    accrualFrequency: {
      type: String,
      enum: ["Yearly", "Monthly", "Weekly", "None"],
      default: "Yearly",
    },
    entitlementAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    maxCarryOver: {
      type: Number,
      default: 0,
    },
    carryOverExpiration: {
      type: Number, // represents months or days, mock for now
      default: 0, 
    },
    durationAllowed: {
      isHourlyAllowed: { type: Boolean, default: false },
      standardWorkingHours: { type: Number, default: 8 },
    },
  },
  { timestamps: true }
);

export const LeavePolicy = mongoose.models.LeavePolicy || mongoose.model("LeavePolicy", leavePolicySchema);
