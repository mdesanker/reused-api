import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User, { IUser } from "../models/User";

const test = (req: Request, res: Response, next: NextFunction) => {
  res.send("Test");
};

const register = [
  // Validate and sanitize input
  check("username", "Username is required").trim().notEmpty(),
  check("email", "Email is required").trim().notEmpty(),
  check("password", "Password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("userType").trim(),

  // Process input
  async (req: Request, res: Response, next: NextFunction) => {
    // Handle input errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, userType } = req.body;

    try {
      // Check email not associated with account
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(409)
          .json({ errors: [{ msg: "Email is already in use" }] });
      }

      // Create new user
      const user = new User<IUser>({
        username,
        email,
        password,
        userType,
      });

      user.password = await bcrypt.hash(password, 10);

      await user.save();

      // Generate jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_KEY as string, {
        expiresIn: "6h",
      });

      res.status(201).json({ token });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send("Server error");
      }
    }
  },
];

const login = [
  // Validate and sanitize input
  check("email", "Email is required").trim().notEmpty(),
  check("password", "Password is required").trim(),

  // Process input
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Generate jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_KEY as string, {
        expiresIn: "6h",
      });

      res.status(201).json({ token });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send("Server error");
      }
    }
  },
];

export default { test, register, login };
