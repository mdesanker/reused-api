import { Request, Response, NextFunction } from "express";

const all = async (req: Request, res: Response, next: NextFunction) => {
  res.send("Category router test");
};

export default { all };
