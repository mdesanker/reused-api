import { Router } from "express";
const category = Router();
import auth from "../../middleware/authMiddleware";

import categoryController from "../../controllers/category";

category.get("/all", categoryController.all);
category.get("/:id", categoryController.category);
category.post("/add", auth, categoryController.add);

export = category;
