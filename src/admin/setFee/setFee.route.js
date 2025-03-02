import { Router } from "express";
import setAlumniFee from "./setAlumni.controller.js";
import SetTuitionFee from "./setTuition.controller.js";
import setExamFee from "./setExam.controller.js";
import enableTuitionFee from "./enable.controller.js";

const setFee = Router();
const tuition = new SetTuitionFee();

setFee.post("/tuition/enable", enableTuitionFee);
setFee.post("/tuition/base", tuition.setTuitionFee);
setFee.post("/tuition/scholar", tuition.setScholarshipFee);
setFee.post("/exam", setExamFee);
setFee.post("/alumni", setAlumniFee);

export default setFee;
