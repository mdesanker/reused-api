import { Router } from "express";
const auth = Router();
import authController from "../../controllers/auth";

auth.post("/register", authController.register);
auth.post("/login", authController.login);

export = auth;
