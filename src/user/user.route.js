import { Router } from "express";
import UserController from "./user.controller.js";

const user = Router();
const userController = new UserController();

user.get("/", userController.getUserDetails);

export default user;
