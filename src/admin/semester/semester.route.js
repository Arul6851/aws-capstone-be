import { Router } from "express";
import updateStudentSemester from "./semester.controller.js";

const semester = Router();

semester.post("/", updateStudentSemester);

export default semester;
