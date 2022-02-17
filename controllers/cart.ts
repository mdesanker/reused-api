import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const carts = await Cart.find({}).populate("user");

    res.json(carts);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all };
