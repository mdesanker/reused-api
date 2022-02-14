import { Request, Response, NextFunction } from "express";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);
  res.status(200).send("Test");
};

export default { getUsers };
