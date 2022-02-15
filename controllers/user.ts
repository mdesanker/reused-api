import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const allUsers = async (req: Request, res: Response, next: NextFunction) => {
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

const user = async (req: Request, res: Response, next: NextFunction) => {
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

const userDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user details
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

const userDelete = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Check target id is valid
    const target = await User.findById(id);

    if (!target) {
      return res.status(404).json({ errors: [{ msg: "Invalid user id" }] });
    }

    // Get requestor
    const requestor = await User.findById(req.user.id);

    const isUser = id === req.user.id;

    const isAdmin = requestor?.userType === "admin";

    if (!isUser && !isAdmin) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Delete target
    await User.findByIdAndRemove(id);

    res.json({ msg: "User deleted" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { allUsers, user, userDetail, userDelete };
