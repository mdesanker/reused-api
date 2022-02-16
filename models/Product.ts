import { Schema, Types, model } from "mongoose";

export interface IProduct {
  _id?: String;
  name: String;
  price: String;
  description?: String;
  condition: "new" | "like new" | "excellent" | "good" | "fair" | "poor";
  category: Types.ObjectId;
  date?: Date;
  images: String[];
  owner: Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  condition: {
    type: String,
    enum: ["new", "like new", "excellent", "good", "fair", "poor"],
    required: true,
    default: "good",
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  date: { type: Date, default: Date.now },
  images: [{ type: String }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model<IProduct>("Product", ProductSchema);
