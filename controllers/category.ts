import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({});

    res.json(categories);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

const category = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ errors: [{ msg: "Invalid category id" }] });
    }

    res.json(category);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all, category };
