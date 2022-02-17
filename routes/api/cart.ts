import { Router } from "express";
const cart = Router();
import cartController from "../../controllers/cart";

cart.get("/all", cartController.all);

export = cart;
