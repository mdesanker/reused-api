import { Router } from "express";
const user = Router();
import userController from "../../controllers/user";
import auth from "../../middleware/authMiddleware";

user.get("/all", auth, userController.allUsers);
user.get("/:id", auth, userController.user);
user.get("/current/detail", auth, userController.detail);

export = user;
