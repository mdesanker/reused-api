import { Router } from "express";
const user = Router();
import userController from "../../controllers/user";
import auth from "../../middleware/authMiddleware";

user.get("/all", auth, userController.all);
user.get("/detail", auth, userController.detail);
user.get("/:id", auth, userController.user);
user.delete("/:id", auth, userController.deleteUser);

export = user;
