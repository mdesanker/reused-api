import { Request, Response, NextFunction } from "express";

const test = (req: Request, res: Response, next: NextFunction) => {
  res.send("Test");
};

export default { test };
