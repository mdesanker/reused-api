import { Router } from "express";
const product = Router();
import productController from "../../controllers/product";

product.get("/all", productController.all);

export = product;
