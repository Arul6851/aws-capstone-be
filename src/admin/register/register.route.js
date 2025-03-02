import { Router } from "express";
import UploadController from "./upload.controller.js";
import registerStudentBulk from "./registerBulk.controller.js";
import registerStudentSingle from "./registerSingle.controller.js";

const register = Router();
const uploadController = new UploadController();

register.post("/bulk", uploadController.uploadHandler, registerStudentBulk);
register.post("/single", uploadController.uploadHandler, registerStudentSingle);
export default register;
