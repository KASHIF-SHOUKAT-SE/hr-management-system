import mongoose from "mongoose";

const TimeOffRequestSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    totalDays: { type: Number, required: true },
    type: { type: String, required: true },
    attachmentName: { type: String, default: null },
    status: { 
      type: String, 
      enum: ["approved", "pending", "rejected"], 
      default: "pending" 
    },
    note: { type: String, default: "" },
    // Mock user info since we don't have auth/user models yet
    employee: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatarUrl: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

// Virtual for ID
TimeOffRequestSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included when converting to JSON
TimeOffRequestSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    const response = ret as Record<string, unknown>;
    delete response._id;
    delete response.__v;
  },
});

export const TimeOffRequest = 
  mongoose.models.TimeOffRequest || mongoose.model("TimeOffRequest", TimeOffRequestSchema);
