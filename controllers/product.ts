import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import Category from "../models/Category";
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

const product = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Check id is valid
    const product = await Product.findById(id).populate("category owner");

    if (!product) {
      return res.status(404).json({ errors: [{ msg: "Invalid product id" }] });
    }

    res.json(product);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

const category = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Check id is valid
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ errors: [{ msg: "Invalid category id" }] });
    }

    // Get category products
    const products = await Product.find({ category: id }).populate(
      "category owner"
    );

    res.json(products);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all, product, category };
