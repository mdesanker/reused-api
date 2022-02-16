import { Router } from "express";
const product = Router();
import productController from "../../controllers/product";
import auth from "../../middleware/authMiddleware";

product.get("/all", productController.all);
product.get("/:id", productController.product);
product.get("/category/:id", productController.category);
product.get("/user/:id", productController.user);
product.post("/add", auth, productController.add);
product.put("/:id", auth, productController.update);
product.delete("/:id", auth, productController.deleteProduct);

export = product;
