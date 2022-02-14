import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check user credentials
    const { id } = req.user;

    const user = await User.findById(id);

    if (user?.userType !== "admin") {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Return user list
    const users = await User.find({}).select("-password");

    res.json(users);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { getUsers };
