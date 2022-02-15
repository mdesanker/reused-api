import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const all = (req: Request, res: Response, next: NextFunction) => {
  res.send("GET product test");
};

export default { all };
