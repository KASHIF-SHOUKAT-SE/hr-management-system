import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Hashed password
  role: "admin" | "hr" | "employee";
  companyId?: mongoose.Types.ObjectId; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "hr", "employee"],
      default: "admin",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev (Next.js hot reload)
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;

// Re-export old type for backward compatibility if needed in UI types
export type User = {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "hr" | "employee";
};
