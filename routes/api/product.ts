import { Router } from "express";
const product = Router();
import productController from "../../controllers/product";

product.get("/all", productController.all);
product.get("/:id", productController.product);
product.get("/category/:id", productController.category);
product.get("/user/:id", productController.user);

export = product;
