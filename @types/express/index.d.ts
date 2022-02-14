import express from "express";
import { Express } from "express-serve-static-core";
import { IUser } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      // user?: Record<string, any>;
      user?: IUser;
    }
  }
}

// declare namespace Express {
//   export interface Request {
//     user?: any;
//   }
// }

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: string;
//   }
//   interface Response {
//     user?: string;
//   }
// }
