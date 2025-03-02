import { Router } from "express";
import SingleController from "./single.controller.js";

const single = Router();
const singleController = new SingleController();

single.post("/upload", singleController.singleUpload);
single.post("/tuition", singleController.singleTuition);
single.post("/exam", singleController.singleExam);
single.post("/alumni", singleController.singleAlumni);

export default single;
