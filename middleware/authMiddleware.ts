import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token from header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Authorization denied: invalid token" });
  }

  // Verify token
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_KEY as string);

    req.user = decoded.user;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(401).json({ msg: "Invalid token" });
    }
  }
};

export = authMiddleware;
