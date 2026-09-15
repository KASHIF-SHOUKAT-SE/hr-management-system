import mongoose from "mongoose";

const leaveTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    unit: {
      type: String,
      enum: ["Days", "Hours"],
      default: "Days",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const LeaveType = mongoose.models.LeaveType || mongoose.model("LeaveType", leaveTypeSchema);
