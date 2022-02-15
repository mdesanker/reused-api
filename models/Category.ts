import { Schema, model } from "mongoose";

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
});

export default model<ICategory>("Category", CategorySchema);
