import { Router } from "express";
import AuthController from "./auth.controller.js";

const auth = Router();
const authController = new AuthController();

auth.post("/login", authController.Login);
auth.post("/admin/register", authController.adminRegister);

export default auth;
