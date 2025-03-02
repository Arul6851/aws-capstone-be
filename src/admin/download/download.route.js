import { Router } from "express";
import DownloadController from "./download.controller.js";

const download = new Router();
const downloadController = new DownloadController();

download.post("/receipt",downloadController.downloadReceipt);

export default download;