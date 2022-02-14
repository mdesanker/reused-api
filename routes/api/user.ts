import { Router } from "express";
const user = Router();
import userController from "../../controllers/user";

user.get("/", userController.test);

export = user;
