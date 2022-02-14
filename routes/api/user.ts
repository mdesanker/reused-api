import { Router } from "express";
const user = Router();
import userController from "../../controllers/user";
import auth from "../../middleware/authMiddleware";

user.get("/all", auth, userController.getUsers);

export = user;