import { Router } from "express";
import moveOldRecords from "./archive.controller";

const archive = Router();
archive.post("/archive", moveOldRecords);
