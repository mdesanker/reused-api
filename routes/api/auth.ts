import { Router } from "express";
const auth = Router();
import authController from "../../controllers/auth";

auth.get("/", authController.test);

export = auth;
