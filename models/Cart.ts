import { Schema, Types, model } from "mongoose";

export interface ICart {
  _id?: String;
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: Number;
  }[];
}

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default model("Cart", CartSchema);
