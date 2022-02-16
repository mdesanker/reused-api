import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Types } from "mongoose";
import Category from "../models/Category";
import Product, { IProduct } from "../models/Product";
import User from "../models/User";

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

const user = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Check id is valid
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "Invalid user id" }] });
    }

    // Get user products
    const products = await Product.find({ user: id }).populate(
      "category owner"
    );

    res.json(products);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

const add = [
  // Convert images to array
  (req: Request, res: Response, next: NextFunction) => {
    if (!(req.body.images instanceof Array)) {
      if (typeof req.body.images === "undefined") {
        req.body.images = [];
      } else {
        req.body.images = new Array(req.body.images);
      }
    }
    next();
  },

  // Validate and sanitize input
  check("name", "Name is required").trim().notEmpty(),
  check("price", "Price is required").trim().notEmpty(),
  check("description", "Description is required").trim().notEmpty(),
  check("condition", "Condition is required").trim().notEmpty(),
  check("category", "Category is required").trim().notEmpty(),
  check("images.*").trim(),

  // Process input
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description, condition, category, images } = req.body;

    try {
      // Check category is valid
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Invalid category id" }] });
      }

      // Create new product
      const product = new Product<IProduct>({
        name,
        price,
        description,
        condition,
        category,
        images,
        owner: new Types.ObjectId(req.user.id),
      });

      await product.save();

      const savedProduct = await Product.populate(product, {
        path: "category owner",
      });

      res.status(201).json(savedProduct);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send("Server error");
      }
    }
  },
];

const update = [
  // Convert images to array
  (req: Request, res: Response, next: NextFunction) => {
    if (!(req.body.images instanceof Array)) {
      if (typeof req.body.images === "undefined") {
        req.body.images = [];
      } else {
        req.body.images = new Array(req.body.images);
      }
    }
    next();
  },

  // Validate and sanitize input
  check("name", "Name is required").trim().notEmpty(),
  check("price", "Price is required").trim().notEmpty(),
  check("description", "Description is required").trim().notEmpty(),
  check("condition", "Condition is required").trim().notEmpty(),
  check("category", "Category is required").trim().notEmpty(),
  check("images.*").trim(),

  // Process input
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description, condition, category, images } = req.body;

    const { id } = req.params;

    try {
      // Check product id is valid
      const product = await Product.findById(id).populate("category owner");

      if (!product) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Invalid product id" }] });
      }

      // Check user is owner or admin
      const user = await User.findById(req.user.id);

      const isAuthor = user?.id === product.owner.id;

      const isAdmin = user?.userType === "admin";

      if (!isAuthor && !isAdmin) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Check category is valid
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Invalid category id" }] });
      }

      // Update product
      const replacementProduct = new Product<IProduct>({
        _id: id,
        name,
        price,
        description,
        condition,
        category,
        images,
        owner: product.owner._id,
      });

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        replacementProduct,
        { new: true }
      ).populate("category owner");

      res.status(200).json(updatedProduct);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send("Server error");
      }
    }
  },
];

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    // Check id is valid
    const product = await Product.findById(id).populate("owner");

    if (!product) {
      return res.status(404).json({ errors: [{ msg: "Invalid product id" }] });
    }

    // Check user credentials
    const user = await User.findById(req.user.id);

    const isOwner = user?.id === product.owner.id;

    const isAdmin = user?.userType === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Delete product
    await Product.findByIdAndRemove(id);

    res.json({ msg: "Product deleted" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all, product, category, user, add, update, deleteProduct };
