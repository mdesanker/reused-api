import express from "express";
import { Express } from "express-serve-static-core";
import { IUser } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      // user?: Record<string, any>;
      user: {
        id?: string;
        // id?: Record<string, string>;
      };
    }
  }
}
