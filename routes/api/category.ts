import { Router } from "express";
const category = Router();

import categoryController from "../../controllers/category";

category.get("/all", categoryController.all);
category.get("/:id", categoryController.category);

export = category;
