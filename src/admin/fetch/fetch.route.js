import { Router } from "express";
import FetchController from "./fetch.controller.js";

const fetch = Router();
const fetchController = new FetchController();

// fetch.get("/", fetchController.fetchAll);
fetch.get("/students", fetchController.fetchStudents);
fetch.get("/tuition", fetchController.fetchTuition);
fetch.get("/exam", fetchController.fetchExam);
fetch.get("/alumni", fetchController.fetchAlumni);

export default fetch;
