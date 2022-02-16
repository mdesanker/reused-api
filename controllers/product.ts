import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import Product from "../models/Product";

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({}).populate("category owner");

    res.json(products);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all };
