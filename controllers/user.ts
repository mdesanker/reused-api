import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check user credentials
    const user = await User.findById(req.user.id);

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

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Check requestor credentials
    const requestor = await User.findById(req.user.id);

    if (requestor?.userType !== "admin") {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Check id is valid
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "Invalid user id" }] });
    }

    res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { getUsers, getUser };
