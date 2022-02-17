import { Router } from "express";
const cart = Router();
import auth from "../../middleware/authMiddleware";
import cartController from "../../controllers/cart";

cart.get("/all", cartController.all);
cart.get("/user/:id", cartController.user);
cart.get("/:id", cartController.cart);
cart.post("/create", auth, cartController.create);
cart.put("/update", auth, cartController.update);

export = cart;
