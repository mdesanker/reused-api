import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Cart, { ICart } from "../models/Cart";
import User from "../models/User";

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const carts = await Cart.find({}).populate("user", "-password");

    res.json(carts);
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

    // Return user cart
    const cart = await Cart.findOne({ user: user.id }).populate(
      "user",
      "-password"
    );

    res.json(cart);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

const cart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Check id is valid
    const cart = await Cart.findById(id).populate("user", "-password");

    if (!cart) {
      return res.status(404).json({ errors: [{ msg: "Invalid cart id" }] });
    }

    res.json(cart);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check user doesn't already have cart
    const existingCart = await Cart.findOne({ user: req.user.id });

    if (existingCart) {
      return res
        .status(405)
        .json({ errors: [{ msg: "User already has a cart" }] });
    }

    // Create new cart
    const cart = new Cart<ICart>({
      user: new Types.ObjectId(req.user.id),
      products: [],
    });

    await cart.save();

    const newCart = await Cart.populate(cart, { path: "user" });

    res.status(201).json(newCart);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send("Server error");
    }
  }
};

export default { all, user, cart, create };
