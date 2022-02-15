import { Router } from "express";
const category = Router();
import auth from "../../middleware/authMiddleware";

import categoryController from "../../controllers/category";

category.get("/all", categoryController.all);
category.get("/:id", categoryController.category);
category.post("/add", auth, categoryController.add);
category.put("/:id", auth, categoryController.update);
category.delete("/:id", auth, categoryController.deleteCategory);

export = category;
