import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  domain: string;
  size: string;
  industry: string;
  role: string;
  customRole?: string;
  useCase: string;
  adminId: mongoose.Types.ObjectId; // User who created it
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    size: { type: String },
    industry: { type: String },
    role: { type: String },
    customRole: { type: String },
    useCase: { type: String },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CompanyModel: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default CompanyModel;
