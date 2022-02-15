import { Router } from "express";
const user = Router();
import userController from "../../controllers/user";
import auth from "../../middleware/authMiddleware";

user.get("/all", auth, userController.allUsers);
user.get("/detail", auth, userController.userDetail);
user.get("/:id", auth, userController.user);
user.delete("/:id", auth, userController.userDelete);

export = user;
