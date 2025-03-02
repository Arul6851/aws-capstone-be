import { Router } from "express";
import ModifyController from "./modify.controller.js";

const modify = Router();

const modifyControl = new ModifyController();

modify.post("/fee", modifyControl.updateUserFee);
modify.put("/tuition", modifyControl.updateTuitionFee);
modify.post("/exam", modifyControl.updateExamFee);
modify.post("/alumni", modifyControl.updateAlumniFee);
modify.post("/student", modifyControl.updatestudent);

export default modify;
