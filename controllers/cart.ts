import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
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

export default { all, user, cart };
