import { Request, Response, NextFunction } from "express";

const all = async (req: Request, res: Response, next: NextFunction) => {
  res.send("GET cart test");
};

export default { all };
