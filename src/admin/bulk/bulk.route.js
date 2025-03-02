import { Router } from "express";
import BulkController from "./bulk.controller.js";
import UploadController from "./upload.controller.js";
import bulkUploadTuition from "./tuition.controller.js";
import bulkUploadExam from "./exam.controller.js";
import bulkUploadAlumni from "./alumni.controller.js";

const bulk = Router();
const bulkController = new BulkController();
const uploadController = new UploadController();

// bulk.post("/upload", uploadController.uploadHandler, bulkController.bulkUpload);
bulk.post("/upload/tuition", uploadController.uploadHandler, bulkUploadTuition);
bulk.post("/upload/exam", uploadController.uploadHandler, bulkUploadExam);
bulk.post("/upload/alumni", uploadController.uploadHandler, bulkUploadAlumni);

export default bulk;
