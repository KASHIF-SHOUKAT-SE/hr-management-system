import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

export default models.User || model("User", UserSchema);
export type User = { id: string; email: string; role: "admin" | "hr" | "employee" };
