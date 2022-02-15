import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import Category, { ICategory } from "../models/Category";
import User from "../models/User";

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

const add = [
  // Validate and sanitize input
  check("name", "Name is required").trim().notEmpty(),
  check("description").trim(),

  // Process input
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      // Check user is admin
      const user = await User.findById(req.user.id);

      if (user?.userType !== "admin") {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Check name is available
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Category already exists" }] });
      }

      // Create and save category
      const category = new Category<ICategory>({
        name,
        description,
      });

      await category.save();

      res.json(category);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send("Server error");
      }
    }
  },
];

const update = [
  // Validate and sanitize input
  check("name", "Name is required").trim().notEmpty(),
  check("description").trim(),

  // Process input
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const { id } = req.params;

    try {
      // Check user is admin
      const user = await User.findById(req.user.id);

      if (user?.userType !== "admin") {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Check category exists
      const category = await Category.findById(id);

      if (!category) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Invalid category id" }] });
      }

      // Check name is available
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Category already exists" }] });
      }

      // Update category
      const newCategory = new Category<ICategory>({
        _id: id,
        name,
        description,
      });

      const update = await Category.findByIdAndUpdate(id, newCategory, {
        new: true,
      });

      res.json(update);
      next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send("Server error");
      }
    }
  },
];

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    // Check user is admin
    const user = await User.findById(req.user.id);

    if (user?.userType !== "admin") {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Check category exists
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ errors: [{ msg: "Invalid category id" }] });
    }

    // Delete category
    await Category.findByIdAndRemove(id);

    res.json({ msg: "Category deleted" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all, category, add, update, deleteCategory };
