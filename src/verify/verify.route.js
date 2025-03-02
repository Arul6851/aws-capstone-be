import { Router } from "express";
import verifyController from "./verify.controller.js";

const verify = Router();
const verifyControlle = new verifyController();
verify.post("/", verifyControlle.verifyToken);
export default verify;
