import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// We need to ensure we don't redefine the model if it already exists (e.g. in dev mode with HMR)
export const Holiday = mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema);
