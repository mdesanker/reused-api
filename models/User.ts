import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  userType: "user" | "admin";
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  userType: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
});

export default model<IUser>("User", UserSchema);
