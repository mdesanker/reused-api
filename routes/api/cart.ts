import { Router } from "express";
const cart = Router();
import cartController from "../../controllers/cart";

cart.get("/all", cartController.all);
cart.get("/user/:id", cartController.user);
export = cart;
